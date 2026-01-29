<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\Product;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class OrdersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the currently logged in user or use jane@example.com as fallback
        $user = Auth::user();
        
        if (!$user) {
            // Fallback to jane@example.com if no user is logged in
            $user = User::where('email', 'jane@example.com')->first(); 
            
            if (!$user) {
                $this->command->error('No user found. Please log in or ensure jane@example.com exists.');
                return;
            }
        }
        
        $this->command->info("Creating orders for user: {$user->email} ({$user->first_name} {$user->last_name})");

        // Get some products to use in orders
        $products = Product::with('productImages')->get();
        
        if ($products->isEmpty()) {
            $this->command->error('No products found. Please run the StockListSeeder first!');
            return;
        }

        // Check if user has addresses, create if not
        $shippingAddress = Address::where('user_id', $user->id)
            ->where('address_type', 'Shipping')
            ->first();
            
        if (!$shippingAddress) {
            $shippingAddress = Address::create([
                'user_id' => $user->id,
                'address_type' => 'Shipping',
                'is_default' => true,
                'address_line1' => '123 Oak Street',
                'address_line2' => 'Apt 4B',
                'surburb' => 'Sandton',
                'city' => 'Johannesburg',
                'province' => 'Gauteng',
                'postal_code' => '2196',
                'country' => 'South Africa',
                'phone_number' => $user->phone ?? '0821234567',
            ]);
        }

        $billingAddress = Address::where('user_id', $user->id)
            ->where('address_type', 'Billing')
            ->first();
            
        if (!$billingAddress) {
            $billingAddress = Address::create([
                'user_id' => $user->id,
                'address_type' => 'Billing',
                'is_default' => true,
                'address_line1' => '123 Oak Street',
                'address_line2' => 'Apt 4B',
                'surburb' => 'Sandton',
                'city' => 'Johannesburg',
                'province' => 'Gauteng',
                'postal_code' => '2196',
                'country' => 'South Africa',
                'phone_number' => $user->phone ?? '0821234567',
            ]);
        }

        // Sample orders with different statuses
        $ordersData = [
            // 1. DELIVERED ORDER (recent)
            [
                'order_number' => $this->generateOrderNumber(),
                'created_at' => Carbon::now()->subDays(5),
                'order_status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'payfast',
                'tracking_number' => 'TRK' . rand(100000000, 999999999),
                'estimated_delivery' => Carbon::now()->subDays(2),
                'delivery_date' => Carbon::now()->subDays(2),
                'notes' => 'Left with reception',
                'customer_note' => 'Please ring bell on arrival',
                'items' => [
                    ['product' => $products->random(), 'quantity' => 2],
                    ['product' => $products->random(), 'quantity' => 1],
                    ['product' => $products->random(), 'quantity' => 3],
                ]
            ],
            
            // 2. SHIPPED ORDER
            [
                'order_number' => $this->generateOrderNumber(),
                'created_at' => Carbon::now()->subDays(3),
                'order_status' => 'shipped',
                'payment_status' => 'paid',
                'payment_method' => 'eft',
                'tracking_number' => 'TRK' . rand(100000000, 999999999),
                'estimated_delivery' => Carbon::now()->addDays(3),
                'delivery_date' => null,
                'notes' => 'Package insured',
                'customer_note' => null,
                'items' => [
                    ['product' => $products->random(), 'quantity' => 1],
                    ['product' => $products->random(), 'quantity' => 2],
                ]
            ],
            
            // 3. PROCESSING ORDER
            [
                'order_number' => $this->generateOrderNumber(),
                'created_at' => Carbon::now()->subDays(1),
                'order_status' => 'processing',
                'payment_status' => 'paid',
                'payment_method' => 'payfast',
                'tracking_number' => null,
                'estimated_delivery' => Carbon::now()->addDays(7),
                'delivery_date' => null,
                'notes' => 'Awaiting stock check',
                'customer_note' => 'Please include gift receipt',
                'items' => [
                    ['product' => $products->random(), 'quantity' => 4],
                    ['product' => $products->random(), 'quantity' => 1],
                ]
            ],
            
            // 4. PENDING PAYMENT ORDER
            [
                'order_number' => $this->generateOrderNumber(),
                'created_at' => Carbon::now()->subHours(6),
                'order_status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => 'eft',
                'tracking_number' => null,
                'estimated_delivery' => null,
                'delivery_date' => null,
                'notes' => 'Awaiting payment confirmation',
                'customer_note' => null,
                'items' => [
                    ['product' => $products->random(), 'quantity' => 1],
                ]
            ],
            
            // 5. CANCELLED ORDER (old)
            [
                'order_number' => $this->generateOrderNumber(),
                'created_at' => Carbon::now()->subDays(30),
                'order_status' => 'cancelled',
                'payment_status' => 'unpaid',
                'payment_method' => 'payfast',
                'tracking_number' => null,
                'estimated_delivery' => null,
                'delivery_date' => null,
                'notes' => 'Cancelled by customer - changed mind',
                'customer_note' => null,
                'items' => [
                    ['product' => $products->random(), 'quantity' => 2],
                    ['product' => $products->random(), 'quantity' => 1],
                ]
            ],
            
            // 6. DELIVERED ORDER (older - for return testing)
            [
                'order_number' => $this->generateOrderNumber(),
                'created_at' => Carbon::now()->subDays(15),
                'order_status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'payfast',
                'tracking_number' => 'TRK' . rand(100000000, 999999999),
                'estimated_delivery' => Carbon::now()->subDays(12),
                'delivery_date' => Carbon::now()->subDays(12),
                'notes' => 'Signed for by neighbor',
                'customer_note' => null,
                'items' => [
                    ['product' => $products->random(), 'quantity' => 1],
                    ['product' => $products->random(), 'quantity' => 2],
                    ['product' => $products->random(), 'quantity' => 1],
                ]
            ],
            
            // 7. REFUNDED ORDER
            [
                'order_number' => $this->generateOrderNumber(),
                'created_at' => Carbon::now()->subDays(20),
                'order_status' => 'refunded',
                'payment_status' => 'refunded',
                'payment_method' => 'payfast',
                'tracking_number' => 'TRK' . rand(100000000, 999999999),
                'estimated_delivery' => Carbon::now()->subDays(17),
                'delivery_date' => Carbon::now()->subDays(17),
                'notes' => 'Item damaged in transit - refund processed',
                'customer_note' => null,
                'items' => [
                    ['product' => $products->random(), 'quantity' => 1],
                ]
            ],
        ];

        $createdOrders = 0;

        foreach ($ordersData as $orderData) {
            // Check if order number already exists
            if (Order::where('order_number', $orderData['order_number'])->exists()) {
                $this->command->warn("Order {$orderData['order_number']} already exists, skipping...");
                continue;
            }

            // Calculate order totals
            $subtotal = 0;
            $orderItems = [];
            
            foreach ($orderData['items'] as $item) {
                $product = $item['product'];
                $quantity = $item['quantity'];
                $price = $product->price;
                $itemTotal = $price * $quantity;
                $subtotal += $itemTotal;
                
                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => 'SKU-' . str_pad($product->id, 5, '0', STR_PAD_LEFT),
                    'product_price' => $price,
                    'quantity' => $quantity,
                    'total' => $itemTotal,
                ];
            }
            
            // Calculate VAT (15% for South Africa)
            $vat = $subtotal * 0.15;
            $shippingAmount = $subtotal > 500 ? 0 : 49.99; // Free shipping over R500
            $discountAmount = rand(0, 1) ? rand(10, 50) : 0; // Random discount
            $totalAmount = $subtotal + $vat + $shippingAmount - $discountAmount;
            
            // Create the order
            $order = Order::create([
                'order_number' => $orderData['order_number'],
                'user_id' => $user->id,
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'order_status' => $orderData['order_status'],
                'payment_status' => $orderData['payment_status'],
                'subtotal' => $subtotal,
                'vat' => $vat,
                'shipping_amount' => $shippingAmount,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'currency' => 'ZAR',
                'payment_method' => $orderData['payment_method'],
                'tracking_number' => $orderData['tracking_number'],
                'estimated_delivery' => $orderData['estimated_delivery'],
                'delivery_date' => $orderData['delivery_date'],
                'notes' => $orderData['notes'],
                'customer_note' => $orderData['customer_note'],
                'created_at' => $orderData['created_at'],
                'updated_at' => $orderData['created_at'],
            ]);
            
            // Create order items
            foreach ($orderItems as $item) {
                OrderItem::create(array_merge($item, ['order_id' => $order->id]));
                
                // Update stock quantity for delivered/processing/shipped orders
                if (in_array($order->order_status, ['processing', 'shipped', 'delivered'])) {
                    $product = Product::find($item['product_id']);
                    if ($product) {
                        $newStock = max(0, $product->stock_quantity - $item['quantity']);
                        $product->update(['stock_quantity' => $newStock]);
                    }
                }
            }
            
            // Create payment record for paid/refunded orders
            if (in_array($order->payment_status, ['paid', 'refunded'])) {
                Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => $order->payment_method,
                    'amount' => $totalAmount,
                    'status' => $order->payment_status === 'paid' ? 'completed' : 'refunded',
                    'transaction_id' => 'TXN' . rand(100000000, 999999999),
                    'payment_date' => $order->created_at,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->created_at,
                ]);
            }
            
            $createdOrders++;
            $this->command->info("Created order: {$order->order_number} - {$order->order_status} - R" . number_format($order->total_amount, 2));
        }
        
        $this->command->info("\n✅ Successfully created {$createdOrders} orders for {$user->email}");
        $this->command->info("📊 Order breakdown:");
        $this->command->info("   - Delivered: " . Order::where('user_id', $user->id)->where('order_status', 'delivered')->count());
        $this->command->info("   - Shipped: " . Order::where('user_id', $user->id)->where('order_status', 'shipped')->count());
        $this->command->info("   - Processing: " . Order::where('user_id', $user->id)->where('order_status', 'processing')->count());
        $this->command->info("   - Pending: " . Order::where('user_id', $user->id)->where('order_status', 'pending')->count());
        $this->command->info("   - Cancelled: " . Order::where('user_id', $user->id)->where('order_status', 'cancelled')->count());
        $this->command->info("   - Refunded: " . Order::where('user_id', $user->id)->where('order_status', 'refunded')->count());
        
        // Show how to test
        $this->command->info("\n🔍 To test your order page:");
        $this->command->info("   1. Visit: /order (or your order route)");
        $this->command->info("   2. You should see {$createdOrders} orders");
        $this->command->info("   3. Try filtering by status (delivered, processing, etc.)");
        $this->command->info("   4. Click on any order to view details");
    }
    
    /**
     * Generate a unique order number
     */
    private function generateOrderNumber(): string
    {
        $prefix = 'GC-ORD-';
        $date = date('ymd');
        $lastOrder = Order::where('order_number', 'like', $prefix . $date . '%')
            ->orderBy('order_number', 'desc')
            ->first();
        
        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->order_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = str_pad(rand(1, 50), 4, '0', STR_PAD_LEFT);
        }
        
        return $prefix . $date . $nextNumber;
    }
}