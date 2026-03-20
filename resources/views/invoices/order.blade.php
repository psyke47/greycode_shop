<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            background: white;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3a7c97;
        }
        .logo h1 {
            color: #3a7c97;
            margin: 0;
            font-size: 28px;
        }
        .logo p {
            margin: 5px 0 0;
            color: #666;
            font-size: 11px;
        }
        .invoice-title h2 {
            margin: 0;
            color: #555;
        }
        .invoice-title p {
            margin: 5px 0 0;
            color: #888;
        }
        .company-details, .client-details {
            margin-bottom: 30px;
        }
        .company-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .details-grid {
            display: flex;
            justify-content: space-between;
            gap: 30px;
        }
        .details-box {
            flex: 1;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .details-box h4 {
            margin: 0 0 10px;
            color: #3a7c97;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .details-box p {
            margin: 5px 0;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .badge-warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }
        .badge-info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table th {
            background: #3a7c97;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
        }
        table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        table tr:nth-child(even) {
            background: #f9f9f9;
        }
        .totals {
            margin-top: 30px;
        }
        .totals table {
            width: 300px;
            margin-left: auto;
            margin-top: 0;
        }
        .totals td {
            padding: 8px 12px;
            border: none;
        }
        .totals .total-row {
            font-weight: bold;
            font-size: 16px;
            color: #3a7c97;
            border-top: 2px solid #333;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #999;
            font-size: 10px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .payment-info {
            background: #f0f7ff;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-paid {
            background: #28a745;
            color: white;
        }
        .status-unpaid {
            background: #dc3545;
            color: white;
        }
        .status-pending {
            background: #ffc107;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <h1>Greycode</h1>
                <p>IoT Solutions</p>
            </div>
            <div class="invoice-title">
                <h2>INVOICE</h2>
                <p>#{{ $order->order_number }}</p>
            </div>
        </div>

        <!-- Company Details -->
        <div class="company-details">
            <table style="width: 100%; border: none;">
                <tr>
                    <td style="border: none; padding: 5px;"><strong>Greycode</strong></td>
                    <td style="border: none; padding: 5px;" align="right"><strong>Date:</strong> {{ $order->created_at->format('d M Y') }}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 5px;">13 Stamvrug St, Val de Grace</td>
                    <td style="border: none; padding: 5px;" align="right"><strong>Payment Status:</strong> 
                        <span class="badge {{ $order->payment_status === 'paid' ? 'badge-success' : ($order->payment_status === 'pending' ? 'badge-warning' : 'badge-info') }}">
                            {{ ucfirst($order->payment_status) }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style="border: none; padding: 5px;">Pretoria, 0087</td>
                    <td style="border: none; padding: 5px;" align="right"><strong>Order Status:</strong> {{ $order->status_text }}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 5px;">South Africa</td>
                    <td style="border: none; padding: 5px;" align="right"><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}</td>
                </tr>
                <tr>
                    <td style="border: none; padding: 5px;">+27 12 481 3515</td>
                    {{-- <td style="border: none; padding: 5px;" align="right"><strong>VAT Reg:</strong> 1234567890</td> --}}
                </tr>
                <tr>
                    <td style="border: none; padding: 5px;">sales@greycode.co.za</td>
                    <td style="border: none; padding: 5px;" align="right"></td>
                </tr>
            </table>
        </div>

        <!-- Client and Shipping Details -->
        <div class="details-grid">
            <!-- Billing Address -->
            <div class="details-box">
                <h4>Bill To:</h4>
                @if($order->billingAddress)
                    <p><strong>{{ $order->user->first_name }} {{ $order->user->last_name }}</strong></p>
                    <p>{{ $order->billingAddress->address_line1 }}</p>
                    @if($order->billingAddress->address_line2)
                        <p>{{ $order->billingAddress->address_line2 }}</p>
                    @endif
                    <p>{{ $order->billingAddress->surburb }}, {{ $order->billingAddress->city }}</p>
                    <p>{{ $order->billingAddress->province }}, {{ $order->billingAddress->postal_code }}</p>
                    <p>South Africa</p>
                    <p><strong>Phone:</strong> {{ $order->billingAddress->phone_number }}</p>
                @else
                    <p><strong>{{ $order->user->first_name }} {{ $order->user->last_name }}</strong></p>
                    <p>{{ $order->user->email }}</p>
                    <p>{{ $order->user->phone }}</p>
                @endif
            </div>

            <!-- Shipping Address -->
            <div class="details-box">
                <h4>Ship To:</h4>
                @if($order->shippingAddress)
                    <p><strong>{{ $order->user->first_name }} {{ $order->user->last_name }}</strong></p>
                    <p>{{ $order->shippingAddress->address_line1 }}</p>
                    @if($order->shippingAddress->address_line2)
                        <p>{{ $order->shippingAddress->address_line2 }}</p>
                    @endif
                    <p>{{ $order->shippingAddress->surburb }}, {{ $order->shippingAddress->city }}</p>
                    <p>{{ $order->shippingAddress->province }}, {{ $order->shippingAddress->postal_code }}</p>
                    <p>South Africa</p>
                    <p><strong>Phone:</strong> {{ $order->shippingAddress->phone_number }}</p>
                @else
                    <p>Same as billing address</p>
                @endif
            </div>
        </div>

        <!-- Order Items Table -->
        <h4 style="margin: 20px 0 10px;">Order Items</h4>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price (R)</th>
                    <th>Qty</th>
                    <th>Total (R)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td>{{ $item->product_sku }}</td>
                    <td>R {{ number_format($item->product_price, 2) }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>R {{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Payment Information -->
        @if($order->payments->isNotEmpty())
        <div class="payment-info">
            <h4 style="margin: 0 0 10px;">Payment Information</h4>
            @foreach($order->payments as $payment)
            <p>
                <strong>Transaction ID:</strong> {{ $payment->transaction_id }}<br>
                <strong>Payment Date:</strong> {{ \Carbon\Carbon::parse($payment->payment_date)->format('d M Y H:i') }}<br>
                <strong>Amount:</strong> R {{ number_format($payment->amount, 2) }}<br>
                <strong>Status:</strong> <span class="badge {{ $payment->status === 'completed' ? 'badge-success' : 'badge-warning' }}">{{ ucfirst($payment->status) }}</span>
            </p>
            @endforeach
        </div>
        @endif

        <!-- Totals -->
        <div class="totals">
            <table>
                <tr>
                    <td><strong>Subtotal:</strong></td>
                    <td align="right">R {{ number_format($order->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td><strong>Shipping:</strong></td>
                    <td align="right">R {{ number_format($order->shipping_amount, 2) }}</td>
                </tr>
                <tr>
                    <td><strong>VAT (15%):</strong></td>
                    <td align="right">R {{ number_format($order->vat, 2) }}</td>
                </tr>
                @if($order->discount_amount > 0)
                <tr>
                    <td><strong>Discount:</strong></td>
                    <td align="right">-R {{ number_format($order->discount_amount, 2) }}</td>
                </tr>
                @endif
                <tr class="total-row">
                    <td><strong>TOTAL:</strong></td>
                    <td align="right"><strong>R {{ number_format($order->total_amount, 2) }}</strong></td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Thank you for shopping with Greycode!</p>
            {{-- <p>This is a computer-generated invoice and does not require a physical signature.</p> --}}
            <p>For any queries, please contact us at sales@greycode.co.za or +27 12 481 3515</p>
        </div>
    </div>
</body>
</html>