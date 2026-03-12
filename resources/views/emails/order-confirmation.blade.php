<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1e3a8a;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        .order-info {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
        }
        .order-info h3 {
            margin-top: 0;
            color: #1e3a8a;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background-color: #1e3a8a;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        .total-row {
            font-weight: bold;
            background-color: #f3f4f6;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .address {
            background-color: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin: 10px 0;
        }
        .address p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Your Order!</h1>
        <p>Order #{{ $order->order_number }}</p>
    </div>

    <div class="content">
        <p>Dear {{ $order->user->first_name }},</p>
        
        <p>Thank you for shopping with Greycode Shop! Your order has been received and is being processed.</p>

        <div class="order-info">
            <h3>Order Summary</h3>
            <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
            <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y, g:i a') }}</p>
            <p><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}</p>
            <p><strong>Payment Status:</strong> 
                <span class="status-badge status-pending">{{ ucfirst($order->payment_status) }}</span>
            </p>
        </div>

        <div class="order-info">
            <h3>Order Items</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->product_name }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>R {{ number_format($item->product_price, 2) }}</td>
                        <td>R {{ number_format($item->total, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                        <td>R {{ number_format($order->subtotal, 2) }}</td>
                    </tr>
                    @if($order->discount_amount > 0)
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Discount:</strong></td>
                        <td>-R {{ number_format($order->discount_amount, 2) }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
                        <td>R {{ number_format($order->shipping_amount, 2) }}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>VAT (15%):</strong></td>
                        <td>R {{ number_format($order->vat, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                        <td><strong>R {{ number_format($order->total_amount, 2) }}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="order-info">
            <h3>Shipping Address</h3>
            <div class="address">
                <p><strong>{{ $order->shippingAddress->address_line1 }}</strong></p>
                @if($order->shippingAddress->address_line2)
                    <p>{{ $order->shippingAddress->address_line2 }}</p>
                @endif
                <p>{{ $order->shippingAddress->surburb }}, {{ $order->shippingAddress->city }}</p>
                <p>{{ $order->shippingAddress->province }}, {{ $order->shippingAddress->postal_code }}</p>
                <p>Phone: {{ $order->shippingAddress->phone_number }}</p>
            </div>
        </div>

        @if($order->billingAddress && $order->shippingAddress->id !== $order->billingAddress->id)
        <div class="order-info">
            <h3>Billing Address</h3>
            <div class="address">
                <p><strong>{{ $order->billingAddress->address_line1 }}</strong></p>
                @if($order->billingAddress->address_line2)
                    <p>{{ $order->billingAddress->address_line2 }}</p>
                @endif
                <p>{{ $order->billingAddress->surburb }}, {{ $order->billingAddress->city }}</p>
                <p>{{ $order->billingAddress->province }}, {{ $order->billingAddress->postal_code }}</p>
                <p>Phone: {{ $order->billingAddress->phone_number }}</p>
            </div>
        </div>
        @endif

        @if($order->customer_note)
        <div class="order-info">
            <h3>Your Note</h3>
            <p>{{ $order->customer_note }}</p>
        </div>
        @endif

        <p>You can track your order status by visiting your <a href="{{ route('order.show', $order->id) }}" style="color: #1e3a8a;">order details page</a>.</p>

        <p>If you have any questions about your order, please contact our customer service team at <a href="mailto:sales@greycode.co.za">sales@greycode.co.za</a>.</p>

        <p>Thank you for choosing Greycode Shop!</p>

        <p>Best regards,<br>Greycode</p>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} Greycode Shop. All rights reserved.</p>
        <p>This email was sent to {{ $order->user->email }}</p>
    </div>
</body>
</html>