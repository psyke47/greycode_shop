import React, { useState } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'


export default function Tracking({ trackingInfo: initialTrackingInfo, searchParams = {}, flash }) {
  const [isLoading, setIsLoading] = useState(false)
  
  const { data, setData, post, errors, processing } = useForm({
    search_input: searchParams.search_input || '',
    order_id: searchParams.order_id || '',
    tracking_number: searchParams.tracking_number || '',
    email: searchParams.email || '',
  })

  const handleSubmit = (e) => {
        e.preventDefault()
    
    // Determine if input is order number or tracking number
    const searchValue = data.search_input.trim()
    
    if (!searchValue) {
      post('/tracking', {
        data: { ...data, search_input: '' },
        preserveScroll: true,
        onStart: () => setIsLoading(true),
        onFinish: () => setIsLoading(false),
      })
      return
    }

    // Auto-detect what type of input it is
    const isOrderNumber = searchValue.startsWith('GC-ORD-') || /^\d+$/.test(searchValue)
    const isTrackingNumber = searchValue.startsWith('TRK') || /^[A-Z0-9]{10,}$/.test(searchValue)

    let formData = { ...data }
    
    if (isOrderNumber) {
      formData.order_id = searchValue
      formData.tracking_number = ''
    } else if (isTrackingNumber) {
      formData.tracking_number = searchValue
      formData.order_id = ''
    } else {
      // If ambiguous, try both
      formData.order_id = searchValue
      formData.tracking_number = searchValue
    }

    post('/tracking', {
      data: formData,
      preserveScroll: true,
      onStart: () => setIsLoading(true),
      onFinish: () => setIsLoading(false),
    })
  }

  const getStatusColor = (status) => {
    const colorMap = {
      'delivered': 'bg-green-100 text-green-800',
      'shipped': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-orange-100 text-orange-800',
      'cancelled': 'bg-red-100 text-red-800',
      'refunded': 'bg-red-100 text-red-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const trackingInfo = initialTrackingInfo || null

  return (
    <MainLayout>
      <Head title="Track Your Order" />
      

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Flash Messages */}
          {flash?.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {flash.error}
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your tracking number or order ID to check the status</p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Single Smart Input Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order or Tracking Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={data.search_input}
                        onChange={(e) => setData('search_input', e.target.value)}
                        placeholder="Enter GC-ORD-XXXX, TRKXXXXXX, or order number"
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>✓ Accepts: <span className="font-medium">GC-ORD-1234</span> (Order ID)</p>
                      <p>✓ Accepts: <span className="font-medium">TRK789012345</span> (Tracking number)</p>
                      <p>✓ Accepts: <span className="font-medium">1234</span> (Order number)</p>
                    </div>
                    {errors.search_input && (
                      <p className="mt-1 text-sm text-red-600">{errors.search_input}</p>
                    )}
                  </div>

                  {/* Email (Optional) - Show only for guest tracking */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address (Optional)
                      <span className="text-gray-500 text-sm ml-1">- For guest orders</span>
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Only needed if you placed the order as a guest
                    </p>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {errors.tracking && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                      {errors.tracking}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={processing || isLoading || !data.search_input.trim()}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {processing || isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Tracking...
                      </>
                    ) : (
                      'Track Order'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  <strong>Note:</strong> You can find your Order ID in your order confirmation email.
                  The tracking number will be sent to you once your order is shipped.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  <strong>Logged in users:</strong> Your orders are automatically linked to your account.
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Results */}
          {trackingInfo && (
            <div className="space-y-8">
              {/* Status Overview */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Status</h2>
                      <div className="flex items-center space-x-4">
                        <span className={`px-4 py-2 rounded-full text-lg font-bold ${getStatusColor(trackingInfo.status)}`}>
                          {trackingInfo.statusText}
                        </span>
                        <p className="text-gray-600">
                          Order ID: <span className="font-semibold">{trackingInfo.orderId}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 mb-1">
                        Tracking: {trackingInfo.trackingNumber}
                      </p>
                      <p className="text-gray-600">
                        Carrier: <span className="font-medium">{trackingInfo.carrier}</span>
                      </p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Shipped On</h3>
                      <p className="text-2xl font-bold text-blue-700">
                        {trackingInfo.shippedDate || 'Not shipped yet'}
                      </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                      <p className="text-2xl font-bold text-green-700">
                        {trackingInfo.estimatedDelivery || 'To be confirmed'}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Actual Delivery</h3>
                      <p className="text-2xl font-bold text-purple-700">
                        {trackingInfo.actualDelivery || 'Not delivered yet'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {trackingInfo.items && trackingInfo.items.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
                  <div className="space-y-4">
                    {trackingInfo.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-gray-600">
                              {trackingInfo.currency} {item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {trackingInfo.currency} {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Order Total</span>
                        <span>{trackingInfo.currency} {trackingInfo.orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

{/* Timeline - Mobile Optimized */}
<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
  <div className="p-6 md:p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tracking Timeline</h2>
  </div>
  
  <div className="px-6 pb-8 md:px-8 max-w-2xl mx-auto">
    <div className="space-y-6">
      {trackingInfo.timeline.map((event, index) => (
        <div key={index} className="flex">
          {/* Left side - Circle and connecting line (except last) */}
          <div className="flex flex-col items-center mr-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              event.completed
                ? (event.status === 'Delivered' ? 'bg-green-500' :
                   event.status === 'Shipped' ? 'bg-blue-500' :
                   event.status === 'In Transit' ? 'bg-purple-500' :
                   'bg-gray-500')
                : 'bg-gray-300 border-2 border-gray-400'
            }`}>
              {event.completed ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              )}
            </div>
            
            {/* Connecting line (except for last item) */}
            {index < trackingInfo.timeline.length - 1 && (
              <div className="flex-1 w-0.5 bg-gray-200 mt-2"></div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="flex-1 pb-6">
            <div className={`rounded-xl p-5 ${
              event.completed
                ? (event.status === 'Delivered' ? 'bg-green-50 border-l-4 border-green-500' :
                   event.status === 'Shipped' ? 'bg-blue-50 border-l-4 border-blue-500' :
                   'bg-gray-50 border-l-4 border-gray-500')
                : 'bg-gray-50 border-l-4 border-gray-300'
            }`}>
              <div className="mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">{event.status}</h3>
                  <span className="text-sm text-gray-600 mt-1 sm:mt-0">
                    {event.date} {event.time !== '--:--' && `• ${event.time}`}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{event.description}</p>
              
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

              {/* Package Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Package Info */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Package Details</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Carrier</span>
                      <span className="font-semibold">{trackingInfo.carrier}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold">{trackingInfo.service}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-semibold">{trackingInfo.weight}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Dimensions</span>
                      <span className="font-semibold">{trackingInfo.dimensions}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Origin</span>
                      <span className="font-semibold">{trackingInfo.origin}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Destination</span>
                      <span className="font-semibold">{trackingInfo.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Recipient & Sender Info */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Recipient */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 text-lg">Recipient</h3>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">{trackingInfo.recipient.name}</p>
                        <p className="text-gray-600">{trackingInfo.recipient.address}</p>
                        <p className="text-gray-600">{trackingInfo.recipient.phone}</p>
                      </div>
                    </div>

                    {/* Sender */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 text-lg">Sender</h3>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">{trackingInfo.sender.name}</p>
                        <p className="text-gray-600">{trackingInfo.sender.address}</p>
                        <p className="text-gray-600">{trackingInfo.sender.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {trackingInfo.status === 'delivered' && (
                  <button className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300">
                    Leave Review
                  </button>
                )}
                
                <Link
                  href={`/order/${trackingInfo.orderId?.replace('GC-ORD-', '')}`}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 text-center"
                >
                  View Order Details
                </Link>
                
                <Link
                  href="/contact"
                  className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 text-center"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {/* Help Section (shown when no tracking info) */}
          {!trackingInfo && (
            <div className="bg-gray-50 rounded-2xl p-8 mt-8">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help Finding Your Order?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white p-6 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Check Your Email</h4>
                    <p className="text-gray-600 text-sm">
                      Look for your order confirmation email containing your Order ID and tracking number.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Log In to Your Account</h4>
                    <p className="text-gray-600 text-sm">
                      If you have an account, all your orders are available in your order history.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Support</h4>
                    <p className="text-gray-600 text-sm">
                      Can't find your order? Our support team is here to help you locate it.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    Contact Support Team
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}