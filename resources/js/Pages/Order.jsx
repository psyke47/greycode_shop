import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

export default function Order() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock orders data
  const orders = [
    {
      id: 'GC-ORD-001234',
      date: '2024-01-15',
      status: 'delivered',
      statusText: 'Delivered',
      total: 1850,
      items: 3,
      trackingNumber: 'TRK789012345',
      deliveryDate: '2024-01-18',
      address: '123 Main St, Johannesburg, 2000',
      itemsDetails: [
        { name: 'Greycode IoT Dev Board', price: 900, quantity: 1 },
        { name: 'Sensor Pack', price: 350, quantity: 2 }
      ]
    },
    {
      id: 'GC-ORD-001233',
      date: '2024-01-10',
      status: 'shipped',
      statusText: 'Shipped',
      total: 1200,
      items: 1,
      trackingNumber: 'TRK789012344',
      estimatedDelivery: '2024-01-20',
      address: '456 Oak Ave, Cape Town, 8000',
      itemsDetails: [
        { name: 'Raspberry Pi 4', price: 1200, quantity: 1 }
      ]
    },
    {
      id: 'GC-ORD-001232',
      date: '2024-01-05',
      status: 'processing',
      statusText: 'Processing',
      total: 650,
      items: 1,
      address: '789 Pine Rd, Durban, 4000',
      itemsDetails: [
        { name: 'Arduino Starter Kit', price: 650, quantity: 1 }
      ]
    },
    {
      id: 'GC-ORD-001231',
      date: '2023-12-28',
      status: 'cancelled',
      statusText: 'Cancelled',
      total: 450,
      items: 1,
      address: '321 Elm St, Pretoria, 0001',
      itemsDetails: [
        { name: 'ESP32 Development Board', price: 450, quantity: 1 }
      ]
    },
    {
      id: 'GC-ORD-001230',
      date: '2023-12-20',
      status: 'delivered',
      statusText: 'Delivered',
      total: 2800,
      items: 4,
      trackingNumber: 'TRK789012343',
      deliveryDate: '2023-12-23',
      address: '654 Maple Blvd, Port Elizabeth, 6000',
      itemsDetails: [
        { name: 'Robotics Kit', price: 1850, quantity: 1 },
        { name: 'Smart Light Bulb', price: 350, quantity: 2 },
        { name: 'Temperature Sensor', price: 120, quantity: 3 }
      ]
    }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || order.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <MainLayout>
      <Head title="My Orders" />
      <SecondaryNav />
      
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">View and manage your orders</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by order ID or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">Filter:</span>
                <select 
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> orders
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">No orders match your search criteria</p>
                <Link 
                  href="/products"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.statusText}
                          </span>
                        </div>
                        <p className="text-gray-600">Placed on {order.date}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">R {order.total.toLocaleString()}</p>
                        <p className="text-gray-600">{order.items} item{order.items > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {order.itemsDetails.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">R {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-gray-700 mb-1">
                          <span className="font-medium">Delivery Address:</span> {order.address}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-gray-700">
                            <span className="font-medium">Tracking:</span> {order.trackingNumber}
                          </p>
                        )}
                        {order.deliveryDate && (
                          <p className="text-gray-700">
                            <span className="font-medium">Delivered:</span> {order.deliveryDate}
                          </p>
                        )}
                        {order.estimatedDelivery && (
                          <p className="text-gray-700">
                            <span className="font-medium">Estimated Delivery:</span> {order.estimatedDelivery}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link 
                          href={`/orders/${order.id}`}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                        >
                          View Details
                        </Link>
                        {order.status === 'delivered' && (
                          <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-300">
                            Leave Review
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-300">
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}