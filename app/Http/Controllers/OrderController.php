<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get orders with relationships
        $query = Order::with([
                'items.product.productImages', 
                'shippingAddress', 
                'billingAddress'
            ])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        // Apply filters
        $this->applyFilters($query, $request);

        $orders = $query->paginate(10)->withQueryString();

        return Inertia::render('Order', [
            'orders' => $this->transformOrders($orders),
            'filters' => $request->only(['search', 'status']),
            'pagination' => $this->getPaginationData($orders),
            'stats' => $this->getOrderStats($user->id)
        ]);
    }

    /**
     * Apply search and status filters to query.
     */
    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('order_status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                  ->orWhereHas('shippingAddress', function($q) use ($search) {
                      $q->where('address_line1', 'LIKE', "%{$search}%")
                        ->orWhere('surburb', 'LIKE', "%{$search}%")
                        ->orWhere('city', 'LIKE', "%{$search}%");
                  });
            });
        }
    }

    /**
     * Transform orders for frontend.
     */
    private function transformOrders($orders)
    {
        return $orders->getCollection()->map(function($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'date' => $order->created_at->format('Y-m-d'),
                'status' => $order->order_status,
                'status_text' => $this->getStatusText($order->order_status),
                'total' => (float) $order->total_amount,
                'subtotal' => (float) $order->subtotal,
                'vat' => (float) $order->vat,
                'shipping' => (float) $order->shipping_amount,
                'discount' => (float) $order->discount_amount,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'currency' => $order->currency,
                'items_count' => $order->items->sum('quantity'),
                'tracking_number' => $order->tracking_number,
                'estimated_delivery' => $order->estimated_delivery?->format('Y-m-d'),
                'delivery_date' => $order->delivery_date?->format('Y-m-d'),
                'address' => $this->getFormattedAddress($order->shippingAddress),
                'items' => $this->transformOrderItems($order->items),
                'notes' => $order->notes,
                'customer_note' => $order->customer_note,
            ];
        });
    }

    /**
     * Get formatted address.
     */
    private function getFormattedAddress(?Address $address): string
    {
        if (!$address) {
            return 'No address';
        }

        return implode(', ', array_filter([
            $address->address_line1,
            $address->surburb,
            $address->city,
            $address->postal_code
        ]));
    }

    /**
     * Transform order items.
     */
    private function transformOrderItems($items)
    {
        return $items->map(function($item) {
            $productImage = $item->product->productImages->first();
            // Fix the image URL
            $imageUrl = null;
            if ($productImage && $productImage->url) {
            // Check if URL already has path
            if (str_contains($productImage->url, '/')) {
                // Already has path, use as-is
                $imageUrl = $productImage->url;
            } else {
                
                $imageUrl = '/images/' . $productImage->url;
            }
        }

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product_name,
                'sku' => $item->product_sku,
                'price' => (float) $item->product_price,
                'quantity' => $item->quantity,
                'total' => (float) $item->total,
                'image' => $imageUrl,
                'is_available' => $item->product->is_active && $item->product->stock_quantity > 0,
            ];
        });
    }

    /**
     * Get status display text.
     */
    private function getStatusText(string $status): string
    {
        return match($status) {
            'pending' => 'Pending Payment',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
            'refunded' => 'Refunded',
            'return_requested' => 'Return Requested',
            default => ucfirst($status),
        };
    }

    /**
     * Get pagination data.
     */
    private function getPaginationData($orders): array
    {
        return [
            'current_page' => $orders->currentPage(),
            'last_page' => $orders->lastPage(),
            'per_page' => $orders->perPage(),
            'total' => $orders->total(),
            'links' => $orders->linkCollection()->toArray(),
        ];
    }

    /**
     * Get order statistics.
     */
    private function getOrderStats(int $userId): array
    {
        return [
            'total' => Order::where('user_id', $userId)->count(),
            'pending' => Order::where('user_id', $userId)->where('order_status', 'pending')->count(),
            'processing' => Order::where('user_id', $userId)->where('order_status', 'processing')->count(),
            'shipped' => Order::where('user_id', $userId)->where('order_status', 'shipped')->count(),
            'delivered' => Order::where('user_id', $userId)->where('order_status', 'delivered')->count(),
            'cancelled' => Order::where('user_id', $userId)->where('order_status', 'cancelled')->count(),
        ];
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        $user = Auth::user();
        
        $order = Order::with([
            'items.product.productImages', 
            'shippingAddress', 
            'billingAddress', 
            'payments'
        ])->findOrFail($id);

        // Authorization
        if ($order->user_id !== $user->id && !$user->is_admin) {
            abort(403);
        }

        return Inertia::render('OrderDetails', [
            'order' => $this->transformOrderForDetails($order)
        ]);
    }

    /**
     * Transform single order for details view.
     */
    private function transformOrderForDetails(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'date' => $order->created_at->format('F d, Y'),
            'status' => $order->order_status,
            'status_text' => $this->getStatusText($order->order_status),
            'total' => (float) $order->total_amount,
            'subtotal' => (float) $order->subtotal,
            'vat' => (float) $order->vat,
            'shipping' => (float) $order->shipping_amount,
            'discount' => (float) $order->discount_amount,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'currency' => $order->currency,
            'tracking_number' => $order->tracking_number,
            'estimated_delivery' => $order->estimated_delivery?->format('F d, Y'),
            'delivery_date' => $order->delivery_date?->format('F d, Y'),
            'shipping_address' => $order->shippingAddress ? $this->transformAddress($order->shippingAddress) : null,
            'billing_address' => $order->billingAddress ? $this->transformAddress($order->billingAddress) : null,
            'items' => $this->transformOrderItems($order->items),
            'payments' => $this->transformPayments($order->payments),
            'notes' => $order->notes,
            'customer_note' => $order->customer_note,
            'can_cancel' => in_array($order->order_status, ['pending', 'processing']),
            'can_return' => $order->order_status === 'delivered' && 
                          $order->created_at->diffInDays(now()) <= 30,
        ];
    }

    /**
     * Transform address.
     */
    private function transformAddress(Address $address): array
    {
        return [
            'type' => $address->address_type,
            'line1' => $address->address_line1,
            'line2' => $address->address_line2,
            'surburb' => $address->surburb,
            'city' => $address->city,
            'province' => $address->province,
            'postal_code' => $address->postal_code,
            'country' => $address->country,
            'phone' => $address->phone_number,
        ];
    }

    /**
     * Transform payments.
     */
    private function transformPayments($payments)
    {
        return $payments->map(function($payment) {
        // Convert integer timestamp to Carbon instance
        $paymentDate = \Carbon\Carbon::createFromTimestamp($payment->payment_date);
        
        return [
            'id' => $payment->id,
            'method' => $payment->payment_method,
            'amount' => (float) $payment->amount,
            'status' => $payment->status,
            'transaction_id' => $payment->transaction_id,
            'date' => $paymentDate->format('F d, Y H:i'),
        ];
    });
    }

    /**
     * Cancel an order.
     */
    public function cancel(Request $request, $id)
    {
        $user = Auth::user();
        $order = Order::with('items')->findOrFail($id);

        // Authorization
        if ($order->user_id !== $user->id) {
            abort(403);
        }

        // Validation
        if (!in_array($order->order_status, ['pending', 'processing'])) {
            return back()->withErrors(['order' => 'This order cannot be cancelled.']);
        }

        // Update order
        $order->update([
            'order_status' => 'cancelled',
            'notes' => ($order->notes ?? '') . "\nCancelled by customer on " . now()->format('Y-m-d H:i'),
        ]);

        // Restore stock
        $this->restoreOrderStock($order);

        return back()->with('success', 'Order cancelled successfully.');
    }

    /**
     * Restore stock for cancelled order.
     */
    private function restoreOrderStock(Order $order): void
    {
        foreach ($order->items as $item) {
            Product::where('id', $item->product_id)
                ->increment('stock_quantity', $item->quantity);
        }
    }

    /**
     * Request a return for an order.
     */
    public function requestReturn(Request $request, $id)
    {
        $user = Auth::user();
        $order = Order::findOrFail($id);

        // Authorization
        if ($order->user_id !== $user->id) {
            abort(403);
        }

        // Validation
        if ($order->order_status !== 'delivered') {
            return back()->withErrors(['order' => 'Only delivered orders can be returned.']);
        }

        if ($order->created_at->diffInDays(now()) > 30) {
            return back()->withErrors(['order' => 'Returns must be requested within 30 days of delivery.']);
        }

        // Update order
        $order->update([
            'order_status' => 'return_requested',
            'notes' => ($request->reason ?? 'Return requested') . "\n\n" . ($order->notes ?? ''),
        ]);

        return back()->with('success', 'Return request submitted successfully.');
    }

    /**
     * Download invoice for an order.
     */
    public function downloadInvoice($id)
    {
        $user = Auth::user();
        $order = Order::findOrFail($id);

        // Authorization
        if ($order->user_id !== $user->id && !$user->is_admin) {
            abort(403);
        }

        // TODO: Implement actual PDF generation
        return response()->json([
            'message' => 'Invoice download would be implemented here',
            'order_number' => $order->order_number,
        ]);
    }
}