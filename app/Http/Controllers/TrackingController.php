<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TrackingController extends Controller
{
    /**
     * Show tracking page.
     */
    public function index()
    {
        return Inertia::render('Tracking');
    }

    /**
     * Track an order by number or tracking number.
     */
    public function track(Request $request)
    {
        $request->validate([
            'search_input' => 'nullable|string|max:50',
            'order_id' => 'nullable|string|max:50',      // For auto-detected order ID
            'tracking_number' => 'nullable|string|max:50', // For auto-detected tracking
            'email' => 'nullable|email',
        ]);

        // If user is logged in, get their orders
        $user = Auth::user();
        $query = Order::with([
            'items.product.productImages',
            'shippingAddress',
            'user'
        ]);

            // Use search_input if provided, otherwise use individual fields
    $searchInput = $request->search_input;
    $orderId = $request->order_id;
    $trackingNumber = $request->tracking_number;

    // Build search conditions
    $conditions = [];

    if ($searchInput) {
        // User entered something in the single input field
        $conditions[] = ['order_number', 'like', '%' . $searchInput . '%'];
        $conditions[] = ['tracking_number', 'like', '%' . $searchInput . '%'];
        
        // Also try to find by numeric ID if input is just numbers
        if (is_numeric($searchInput)) {
            $conditions[] = ['id', '=', (int) $searchInput];
        }
    } else {
        // User entered individual fields (backward compatibility)
        if ($orderId) {
            $conditions[] = ['order_number', 'like', '%' . $orderId . '%'];
        }
        
        if ($trackingNumber) {
            $conditions[] = ['tracking_number', 'like', '%' . $trackingNumber . '%'];
        }
    }

    if ($request->filled('email') && !$user) {
        // If email provided and user not logged in, find by email via user relationship
        $query->whereHas('user', function($q) use ($request) {
            $q->where('email', 'like', '%' . $request->email . '%');
        });
    }

    if ($user) {
        // If user is logged in, restrict to their orders
        $query->where('user_id', $user->id);
    }

    if (empty($conditions)) {
        return back()->withErrors(['tracking' => 'Please enter an Order ID or Tracking Number']);
    }

    // Apply conditions
    $query->where(function($q) use ($conditions) {
        foreach ($conditions as $condition) {
            $q->orWhere($condition[0], $condition[1], $condition[2]);
        }
    });

    $order = $query->first();

    if (!$order) {
        return back()->withErrors([
            'tracking' => 'Order not found. Please check your details and try again.'
        ]);
    }

        // Generate timeline based on order status and dates
        $timeline = $this->generateTimeline($order);

        $trackingData = [
            'orderId' => $order->order_number,
            'trackingNumber' => $order->tracking_number ?? 'Not assigned yet',
            'status' => $order->order_status,
            'statusText' => $this->getStatusText($order->order_status),
            'estimatedDelivery' => $order->estimated_delivery?->format('M d, Y'),
            'actualDelivery' => $order->delivery_date?->format('M d, Y'),
            'shippedDate' => $this->getShippedDate($order)->format('M d, Y'),
            'carrier' => 'FastShip SA', // You can make this a database field
            'service' => 'Standard Shipping',
            'weight' => $this->calculateOrderWeight($order),
            'dimensions' => 'Varies by items',
            'origin' => 'Johannesburg, SA',
            'destination' => $order->shippingAddress ? 
                $order->shippingAddress->city . ', ' . $order->shippingAddress->province : 
                'Unknown',
            'timeline' => $timeline,
            'recipient' => [
                'name' => $order->user->first_name . ' ' . $order->user->last_name,
                'address' => $order->shippingAddress ? 
                    $order->shippingAddress->address_line1 . ', ' .
                    $order->shippingAddress->surburb . ', ' .
                    $order->shippingAddress->city . ', ' .
                    $order->shippingAddress->postal_code : 'No address',
                'phone' => $order->shippingAddress->phone_number ?? $order->user->phone,
            ],
            'sender' => [
                'name' => 'Greycode',
                'address' => '13 Stamvrug St, Val de Grace, Pretoria',
                'phone' => '+27 12 481 3515',
            ],
            'items' => $order->items->map(function($item) {
                $productImage = $item->product->productImages->first();
                
                return [
                    'name' => $item->product_name,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->product_price,
                    'total' => (float) $item->total,
                    'image' => $productImage ? '/images/' . $productImage->url : null,
                ];
            }),
            'orderTotal' => (float) $order->total_amount,
            'currency' => $order->currency,
        ];

        return Inertia::render('Tracking', [
            'trackingInfo' => $trackingData,
            'searchParams' => $request->only(['order_id', 'tracking_number', 'email']),
        ]);
    }

    /**
     * Generate timeline based on order status.
     */
    private function generateTimeline(Order $order): array
    {
        $timeline = [];

        // Order placed
        $timeline[] = [
            'date' => $order->created_at->format('Y-m-d'),
            'time' => $order->created_at->format('H:i'),
            'status' => 'Order Placed',
            'location' => 'Online Store',
            'description' => 'Order confirmed and payment processed',
            'completed' => true,
        ];

        // Processing
        if (in_array($order->order_status, ['processing', 'shipped', 'delivered'])) {
            $processingDate = $order->created_at->copy()->addHours(2);
            $timeline[] = [
                'date' => $processingDate->format('Y-m-d'),
                'time' => $processingDate->format('H:i'),
                'status' => 'Processing',
                'location' => 'Johannesburg Warehouse',
                'description' => 'Order being prepared for shipment',
                'completed' => true,
            ];
        }

        // Shipped
        if (in_array($order->order_status, ['shipped', 'delivered']) && $order->tracking_number) {
            $shippedDate = $this->getShippedDate($order);
            $timeline[] = [
                'date' => $shippedDate->format('Y-m-d'),
                'time' => $shippedDate->format('H:i'),
                'status' => 'Shipped',
                'location' => 'Johannesburg, SA',
                'description' => 'Package picked up by carrier. Tracking: ' . $order->tracking_number,
                'completed' => true,
            ];

            // In transit (if shipped but not delivered)
            if ($order->order_status === 'shipped') {
                $transitDate = $shippedDate->copy()->addDays(1);
                $timeline[] = [
                    'date' => $transitDate->format('Y-m-d'),
                    'time' => $transitDate->format('H:i'),
                    'status' => 'In Transit',
                    'location' => 'En route to destination',
                    'description' => 'Package in transit to destination',
                    'completed' => true,
                ];
            }

            // Delivered
            if ($order->order_status === 'delivered' && $order->delivery_date) {
                $deliveryDate = Carbon::parse($order->delivery_date);
                $timeline[] = [
                    'date' => $deliveryDate->format('Y-m-d'),
                    'time' => $deliveryDate->format('H:i'),
                    'status' => 'Delivered',
                    'location' => $order->shippingAddress ? 
                        $order->shippingAddress->city . ', ' . $order->shippingAddress->province : 
                        'Destination',
                    'description' => 'Package delivered successfully',
                    'completed' => true,
                ];
            }
        }

        // Add estimated future events for pending/processing orders
        if (in_array($order->order_status, ['pending', 'processing'])) {
            $estimatedShip = $order->created_at->copy()->addDays(1);
            $timeline[] = [
                'date' => $estimatedShip->format('Y-m-d'),
                'time' => '--:--',
                'status' => 'Estimated Shipping',
                'location' => 'Johannesburg Warehouse',
                'description' => 'Expected to ship within 24 hours',
                'completed' => false,
            ];
        }

        return $timeline;
    }

    /**
     * Get shipped date based on order status.
     */
    private function getShippedDate(Order $order): Carbon
    {
        if ($order->tracking_number && $order->updated_at->gt($order->created_at)) {
            return $order->updated_at;
        }

        // Estimate based on order date
        return $order->created_at->copy()->addDays(1);
    }

    /**
     * Calculate estimated weight for order.
     */
    private function calculateOrderWeight(Order $order): string
    {
        $itemCount = $order->items->sum('quantity');
        
        if ($itemCount <= 2) {
            return '0.5 - 1.0 kg';
        } elseif ($itemCount <= 5) {
            return '1.0 - 2.5 kg';
        } else {
            return '2.5 - 5.0 kg';
        }
    }

    /**
     * Get display text for order status.
     */
    private function getStatusText(string $status): string
    {
        return match($status) {
            'pending' => 'Payment Pending',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            'refunded' => 'Refunded',
            default => ucfirst($status),
        };
    }

    /**
     * Get status color for frontend.
     */
    public function getStatusColor(string $status): string
    {
        return match($status) {
            'delivered' => 'bg-green-100 text-green-800',
            'shipped' => 'bg-blue-100 text-blue-800',
            'processing' => 'bg-yellow-100 text-yellow-800',
            'pending' => 'bg-orange-100 text-orange-800',
            'cancelled', 'refunded' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }
}