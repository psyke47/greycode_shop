<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\PayFastService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use App\Mail\NewOrderNotification;
use Inertia\Inertia;
use Illuminate\SUpport\Facades\DB;

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

        $order = Order::with('items.product', 'shippingAddress', 'billingAddress')
                  ->where('order_number', $request->m_payment_id)
                  ->first();

        if (!$order) {
            Log::error('Order not found: ' . $request->m_payment_id);
            return response('Order not found', 404);
        }

        if ($request->payment_status === 'COMPLETE') {

           DB::beginTransaction();

        try {
            $order->update([
                'payment_status' => 'paid',
                'order_status' => 'processing',
            ]);

            $this->deductStock($order);

            DB::commit();

            Log::info('Payment completed for order: ' . $order->order_number);

            try {
                    // Send confirmation to customer
                    Mail::to($order->user->email)->queue(new OrderConfirmation($order));
                    
                    // Send notification to sales team
                    Mail::to(config('mail.from.address'))->queue(new NewOrderNotification($order));

                    Log::info('Order emails queued for order: ' . $order->order_number);

                } catch (\Exception $e) {
                    Log::error('Failed to queue order emails: ' . $e->getMessage());
                } 
            catch (\Exception $e) {
                DB::rollBack();
                Log::error('Failed to process payment notification: ' . $e->getMessage());

            }
                return response('Error processing payment', 500);
            }

        } elseif ($request->payment_status === 'FAILED') {
            $order->update([
                'payment_status' => 'failed',
                'order_status' => 'cancelled',
            ]);
            Log::warning('Payment failed for order: ' . $order->order_number);
        }


        return response('OK', 200)
        ->header('Content-Type', 'text/plain');
    }

    public function success(Request $request, $orderId)
    {
        $order = Order::with('items.product', 'shippingAddress', 'billingAddress')
            ->findOrFail($orderId);

        // Check if payment was successful (you might want to verify with PayFast again)
        if ($order->payment_status === 'paid') {
            return Inertia::render('OrderDetails', [
                'order' => $order,
                'payment_success' => true,
                'message' => 'Payment successful! Your order is being processed. A confirmation email has been sent to your email address.'
            ]);
        }

        return Inertia::render('OrderDetails', [
            'order' => $order,
            'payment_success' => true,
            'message' => 'Payment successful! Your order is being processed.'
        ]);
    }

    public function cancel(Request $request, $orderId)
    {
        $order = Order::find($orderId);
        
        if ($order && $order->payment_status === 'unpaid') {
            $order->update([
                'order_status' => 'cancelled',
                'notes' => ($order->notes ?? '') . "\nOrder cancelled by customer during payment."
            ]);
        }
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