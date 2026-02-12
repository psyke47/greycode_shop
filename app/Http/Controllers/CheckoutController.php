<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Address;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
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
                'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
                'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
            ],
            'yocoPublicKey' => env('YOCO_PUBLIC_KEY', 'pk_test_12345') // Add to .env later
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
            'payment_method' => 'required|string|in:yoco,eft,cash_on_delivery',
            'yoco_token' => 'required_if:payment_method,yoco|string',
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

            $vat = $subtotal * 0.15; // 15% VAT
            $shipping = $subtotal > 500 ? 0 : 49.99;
            $total = $subtotal + $vat + $shipping;

            // 4. Generate order number
            $orderNumber = $this->generateOrderNumber();

            // 5. Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'order_status' => 'pending',
                'payment_status' => $validated['payment_method'] === 'yoco' ? 'paid' : 'unpaid',
                'subtotal' => $subtotal,
                'vat' => $vat,
                'shipping_amount' => $shipping,
                'discount_amount' => 0,
                'total_amount' => $total,
                'currency' => 'ZAR',
                'payment_method' => $validated['payment_method'],
                'customer_note' => $validated['customer_note'] ?? null,
            ]);

            // 6. Create order items
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

                // Update stock
                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
            }

            // 7. Create payment record if Yoco
            if ($validated['payment_method'] === 'yoco') {
                // This will be expanded when you integrate Yoco
                $order->payments()->create([
                    'payment_method' => 'yoco',
                    'amount' => $total,
                    'status' => 'completed',
                    'transaction_id' => 'TXN' . time() . rand(1000, 9999),
                    'payment_date' => now(),
                ]);
            }

            // 8. Clear cart
            $cart->cartItems()->delete();

            DB::commit();

            return redirect()->route('order.show', $order->id)
                ->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['checkout' => 'Failed to process order: ' . $e->getMessage()]);
        }
    }

    /**
     * Calculate cart totals
     */
    private function calculateCartTotals($cart)
    {
        $subtotal = $cart->cartItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        $shipping = $subtotal > 500 ? 0 : 49.99;
        $vat = $subtotal * 0.15;
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

        // Don't save, just return null (order will store JSON in shipping_address field)
        // For now, we still create an address record
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
        $date = now()->format('ymd');
        $random = rand(1000, 9999);
        $number = 'GC-ORD-' . $date . $random;

        // Ensure uniqueness
        while (Order::where('order_number', $number)->exists()) {
            $random = rand(1000, 9999);
            $number = 'GC-ORD-' . $date . $random;
        }

        return $number;
    }
}