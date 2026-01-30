import React, { useState, useEffect } from 'react'
import { Head, Link, usePage, router, useForm } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

export default function Order() {
  const { orders, filters, pagination, stats, flash } = usePage().props
  const [searchTerm, setSearchTerm] = useState(filters?.search || '')
  const [activeTab, setActiveTab] = useState(filters?.status || 'all')
  const [isLoading, setIsLoading] = useState(false)

  const { post } = useForm()

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters?.search) {
        router.get('/order', { search: searchTerm, status: activeTab }, {
          preserveState: true,
          replace: true,
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, activeTab])

  const handleTabChange = (status) => {
    setActiveTab(status)
    router.get(route('orders'), { search: searchTerm, status }, { // Use named route
        preserveState: true,
        replace: true,
    })
  }

  // And for the back link:
  {/* <Link href={route('orders')}>Back to Orders</Link> */}

  const handleCancelOrder = (orderId, e) => {
    e.preventDefault()
    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      post(`/orders/${orderId}/cancel`, {
        preserveScroll: true,
        onSuccess: () => {
          router.reload()
        }
      })
    }
  }

  const handleRequestReturn = (orderId, e) => {
    e.preventDefault()
    const reason = prompt('Please enter the reason for return:')
    if (reason) {
      post(`/orders/${orderId}/return`, {
        reason: reason,
        preserveScroll: true,
        onSuccess: () => {
          router.reload()
        }
      })
    }
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

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded',
      'return_requested': 'Return Requested',
    }
    return statusMap[status] || status
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Get order actions based on status
  const getOrderActions = (order) => {
    const actions = []
    
    if (order.status === 'processing' || order.status === 'pending') {
      actions.push({
        label: 'Cancel Order',
        color: 'red',
        onClick: (e) => handleCancelOrder(order.id, e)
      })
    }
    
    if (order.status === 'delivered') {
      actions.push({
        label: 'Request Return',
        color: 'purple',
        onClick: (e) => handleRequestReturn(order.id, e)
      })
    }
    
    actions.push({
      label: 'View Details',
      color: 'blue',
      href: `/orders/${order.id}`
    })
    
    return actions
  }

  return (
    <MainLayout>
      <Head title="My Orders" />
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

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">View and manage your orders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Processing</p>
              <p className="text-2xl font-bold text-yellow-600">{stats?.processing || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Shipped</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.shipped || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{stats?.delivered || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats?.cancelled || 0}</p>
            </div>
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
                    placeholder="Search by order number or address..."
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
                  onChange={(e) => handleTabChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Count and Pagination */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <p className="text-gray-600">
                Showing <span className="font-semibold">{orders?.length || 0}</span> of <span className="font-semibold">{pagination?.total || 0}</span> orders
              </p>
            </div>
            
            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.get(pagination.links[0].url, {}, { preserveState: true })}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  &laquo; First
                </button>
                <button
                  onClick={() => router.get(pagination.links[pagination.current_page - 1]?.url, {}, { preserveState: true })}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  &lsaquo; Previous
                </button>
                <span className="px-3 py-1">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  onClick={() => router.get(pagination.links[pagination.current_page + 1]?.url, {}, { preserveState: true })}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Next &rsaquo;
                </button>
                <button
                  onClick={() => router.get(pagination.links[pagination.links.length - 1].url, {}, { preserveState: true })}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Last &raquo;
                </button>
              </div>
            )}
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {(!orders || orders.length === 0) ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab !== 'all' 
                    ? `You have no ${activeTab} orders.` 
                    : "You haven't placed any orders yet."}
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const actions = getOrderActions(order)
                
                return (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{order.order_number}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <p className="text-gray-600">Placed on {order.date}</p>
                          <p className="text-gray-600 text-sm mt-1">
                            Payment: <span className={`font-medium ${
                              order.payment_status === 'paid' ? 'text-green-600' : 
                              order.payment_status === 'refunded' ? 'text-red-600' : 
                              'text-yellow-600'
                            }`}>
                              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                            </span>
                            {order.payment_method && ` via ${order.payment_method}`}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
                          <p className="text-gray-600">{order.items_count} item{order.items_count > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                {item.sku && (
                                  <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                  {formatCurrency(item.price)} × {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            <span className="font-medium">Delivery Address:</span> {order.address}
                          </p>
                          {order.tracking_number && (
                            <p className="text-gray-700">
                              <span className="font-medium">Tracking:</span> {order.tracking_number}
                            </p>
                          )}
                          {order.delivery_date ? (
                            <p className="text-gray-700">
                              <span className="font-medium">Delivered:</span> {order.delivery_date}
                            </p>
                          ) : order.estimated_delivery && (
                            <p className="text-gray-700">
                              <span className="font-medium">Estimated Delivery:</span> {order.estimated_delivery}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {actions.map((action, index) => (
                            action.href ? (
                              <Link
                                key={index}
                                href={action.href}
                                className={`px-6 py-2 bg-${action.color}-600 text-white rounded-lg font-medium hover:bg-${action.color}-700 transition-colors duration-300`}
                              >
                                {action.label}
                              </Link>
                            ) : (
                              <button
                                key={index}
                                onClick={action.onClick}
                                className={`px-6 py-2 bg-${action.color}-600 text-white rounded-lg font-medium hover:bg-${action.color}-700 transition-colors duration-300`}
                              >
                                {action.label}
                              </button>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Bottom Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.get(pagination.links[0].url, {}, { preserveState: true })}
                  disabled={pagination.current_page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  &laquo;
                </button>
                
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  let pageNum
                  if (pagination.last_page <= 5) {
                    pageNum = i + 1
                  } else if (pagination.current_page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.current_page >= pagination.last_page - 2) {
                    pageNum = pagination.last_page - 4 + i
                  } else {
                    pageNum = pagination.current_page - 2 + i
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => router.get(pagination.links[pageNum]?.url, {}, { preserveState: true })}
                      className={`px-4 py-2 border rounded-lg ${
                        pagination.current_page === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => router.get(pagination.links[pagination.links.length - 1].url, {}, { preserveState: true })}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}