<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Address;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the user's orders.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $this->authorize('viewAny', Order::class);

        // Build base query with relationships
        $query = Order::with([
            'user:id,first_name,last_name,email', // Load user for admin view
            'items.product.productImages', 
            'shippingAddress', 
            'billingAddress'
        ])->orderBy('created_at', 'desc');

        // Apply user filter for non-admins
        if (!$user->is_admin) {
            $query->where('user_id', $user->id);
        }

        // Apply filters
        $this->applyFilters($query, $request, $user);


        // Paginate with different page sizes
        $perPage = $user->is_admin ? 20 : 10;
        $orders = $query->paginate($perPage)->withQueryString();

        $viewName = $user->is_admin ? 'Admin/Order' : 'Order';

        return Inertia::render($viewName, [
            'orders'     => $this->transformOrders($orders, $user),
            'filters'    => $this->getFilters($request, $user),
            'pagination' => $this->getPaginationData($orders),
            'stats'      => $this->getOrderStats($user),
            'is-admin' => $user->is_admin,
            'users'    => $user->is_admin ? $this->getUserList() : null, // For admin user filter
        ]);
    }



    /**
     * Apply search and status filters to query.
     */
    private function applyFilters($query, Request $request, $user): void
    {
        //status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('order_status', $request->status);
        }

        // Payment status filter (admin only)
        if ($user->is_admin && $request->filled('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Admin customer filter
        if ($user->is_admin && $request->filled('user_id') && $request->user_id !== 'all') {
            $query->where('user_id', $request->user_id);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search, $user) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                    ->orWhere('tracking_number', 'LIKE', "%{$search}%");

                // Admin can search by customer name/email
                if ($user->is_admin) {
                    $q->orWhereHas('user', function ($q2) use ($search) {
                        $q2->where('first_name', 'LIKE', "%{$search}%")
                            ->orWhere('last_name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
                }

                // Address search
                $q->orWhereHas('shippingAddress', function ($q) use ($search) {
                    $q->where('address_line1', 'LIKE', "%{$search}%")
                        ->orWhere('surburb', 'LIKE', "%{$search}%")
                        ->orWhere('city', 'LIKE', "%{$search}%");
                });
            });
        }
    }

    /**
     * Get filters for the view
     */
    private function getFilters(Request $request, $user): array
    {
        $filters = $request->only(['search', 'status', 'date_from', 'date_to']);

        if ($user->is_admin) {
            $filters['payment_status'] = $request->get('payment_status', 'all');
            $filters['user_id'] = $request->get('user_id', 'all');
        }

        return $filters;
    }

    /**
     * Transform orders for frontend.
     */
    private function transformOrders($orders, $user)
    {
        return $orders->getCollection()->map(function ($order) use ($user) {
            $data = [
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
                'can_cancel' => in_array($order->order_status, ['pending', 'processing']),
                'can_return' => $order->order_status === 'delivered' &&
                    $order->created_at->diffInDays(now()) <= 30,
            ];

            // For admin view 
            if ($user->is_admin) {
                $data['user'] = [
                    'id' => $order->user_id,
                    'name' => $order->user ? "{$order->user->first_name} {$order->user->last_name}" : 'Unknown User',
                    'email' => $order->user ? $order->user->email : null,
                ];
            }

            return $data;
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
        return $items->map(function ($item) {
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
    return match ($status) {
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
    private function getOrderStats($user = null): array
    {
        $query = Order::query();

        if ($user && !$user->is_admin) {
            $query->where('user_id', $user->id);
        }

        // work from a clean copy for each metric to avoid side effects
        $base = $query->clone();

        $total = $base->count();
        $totalRevenue = (clone $base)->where('payment_status', 'paid')->sum('total_amount');
        $todayOrders = (clone $base)->whereDate('created_at', today())->count();
        $thisMonthRevenue = (clone $base)
            ->where('payment_status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->sum('total_amount');

        // Status counts
        $statusCounts = [
            'total' => $total,
            'pending' => (clone $base)->where('order_status', 'pending')->count(),
            'processing' => (clone $base)->where('order_status', 'processing')->count(),
            'shipped' => (clone $base)->where('order_status', 'shipped')->count(),
            'delivered' => (clone $base)->where('order_status', 'delivered')->count(),
            'cancelled' => (clone $base)->where('order_status', 'cancelled')->count(),
        ];


        // Admin-specific stats
        if ($user->is_admin) {
            $statusCounts['total_revenue'] = (float) $totalRevenue;
            $statusCounts['today_orders'] = $todayOrders;
            $statusCounts['this_month_revenue'] = (float) $thisMonthRevenue;

            // Payment status stats
            $statusCounts['unpaid'] = $query->clone()->where('payment_status', 'unpaid')->count();
            $statusCounts['paid'] = $query->clone()->where('payment_status', 'paid')->count();
            $statusCounts['refunded'] = $query->clone()->where('payment_status', 'refunded')->count();
        }

        return $statusCounts;
    }

    /**
     * Get user list for admin filter dropdown
     */
    private function getUserList()
    {
        return User::select('id', 'first_name', 'last_name', 'email')
            ->orderBy('first_name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'label' => "{$user->first_name} {$user->last_name} {$user->email}"
                ];
            });
    }

    /**
     * Display the specified order (works for both admin and users)
     */
    public function show($id)
    {
        $order = Order::with([
            'user', // Load user for admin view
            'items.product.productImages',
            'shippingAddress',
            'billingAddress',
            'payments'
        ])->findOrFail($id);

        // Use policy for authorization
        $this->authorize('view', $order);

        $user = Auth::user();
        $viewName = $user->is_admin ? 'Admin/OrderDetails' : 'OrderDetails';

        return Inertia::render($viewName, [
            'order' => $this->transformOrderForDetails($order, $user),
            'is_admin' => $user->is_admin,
        ]);
    }

    /**
     * Transform single order for details view.
     */
    private function transformOrderForDetails(Order $order, $user = null): array
    {
        $data = [
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

        // Attach user info for admin view
        if ($user && $user->is_admin) {
            $data['user'] = [
                'id' => $order->user_id,
                'name' => $order->user ? "{$order->user->first_name} {$order->user->last_name}" : 'Unknown User',
                'email' => $order->user ? $order->user->email : null,
            ];
        }

        return $data;
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
        return $payments->map(function ($payment) {
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
        $this->authorize('cancel', $order);

        // Restore stock if it was deducted
        if ($order->stock_deducted) {
            foreach ($order->items as $item) {
                Product::where('id', $item->product_id)
                    ->increment('stock_quantity', $item->quantity);
            }
        }

        $order->update([
            'order_status' => 'cancelled',
            'stock_deducted' => false,
            'notes' => ($order->notes ?? '') . "\nCancelled on " . now()->format('Y-m-d H:i'),
        ]);

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

public function downloadInvoice($id)
{
    $user = Auth::user();
    $order = Order::with([
        'user', 
        'items.product', 
        'shippingAddress', 
        'billingAddress',
        'payments'
    ])->findOrFail($id);

    // Authorization
    if ($order->user_id !== $user->id && !$user->is_admin) {
        abort(403);
    }

    // Add status text to the order
    $statusTexts = [
        'pending' => 'Pending Payment',
        'processing' => 'Processing',
        'shipped' => 'Shipped',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
        'refunded' => 'Refunded',
        'return_requested' => 'Return Requested',
    ];
    
    $order->status_text = $statusTexts[$order->order_status] ?? ucfirst($order->order_status);

    $pdf = Pdf::loadView('invoices.order', ['order' => $order]);
    return $pdf->download('invoice-' . $order->order_number . '.pdf');
}

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        // Only admin can update orders
        if (!Auth::user()->is_admin) {
            abort(403, 'Unauthorized. Admin access required.');
        }

        $validated = $request->validate([
            'order_status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded',
            'payment_status' => 'nullable|in:unpaid,paid,refunded',
            'notes' => 'nullable|string',
            'customer_note' => 'nullable|string',
        ]);

        // Update the order
        $order->update($filtered = array_filter($validated, fn($value) => $value !== null));

        // If cancelling, restore stock
        if ($validated['order_status'] === 'cancelled' && $order->order_status !== 'cancelled') {
            $this->restoreOrderStock($order);
        }

        return redirect()->back()->with('success', 'Order updated successfully.');
        
    }
    
}
