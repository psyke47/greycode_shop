<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\PayFastService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Notifications\PaymentFailedNotification;
use Illuminate\Support\Facades\Notification;


class PayFastController extends Controller
{
    protected $payfast;

    public function __construct(PayFastService $payfast)
    {
        $this->payfast = $payfast;
    }

public function notify(Request $request)
{
    Log::info('PayFast ITN received', $request->all());

    if (!$this->payfast->validateItn($request->all())) {
        Log::error('PayFast ITN validation failed');
        return response('Invalid', 400);
    }

    // Find order by order_number (not m_payment_id? confirm)
    $order = Order::where('order_number', $request->m_payment_id)->first();

    if (!$order) {
        Log::error('Order not found: ' . $request->m_payment_id);
        return response('Order not found', 404);
    }

    // Only process if order is still unpaid/pending
    if ($order->payment_status === 'paid') {
        Log::info('Order already paid: ' . $order->order_number);
        return response('OK', 200);
    }

    if ($request->payment_status === 'COMPLETE') {
        // Update both statuses
        $order->update([
            'payment_status' => 'paid',
            'order_status' => 'processing',  // change from pending to processing
        ]);

        // Deduct stock only once
        if (!$order->stock_deducted) {
            $this->deductStock($order);
            $order->update(['stock_deducted' => true]);
        }

        Log::info('Payment completed for order: ' . $order->order_number);
    } else {
        // Optional: mark as cancelled on payment failure
        $order->update([
            'order_status' => 'cancelled',
            'notes' => ($order->notes ?? '') . "\nPayment failed: " . $request->payment_status,
        ]);
        Log::warning('Payment failed for order: ' . $order->order_number);
    }

    return response('OK', 200)->header('Content-Type', 'text/plain');
}

    public function success(Request $request, $orderId)
    {
        $order = Order::with('items.product', 'shippingAddress', 'billingAddress')
            ->findOrFail($orderId);

        return Inertia::render('OrderDetails', [
            'order' => $order,
            'payment_success' => true,
            'message' => 'Payment successful! Your order is being processed.'
        ]);
    }

    public function cancel(Request $request, $orderId)
    {
        return redirect()->route('checkout')
            ->with('error', 'Payment was cancelled. Please try again.');
    }

    private function deductStock(Order $order)
{
    if ($order->stock_deducted) {
        return;
    }

    foreach ($order->items as $item) {
        Product::where('id', $item->product_id)
            ->decrement('stock_quantity', $item->quantity);
    }

    $order->update(['stock_deducted' => true]);
}
}