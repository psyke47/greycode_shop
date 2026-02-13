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
        // Get all users except admin
        $users = User::where('is_admin', false)->get();
        
        if ($users->isEmpty()) {
            $this->command->error('No users found. Please run UserSeeder first!');
            return;
        }

        // Get products
        $products = Product::with('productImages')->get();
        
        if ($products->isEmpty()) {
            $this->command->error('No products found. Please run StockListSeeder first!');
            return;
        }

        $totalOrdersCreated = 0;

        foreach ($users as $user) {
            $this->command->info("Creating orders for user: {$user->email} ({$user->first_name} {$user->last_name} {$user->username})");

            // Check if user has addresses, create if not
            $shippingAddress = $this->createAddressForUser($user, 'Shipping');
            $billingAddress = $this->createAddressForUser($user, 'Billing');

            // Create 2-5 orders per user
            $numOrders = rand(4, 9);
            
            for ($i = 1; $i <= $numOrders; $i++) {
                $orderCreated = $this->createOrderForUser($user, $shippingAddress, $billingAddress, $products, $i);
                if ($orderCreated) {
                    $totalOrdersCreated++;
                }
            }
        }

        $this->command->info("\n✅ Successfully created {$totalOrdersCreated} orders across {$users->count()} users");
        
        // Show order statistics
        $this->command->info("\n📊 Overall Order Statistics:");
        $this->command->info("   - Total Orders: " . Order::count());
        $this->command->info("   - Delivered: " . Order::where('order_status', 'delivered')->count());
        $this->command->info("   - Shipped: " . Order::where('order_status', 'shipped')->count());
        $this->command->info("   - Processing: " . Order::where('order_status', 'processing')->count());
        $this->command->info("   - Pending: " . Order::where('order_status', 'pending')->count());
        $this->command->info("   - Cancelled: " . Order::where('order_status', 'cancelled')->count());
        $this->command->info("   - Refunded: " . Order::where('order_status', 'refunded')->count());
        
        // Show per user statistics
        $this->command->info("\n📊 Orders per User:");
        foreach ($users as $user) {
            $userOrderCount = Order::where('user_id', $user->id)->count();
            $this->command->info("   - {$user->first_name} {$user->last_name} ({$user->email}): {$userOrderCount} orders");
        }
    }

    /**
     * Create address for user if not exists
     */
    private function createAddressForUser(User $user, string $type): Address
    {
        $address = Address::where('user_id', $user->id)
            ->where('address_type', $type)
            ->first();
            
        if ($address) {
            return $address;
        }

        // Create unique addresses based on user
        $addressData = [
            'user_id' => $user->id,
            'address_type' => $type,
            'is_default' => true,
            'address_line1' => rand(1, 999) . ' ' . $this->getRandomStreet(),
            'address_line2' => rand(1, 10) > 5 ? 'Apt ' . rand(1, 20) : null,
            'surburb' => $this->getRandomSuburb(),
            'city' => $this->getRandomCity(),
            'province' => $this->getRandomProvince(),
            'postal_code' => str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
            'country' => 'South Africa',
            'phone_number' => $user->phone ?? '0' . rand(820000000, 829999999),
        ];

        return Address::create($addressData);
    }

    /**
     * Create an order for a user
     */
    private function createOrderForUser(User $user, Address $shippingAddress, Address $billingAddress, $products, int $orderIndex): bool
    {
        // Generate order number
        $orderNumber = $this->generateOrderNumber();
        
        // Random date within last 60 days
        $orderDate = Carbon::now()->subDays(rand(0, 60))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
        
        // Define possible statuses with weights
        $statuses = [
            'delivered' => 30,  // 30% chance
            'shipped' => 25,    // 25% chance
            'processing' => 20, // 20% chance
            'pending' => 15,    // 15% chance
            'cancelled' => 5,   // 5% chance
            'refunded' => 5,    // 5% chance
        ];
        
        $orderStatus = $this->getWeightedRandom($statuses);
        
        // Payment status based on order status
        $paymentStatuses = [
            'delivered' => 'paid',
            'shipped' => 'paid',
            'processing' => 'paid',
            'pending' => rand(0, 1) ? 'unpaid' : 'paid',
            'cancelled' => 'unpaid',
            'refunded' => 'refunded',
        ];
        
        $paymentStatus = $paymentStatuses[$orderStatus];
        
        // Payment methods
        $paymentMethods = ['payfast', 'eft', 'cash_on_delivery'];
        $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
        
        // Generate tracking number 
        $trackingNumber = in_array($orderStatus, ['shipped', 'delivered', 'pending', 'processing', 'cancelled', 'refunded']) 
            ? 'TRK-' .rand(100000000, 999999999) 
            : null;
        
        // Calculate dates
        $estimatedDelivery = null;
        $deliveryDate = null;
        
        if ($orderStatus === 'shipped') {
            $estimatedDelivery = $orderDate->copy()->addDays(rand(3, 7));
        } elseif ($orderStatus === 'delivered') {
            $estimatedDelivery = $orderDate->copy()->addDays(rand(3, 7));
            $deliveryDate = $estimatedDelivery->copy()->subDays(rand(0, 2));
        }
        
        // Create order items (1-4 random products)
        $numItems = rand(1, 4);
        $subtotal = 0;
        $orderItems = [];
        
        $selectedProducts = $products->random($numItems);
        
        foreach ($selectedProducts as $product) {
            $quantity = rand(1, 3);
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
        
        // Calculate totals
        $vat = $subtotal * 0.15;
        $shippingAmount = $subtotal > 500 ? 0 : 49.99;
        $discountAmount = rand(0, 1) ? rand(10, 50) : 0;
        $totalAmount = $subtotal + $vat + $shippingAmount - $discountAmount;
        
        // Create the order
        $order = Order::create([
            'order_number' =>$orderNumber,
            'user_id' => $user->id,
            'shipping_address_id' => $shippingAddress->id,
            'billing_address_id' => $billingAddress->id,
            'order_status' => $orderStatus,
            'payment_status' => $paymentStatus,
            'subtotal' => $subtotal,
            'vat' => $vat,
            'shipping_amount' => $shippingAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'currency' => 'ZAR',
            'payment_method' => $paymentMethod,
            'tracking_number' => $trackingNumber,
            'estimated_delivery' => $estimatedDelivery,
            'delivery_date' => $deliveryDate,
            'notes' => $this->getRandomNote($orderStatus),
            'customer_note' => rand(0, 1) ? $this->getRandomCustomerNote() : null,
            'created_at' => $orderDate,
            'updated_at' => $orderDate,
        ]);
        
        // Create order items
        foreach ($orderItems as $item) {
            OrderItem::create(array_merge($item, ['order_id' => $order->id]));
        }
        
        // Create payment record for paid/refunded orders
        if (in_array($paymentStatus, ['paid', 'refunded'])) {
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $paymentMethod,
                'amount' => $totalAmount,
                'status' => $paymentStatus === 'paid' ? 'completed' : 'refunded',
                'transaction_id' => 'TXN-' . rand(100000000, 999999999),
                'payment_date' => $orderDate,
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);
        }
        
        $this->command->info("   Created order #{$orderIndex}: {$order->order_number} - {$order->order_status} - R" . number_format($order->total_amount, 2));
        
        return true;
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
    
    /**
     * Get weighted random value
     */
    private function getWeightedRandom(array $weightedValues)
    {
        $rand = rand(1, array_sum($weightedValues));
        
        foreach ($weightedValues as $key => $value) {
            $rand -= $value;
            if ($rand <= 0) {
                return $key;
            }
        }
    }
    
    /**
     * Helper methods for random data
     */
    private function getRandomStreet(): string
    {
        $streets = ['Oak', 'Maple', 'Pine', 'Cedar', 'Birch', 'Willow', 'Ash', 'Elm', 'Spruce', 'Fir'];
        return $streets[array_rand($streets)] . ' Street';
    }
    
    private function getRandomSuburb(): string
    {
        $suburbs = ['Sandton', 'Rosebank', 'Parktown', 'Braamfontein', 'Houghton', 'Melville', 'Greenside', 'Randburg', 'Fourways', 'Midrand'];
        return $suburbs[array_rand($suburbs)];
    }
    
    private function getRandomCity(): string
    {
        $cities = ['Johannesburg', 'Pretoria', 'Cape Town', 'Durban', 'Bloemfontein', 'Port Elizabeth', 'East London', 'Pietermaritzburg'];
        return $cities[array_rand($cities)];
    }
    
    private function getRandomProvince(): string
    {
        $provinces = [
            'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
            'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
        ];
        return $provinces[array_rand($provinces)];
    }
    
    private function getRandomNote(string $status): string
    {
        $notes = [
            'delivered' => ['Left with reception', 'Signed for by neighbor', 'Delivered as requested', 'Package received'],
            'shipped' => ['Shipped via courier', 'Package insured', 'Express delivery', 'Trackable shipment'],
            'processing' => ['Awaiting stock check', 'Processing in warehouse', 'Quality control check', 'Packaging in progress'],
            'pending' => ['Awaiting payment confirmation', 'Payment verification needed', 'Order received, awaiting payment'],
            'cancelled' => ['Cancelled by customer', 'Out of stock', 'Customer requested cancellation', 'Payment failed'],
            'refunded' => ['Item damaged in transit', 'Customer dissatisfaction', 'Wrong item shipped', 'Refund processed'],
        ];
        
        return $notes[$status][array_rand($notes[$status])];
    }
    
    private function getRandomCustomerNote(): string
    {
        $notes = [
            'Please leave at the gate',
            'Ring bell on arrival',
            'Call before delivery',
            'Leave with security',
            'No signature required',
            'Please include gift receipt',
            'Fragile - handle with care',
            'Delivery after 5 PM',
        ];
        
        return $notes[array_rand($notes)];
    }
}
