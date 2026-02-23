<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\PayFastService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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

        $order = Order::where('order_number', $request->m_payment_id)->first();

        if (!$order) {
            Log::error('Order not found: ' . $request->m_payment_id);
            return response('Order not found', 404);
        }

        if ($request->payment_status === 'COMPLETE') {
            $order->update([
                'payment_status' => 'paid',
                'order_status' => 'processing',
            ]);

            $this->deductStock($order);

            Log::info('Payment completed for order: ' . $order->order_number);
        }

        return response('OK', 200);
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