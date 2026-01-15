import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

export default function OrderDetails() {
  const [showInvoice, setShowInvoice] = useState(false)

  // Mock order data
  const order = {
    id: 'GC-ORD-001234',
    date: '2024-01-15',
    status: 'delivered',
    statusText: 'Delivered',
    total: 1850,
    subtotal: 1850,
    shipping: 0,
    tax: 259,
    discount: 100,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    shippingMethod: 'Standard Shipping',
    trackingNumber: 'TRK789012345',
    deliveryDate: '2024-01-18',
    estimatedDelivery: '2024-01-20',
    items: 3,
    address: {
      shipping: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2000',
        country: 'South Africa',
        phone: '+27 11 123 4567'
      },
      billing: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2000',
        country: 'South Africa'
      }
    },
    itemsDetails: [
      {
        id: 1,
        name: 'Greycode IoT Dev Board',
        price: 900,
        quantity: 1,
        sku: 'GC-IOT-001',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'
      },
      {
        id: 2,
        name: 'Sensor Pack',
        price: 350,
        quantity: 2,
        sku: 'GC-SEN-002',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=150'
      }
    ],
    timeline: [
      { date: '2024-01-15', time: '14:30', status: 'Order Placed', description: 'Order confirmed and payment received' },
      { date: '2024-01-16', time: '09:15', status: 'Processing', description: 'Order being prepared for shipment' },
      { date: '2024-01-16', time: '16:45', status: 'Shipped', description: 'Order shipped with tracking number' },
      { date: '2024-01-18', time: '11:20', status: 'Out for Delivery', description: 'Package is out for delivery' },
      { date: '2024-01-18', time: '15:30', status: 'Delivered', description: 'Package delivered successfully' }
    ]
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const printInvoice = () => {
    setShowInvoice(true)
    setTimeout(() => {
      window.print()
      setShowInvoice(false)
    }, 500)
  }

  return (
    <MainLayout>
      <Head title={`Order ${order.id}`} />
      <SecondaryNav />
      
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex flex-wrap items-center text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li>
                <Link href="/orders" className="hover:text-blue-600 transition-colors duration-300">
                  My Orders
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-gray-900 font-medium">Order #{order.id}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.statusText}
                  </span>
                  <span className="text-gray-600">Placed on {order.date}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={printInvoice}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Invoice
                </button>
                {order.status === 'processing' && (
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-300">
                    Cancel Order
                  </button>
                )}
                <Link 
                  href="/orders"
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                >
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items and Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Order Items ({order.items} items)</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {order.itemsDetails.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0U1RTVFNSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPlByb2R1Y3Q8L3RleHQ+PC9zdmc+'
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">SKU: {item.sku}</p>
                            <p className="text-gray-700">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 mb-1">
                            R {(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-gray-600">R {item.price.toLocaleString()} each</p>
                          <Link 
                            href={`/products/${item.id}`}
                            className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Product →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Order Status Timeline</h2>
                </div>
                
                <div className="p-6">
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                    
                    {order.timeline.map((step, index) => (
                      <div key={index} className="relative flex items-start mb-8 last:mb-0">
                        {/* Circle */}
                        <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === 'Delivered' ? 'bg-green-500' :
                          step.status === 'Shipped' ? 'bg-blue-500' :
                          step.status === 'Processing' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        
                        {/* Content */}
                        <div className="ml-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900">{step.status}</h3>
                            <span className="text-sm text-gray-600">{step.date} at {step.time}</span>
                          </div>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary and Details */}
            <div className="space-y-8">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">R {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">R {order.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">R {order.tax.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">-R {order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>R {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                      <div className="flex items-center">
                        <svg className="w-8 h-8 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-medium">{order.paymentMethod}</p>
                          <p className="text-sm text-gray-600">Status: <span className="text-green-600">{order.paymentStatus}</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Shipping Method</h3>
                      <p className="text-gray-700">{order.shippingMethod}</p>
                      {order.trackingNumber && (
                        <p className="text-sm text-gray-600 mt-1">
                          Tracking: <span className="font-medium">{order.trackingNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Billing Address */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                      <div className="text-gray-700 space-y-1">
                        <p>{order.address.shipping.name}</p>
                        <p>{order.address.shipping.street}</p>
                        <p>{order.address.shipping.city}</p>
                        <p>{order.address.shipping.province} {order.address.shipping.postalCode}</p>
                        <p>{order.address.shipping.country}</p>
                        <p>Phone: {order.address.shipping.phone}</p>
                      </div>
                    </div>
                    
                    {/* Billing Address */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Billing Address</h3>
                      <div className="text-gray-700 space-y-1">
                        <p>{order.address.billing.name}</p>
                        <p>{order.address.billing.street}</p>
                        <p>{order.address.billing.city}</p>
                        <p>{order.address.billing.province} {order.address.billing.postalCode}</p>
                        <p>{order.address.billing.country}</p>
                        <p className="text-sm text-gray-600">(Same as shipping address)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-gray-700 mb-4">If you have any questions about your order, our support team is here to help.</p>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300">
                    Contact Support
                  </button>
                  <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors duration-300">
                    Request Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice Modal (Hidden until print) */}
      {showInvoice && (
        <div className="fixed inset-0 bg-white p-8 hidden print:block">
          <div className="max-w-4xl mx-auto">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-gray-600">Greycode Electronics</p>
                <p className="text-gray-600">123 Tech Street, Sandton, 2196</p>
                <p className="text-gray-600">VAT: 123456789</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.id}</h2>
                <p className="text-gray-600">Date: {order.date}</p>
                <p className="text-gray-600">Invoice #: INV-{order.id}</p>
              </div>
            </div>

            {/* Billing Info */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Bill To:</h3>
                <div className="text-gray-700">
                  <p>{order.address.billing.name}</p>
                  <p>{order.address.billing.street}</p>
                  <p>{order.address.billing.city}, {order.address.billing.province}</p>
                  <p>{order.address.billing.postalCode}</p>
                  <p>{order.address.billing.country}</p>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Ship To:</h3>
                <div className="text-gray-700">
                  <p>{order.address.shipping.name}</p>
                  <p>{order.address.shipping.street}</p>
                  <p>{order.address.shipping.city}, {order.address.shipping.province}</p>
                  <p>{order.address.shipping.postalCode}</p>
                  <p>{order.address.shipping.country}</p>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 font-bold text-gray-900">Description</th>
                  <th className="text-right py-3 font-bold text-gray-900">Quantity</th>
                  <th className="text-right py-3 font-bold text-gray-900">Unit Price</th>
                  <th className="text-right py-3 font-bold text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.itemsDetails.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 text-gray-900">{item.name}</td>
                    <td className="py-4 text-right text-gray-900">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-900">R {item.price.toLocaleString()}</td>
                    <td className="py-4 text-right text-gray-900 font-semibold">
                      R {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="ml-auto w-64">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">R {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">R {order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (14%):</span>
                  <span className="font-medium">R {order.tax.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">-R {order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>R {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-300 text-center text-gray-600">
              <p className="mb-2">Thank you for your business!</p>
              <p>Greycode Electronics • support@greycode.co.za • +27 11 123 4567</p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}