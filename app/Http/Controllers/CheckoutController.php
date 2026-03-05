<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Address;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\PayFastService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Coupon;

class CheckoutController extends Controller
{
    const SHIPPING_RATE = 99.99;
    const FREE_SHIPPING_THRESHOLD = 500;
    const VAT_RATE = 0.15; // 15%

    protected $payfast;

    public function __construct(PayFastService $payfast)
    {
        $this->payfast = $payfast;
    }

    /**
     * Show checkout page with cart summary and address form
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('message', 'Please login to checkout');
        }

        // Get user's cart
        $cart = Cart::with([
            'cartItems.product.category',
            'cartItems.product.productImages'
        ])->where('user_id', $user->id)->first();

        if (!$cart || $cart->cartItems->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty');
        }

        // Calculate cart totals
        $cartData = $this->calculateCartTotals($cart);

        // Get user's saved addresses
        $addresses = Address::where('user_id', $user->id)->get();

        // Get default addresses
        $defaultShipping = $addresses->where('address_type', 'Shipping')
            ->where('is_default', 1)->first();
        $defaultBilling = $addresses->where('address_type', 'Billing')
            ->where('is_default', 1)->first();

        // If no default billing but shipping exists, use shipping
        if (!$defaultBilling && $defaultShipping) {
            $defaultBilling = $defaultShipping;
        }

        return Inertia::render('Checkout', [
            'cart' => array_merge($cart->toArray(), $cartData),
            'addresses' => $addresses,
            'defaultShipping' => $defaultShipping,
            'defaultBilling' => $defaultBilling,
            'provinces' => [
                'Gauteng',
                'Western Cape',
                'KwaZulu-Natal',
                'Eastern Cape',
                'Free State',
                'Limpopo',
                'Mpumalanga',
                'North West',
                'Northern Cape'
            ],
        ]);
    }

    /**
     * Process checkout and create order
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            // Shipping address
            'shipping.address_line1' => 'required|string|max:255',
            'shipping.address_line2' => 'nullable|string|max:255',
            'shipping.surburb' => 'required|string|max:255',
            'shipping.city' => 'required|string|max:255',
            'shipping.province' => 'required|string',
            'shipping.postal_code' => 'required|string|size:4',
            'shipping.phone_number' => 'required|string|size:10',
            'shipping.save_address' => 'boolean',
            'shipping.is_default' => 'boolean',

            // Billing address
            'billing.same_as_shipping' => 'boolean',
            'billing.address_line1' => 'required_if:billing.same_as_shipping,false|string|max:255',
            'billing.address_line2' => 'nullable|string|max:255',
            'billing.surburb' => 'required_if:billing.same_as_shipping,false|string|max:255',
            'billing.city' => 'required_if:billing.same_as_shipping,false|string|max:255',
            'billing.province' => 'required_if:billing.same_as_shipping,false|string',
            'billing.postal_code' => 'required_if:billing.same_as_shipping,false|string|size:4',
            'billing.phone_number' => 'required_if:billing.same_as_shipping,false|string|size:10',
            'billing.save_address' => 'boolean',

            // Payment
            'payment_method' => 'required|string|in:payfast,eft,cash_on_delivery',
            'customer_note' => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();

        try {
            // Get cart
            $cart = Cart::with('cartItems.product')
                ->where('user_id', $user->id)
                ->firstOrFail();

            if ($cart->cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // 1. Create or get shipping address
            $shippingAddress = $this->createOrGetAddress($user, $validated['shipping'], 'Shipping');

            // 2. Create or get billing address
            if ($validated['billing']['same_as_shipping'] ?? false) {
                $billingAddress = $shippingAddress;
            } else {
                $billingAddress = $this->createOrGetAddress($user, $validated['billing'], 'Billing');
            }

            // 3. Calculate totals
            $subtotal = $cart->cartItems->sum(function ($item) {
                return $item->quantity * $item->price;
            });

            // Apply coupon if provided
            $couponResult = $this->applyCoupon($request->coupon_code, $subtotal);
            $discountAmount = $couponResult['discount_amount'];
            $couponId = $couponResult['coupon_id'];
            $couponCode = $couponResult['coupon_code'];

            $shipping = $subtotal > self::FREE_SHIPPING_THRESHOLD ? 0 : self::SHIPPING_RATE;
            $tax = $subtotal * self::VAT_RATE;
            $total = $subtotal + $tax + $shipping;

            // 4. Generate order number
            $orderNumber = $this->generateOrderNumber();

            /// 5. Create order (NO stock deduction yet)
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'stock_deducted' => false,
                'subtotal' => $subtotal,
                'vat' => $tax,
                'shipping_amount' => $shipping,
                'discount_amount' => $discountAmount,
                'total_amount' => $total,
                'currency' => 'ZAR',
                'payment_method' => $validated['payment_method'],
                'customer_note' => $validated['customer_note'] ?? null,
                'coupon_id' => $couponId,
                'coupon_code' => $couponCode,
            ]);

            // After order is created successfully, increment coupon usage
            if ($discountAmount > 0 && $couponId) {
                $this->incrementCouponUsage($couponId);
            }

            // 6. Create order items (NO stock deduction yet)
            foreach ($cart->cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'product_sku' => 'SKU-' . str_pad($cartItem->product_id, 5, '0', STR_PAD_LEFT),
                    'product_price' => $cartItem->price,
                    'quantity' => $cartItem->quantity,
                    'total' => $cartItem->quantity * $cartItem->price,
                ]);
                // STOCK NOT DEDUCTED YET
            }

            // 7. Clear cart
            $cart->cartItems()->delete();

            DB::commit();

            // 8. If PayFast, redirect to payment page with HTML form
            if ($validated['payment_method'] === 'payfast') {
                $payfastData = $this->payfast->generatePaymentData($order);

                // Log for debugging (optional)
                Log::info('PayFast redirect for order: ' . $order->order_number);

                // Generate and return HTML redirect page
                $html = $this->getPayFastFormHtml($payfastData);
                return response($html)->header('Content-Type', 'text/html');
            }

            // For other payment methods, just show order confirmation
            return redirect()->route('order.show', $order->id)
                ->with('success', 'Order placed successfully! Please complete payment.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout failed: ' . $e->getMessage());
            return back()->withErrors(['checkout' => 'Failed to process order: ' . $e->getMessage()]);
        }
    }

    /**
     * Generate HTML form that auto-submits to PayFast
     * (Based on the working old PHP example)
     */
    private function getPayFastFormHtml(array $data): string
    {
        $html = '<!DOCTYPE html>
        <html>
        <head>
            <title>Redirecting to PayFast...</title>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding-top: 50px;
                    background: #f5f5f5;
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .message {
                    color: #333;
                    font-size: 18px;
                    margin-top: 20px;
                }
                .note {
                    color: #666;
                    font-size: 14px;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="loader"></div>
            <div class="message">Redirecting to PayFast...</div>
            <div class="note">Please do not close this window</div>
            
            <form id="payfast_form" method="POST" action="' . $this->payfast->getApiUrl() . '">';

        foreach ($data as $key => $value) {
            $html .= '<input type="hidden" name="' . $key . '" value="' . htmlspecialchars($value) . '">';
        }

        $html .= '</form>
            
            <script>
                // Auto-submit the form when page loads
                document.addEventListener("DOMContentLoaded", function() {
                    document.getElementById("payfast_form").submit();
                });
            </script>
        </body>
        </html>';

        return $html;
    }

    /**
     * Confirm payment and deduct stock (called from PayFastController)
     */
    public function confirmPayment($orderId)
    {
        $order = Order::with('items')->findOrFail($orderId);

        // Only deduct if order is paid and stock not already deducted
        if ($order->payment_status === 'paid' && !$order->stock_deducted) {
            foreach ($order->items as $item) {
                Product::where('id', $item->product_id)
                    ->decrement('stock_quantity', $item->quantity);
            }

            // Mark that stock has been deducted
            $order->update(['stock_deducted' => true]);

            Log::info('Stock deducted for order: ' . $order->order_number);
        }

        return true;
    }

    /**
     * Calculate cart totals
     */
    private function calculateCartTotals($cart)
    {
        $subtotal = $cart->cartItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        $shipping = $subtotal > self::FREE_SHIPPING_THRESHOLD ? 0 : self::SHIPPING_RATE;
        $vat = $subtotal * self::VAT_RATE;
        $total = $subtotal + $shipping + $vat;
        $itemCount = $cart->cartItems->sum('quantity');

        return [
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'vat' => $vat,
            'total' => $total,
            'item_count' => $itemCount,
            'free_shipping_threshold' => 500,
            'needs_for_free_shipping' => max(0, 500 - $subtotal)
        ];
    }

    /**
     * Create or get existing address
     */
    private function createOrGetAddress($user, $addressData, $type)
    {
        // Check if we should save this address
        if ($addressData['save_address'] ?? false) {
            // Check if address already exists
            $existingAddress = Address::where('user_id', $user->id)
                ->where('address_line1', $addressData['address_line1'])
                ->where('surburb', $addressData['surburb'])
                ->where('city', $addressData['city'])
                ->where('postal_code', $addressData['postal_code'])
                ->first();

            if ($existingAddress) {
                return $existingAddress;
            }

            // Create new address
            return Address::create([
                'user_id' => $user->id,
                'address_type' => $type,
                'is_default' => $addressData['is_default'] ?? false,
                'address_line1' => $addressData['address_line1'],
                'address_line2' => $addressData['address_line2'] ?? null,
                'surburb' => $addressData['surburb'],
                'city' => $addressData['city'],
                'province' => $addressData['province'],
                'postal_code' => $addressData['postal_code'],
                'country' => 'South Africa',
                'phone_number' => $addressData['phone_number'],
            ]);
        }

        // Create address record even if not saving to user's address book
        return Address::create([
            'user_id' => $user->id,
            'address_type' => $type,
            'is_default' => false,
            'address_line1' => $addressData['address_line1'],
            'address_line2' => $addressData['address_line2'] ?? null,
            'surburb' => $addressData['surburb'],
            'city' => $addressData['city'],
            'province' => $addressData['province'],
            'postal_code' => $addressData['postal_code'],
            'country' => 'South Africa',
            'phone_number' => $addressData['phone_number'],
        ]);
    }

    /**
     * Generate unique order number
     */
    private function generateOrderNumber(): string
    {
        do {
            $date = now()->format('ymd');
            $random = rand(1000, 9999);
            $number = 'GC-ORD-' . $date . $random;
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
    /**
     * Apply coupon to order
     */
    private function applyCoupon($couponCode, $subtotal)
    {
        if (!$couponCode) {
            return [
                'discount_amount' => 0,
                'coupon_id' => null,
                'coupon_code' => null
            ];
        }

        $coupon = Coupon::where('code', $couponCode)->first();

        if (!$coupon) {
            return [
                'discount_amount' => 0,
                'coupon_id' => null,
                'coupon_code' => null
            ];
        }

        // Check if coupon is valid
        if ($coupon->expires_at && now() > $coupon->expires_at) {
            return [
                'discount_amount' => 0,
                'coupon_id' => null,
                'coupon_code' => null
            ];
        }

        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            return [
                'discount_amount' => 0,
                'coupon_id' => null,
                'coupon_code' => null
            ];
        }

        // Calculate discount
        $discountAmount = 0;
        if ($coupon->type === 'fixed') {
            $discountAmount = min($coupon->value, $subtotal);
        } else { // percentage
            $discountAmount = ($coupon->value / 100) * $subtotal;
        }

        return [
            'discount_amount' => round($discountAmount, 2),
            'coupon_id' => $coupon->id,
            'coupon_code' => $coupon->code
        ];
    }

    /**
     * Increment coupon usage count
     */
    private function incrementCouponUsage($couponId)
    {
        if ($couponId) {
            Coupon::where('id', $couponId)->increment('used_count');
        }
    }
}
