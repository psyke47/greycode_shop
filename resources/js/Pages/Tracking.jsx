import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [trackingInfo, setTrackingInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock tracking data
  const mockTrackingData = {
    orderId: 'GC-ORD-001234',
    trackingNumber: 'TRK789012345',
    status: 'delivered',
    statusText: 'Delivered',
    estimatedDelivery: '2024-01-20',
    actualDelivery: '2024-01-18',
    shippedDate: '2024-01-16',
    carrier: 'FastShip SA',
    service: 'Standard Shipping',
    weight: '1.2 kg',
    dimensions: '25 × 18 × 6 cm',
    origin: 'Johannesburg, SA',
    destination: 'Cape Town, SA',
    timeline: [
      {
        date: '2024-01-15',
        time: '14:30',
        status: 'Order Placed',
        location: 'Johannesburg, SA',
        description: 'Order confirmed and payment processed'
      },
      {
        date: '2024-01-16',
        time: '09:15',
        status: 'Processing',
        location: 'Johannesburg Warehouse',
        description: 'Order being prepared for shipment'
      },
      {
        date: '2024-01-16',
        time: '16:45',
        status: 'Shipped',
        location: 'Johannesburg, SA',
        description: 'Package picked up by carrier'
      },
      {
        date: '2024-01-17',
        time: '08:30',
        status: 'In Transit',
        location: 'Bloemfontein, SA',
        description: 'Package in transit to destination'
      },
      {
        date: '2024-01-18',
        time: '07:15',
        status: 'Arrived at Facility',
        location: 'Cape Town Hub',
        description: 'Package arrived at local facility'
      },
      {
        date: '2024-01-18',
        time: '10:45',
        status: 'Out for Delivery',
        location: 'Cape Town, SA',
        description: 'Package loaded onto delivery vehicle'
      },
      {
        date: '2024-01-18',
        time: '15:30',
        status: 'Delivered',
        location: 'Cape Town, SA',
        description: 'Package delivered successfully'
      }
    ],
    recipient: {
      name: 'John Doe',
      address: '123 Main Street, Cape Town, 8000',
      phone: '+27 21 123 4567'
    },
    sender: {
      name: 'Greycode Electronics',
      address: '456 Tech Ave, Johannesburg, 2000',
      phone: '+27 11 987 6543'
    }
  }

  const trackOrder = (e) => {
    e.preventDefault()
    
    if (!trackingNumber.trim() && !orderId.trim()) {
      alert('Please enter either a tracking number or order ID')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setTrackingInfo(mockTrackingData)
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'in-transit': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <MainLayout>
      <Head title="Track Your Order" />
      <SecondaryNav />
      
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your tracking number or order ID to check the status</p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={trackOrder}>
                <div className="space-y-6">
                  {/* Order ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order ID
                    </label>
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g., GC-ORD-001234"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Tracking Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g., TRK789012345"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
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
                      <p className="text-2xl font-bold text-blue-700">{trackingInfo.shippedDate}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                      <p className="text-2xl font-bold text-green-700">{trackingInfo.estimatedDelivery}</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Actual Delivery</h3>
                      <p className="text-2xl font-bold text-purple-700">{trackingInfo.actualDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tracking Timeline</h2>
                  
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform md:-translate-x-1/2"></div>
                    
                    {trackingInfo.timeline.map((event, index) => (
                      <div key={index} className={`relative mb-12 last:mb-0 ${
                        index % 2 === 0 ? 'md:pr-1/2 md:pl-8' : 'md:pl-1/2 md:pr-8'
                      }`}>
                        <div className={`flex items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                          {/* Circle */}
                          <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            event.status === 'Delivered' ? 'bg-green-500' :
                            event.status === 'Shipped' ? 'bg-blue-500' :
                            event.status === 'In Transit' ? 'bg-purple-500' :
                            'bg-gray-500'
                          }`}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          
                          {/* Content */}
                          <div className={`ml-6 md:ml-6 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                            <div className={`bg-gray-50 rounded-xl p-6 ${
                              event.status === 'Delivered' ? 'border-l-4 border-green-500' :
                              event.status === 'Shipped' ? 'border-l-4 border-blue-500' :
                              'border-l-4 border-gray-500'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900 text-lg">{event.status}</h3>
                                <span className="text-gray-600">{event.date} at {event.time}</span>
                              </div>
                              <p className="text-gray-700 mb-2">{event.description}</p>
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">{event.location}</span>
                              </div>
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

              {/* Support Section */}
              <div className="bg-blue-50 rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Need Assistance?</h3>
                    <p className="text-gray-700">
                      If you have any questions about your shipment or need help with your order,
                      our support team is available 24/7.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/contact"
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 text-center"
                    >
                      Contact Support
                    </Link>
                    <button className="bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition-colors duration-300">
                      Download Shipping Label
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}