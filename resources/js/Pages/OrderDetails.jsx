import React from 'react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

export default function OrderDetails() {
  const { order, flash } = usePage().props

  if (!order) {
    return (
      <MainLayout>
        <Head title="Order Not Found" />
        <SecondaryNav />
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link href="/orders" className="text-blue-600 hover:text-blue-800">
            Return to Orders
          </Link>
        </div>
      </MainLayout>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': 
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': 
      case 'refunded': return 'bg-red-100 text-red-800'
      case 'return_requested': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <MainLayout>
      <Head title={`Order ${order.order_number}`} />
      <SecondaryNav />

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Flash Messages */}
          {flash.success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {flash.success}
            </div>
          )}
          
          {flash.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {flash.error}
            </div>
          )}

          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/orders"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Orders
            </Link>
          </div>

          {/* Order Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.order_number}</h1>
                <p className="text-gray-600">Placed on {order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                  {order.status_text}
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Download Invoice
                </button>
              </div>
            </div>

            {/* Order Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Order Status</span>
                <span className="text-sm text-gray-600">{order.status_text}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: order.status === 'delivered' ? '100%' :
                           order.status === 'shipped' ? '75%' :
                           order.status === 'processing' ? '50%' :
                           order.status === 'pending' ? '25%' : '0%'
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Ordered</span>
                <span>Processing</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Payment Status</p>
                <p className="text-gray-600">{order.payment_method}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                order.payment_status === 'refunded' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <Link 
                            href={`/products/${item.product_slug || item.product_id}`}
                            className="font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          {item.sku && (
                            <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                          )}
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                        <Link 
                          href={`/products/${item.product_slug || item.product_id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Buy Again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
                  <p className="text-gray-700 whitespace-pre-line">{order.notes}</p>
                </div>
              )}

              {order.customer_note && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Note</h2>
                  <p className="text-gray-700">{order.customer_note}</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (15%)</span>
                    <span className="font-medium">{formatCurrency(order.vat)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatCurrency(order.shipping)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-700">
                      {order.shipping_address.line1}<br/>
                      {order.shipping_address.line2 && <>{order.shipping_address.line2}<br/></>}
                      {order.shipping_address.surburb}<br/>
                      {order.shipping_address.city}, {order.shipping_address.province}<br/>
                      {order.shipping_address.postal_code}<br/>
                      {order.shipping_address.country}<br/>
                      Phone: {order.shipping_address.phone}
                    </p>
                  </div>
                )}

                {/* Billing Address */}
                {order.billing_address && order.shipping_address?.line1 !== order.billing_address?.line1 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Billing Address</h3>
                    <p className="text-gray-700">
                      {order.billing_address.line1}<br/>
                      {order.billing_address.line2 && <>{order.billing_address.line2}<br/></>}
                      {order.billing_address.surburb}<br/>
                      {order.billing_address.city}, {order.billing_address.province}<br/>
                      {order.billing_address.postal_code}<br/>
                      {order.billing_address.country}<br/>
                      Phone: {order.billing_address.phone}
                    </p>
                  </div>
                )}

                {/* Delivery Info */}
                <div className="space-y-4">
                  {order.tracking_number && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Tracking Number</h3>
                      <p className="text-gray-700 font-mono">{order.tracking_number}</p>
                    </div>
                  )}
                  
                  {order.delivery_date ? (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Delivered On</h3>
                      <p className="text-gray-700">{order.delivery_date}</p>
                    </div>
                  ) : order.estimated_delivery && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Estimated Delivery</h3>
                      <p className="text-gray-700">{order.estimated_delivery}</p>
                    </div>
                  )}

                  {/* Payment Details */}
                  {order.payments && order.payments.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
                      {order.payments.map((payment) => (
                        <div key={payment.id} className="text-sm text-gray-700 mb-1">
                          <p>{payment.method}: {formatCurrency(payment.amount)}</p>
                          <p className="text-gray-600">Status: {payment.status}</p>
                          {payment.transaction_id && (
                            <p className="text-gray-600">Transaction: {payment.transaction_id}</p>
                          )}
                          <p className="text-gray-600">Date: {payment.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  {order.status === 'processing' && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this order?')) {
                          router.post(`/orders/${order.id}/cancel`)
                        }
                      }}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                  
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => {
                        const reason = prompt('Please enter the reason for return:')
                        if (reason) {
                          router.post(`/orders/${order.id}/return`, { reason })
                        }
                      }}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Request Return
                    </button>
                  )}
                  
                  <Link
                    href="/products"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}