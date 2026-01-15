import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Greycode IoT Dev Board',
      price: 900,
      quantity: 1,
      sku: 'GC-IOT-001',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150',
      category: 'DIY',
      inStock: true,
      stockCount: 42
    },
    {
      id: 2,
      name: 'Sensor Pack',
      price: 350,
      quantity: 2,
      sku: 'GC-SEN-002',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=150',
      category: 'Components',
      inStock: true,
      stockCount: 25
    },
    {
      id: 3,
      name: 'Raspberry Pi 4',
      price: 1200,
      quantity: 1,
      sku: 'GC-RPI-003',
      image: 'https://images.unsplash.com/photo-1624124544403-6c7a1d5950a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150',
      category: 'Components',
      inStock: false,
      stockCount: 0
    }
  ])

  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 500 ? 0 : 99
  const tax = subtotal * 0.14
  const discount = couponApplied ? subtotal * 0.1 : 0 // 10% discount if coupon applied
  const total = subtotal + shipping + tax - discount

  const applyCoupon = () => {
    if (couponCode.trim() === '') return
    if (couponCode.toUpperCase() === 'GREYCODE10') {
      setCouponApplied(true)
      alert('Coupon applied! 10% discount added.')
    } else {
      alert('Invalid coupon code. Try "GREYCODE10"')
    }
  }

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCartItems([])
    }
  }

  const continueShopping = () => {
    window.history.back()
  }

  const proceedToCheckout = () => {
    alert('Proceeding to checkout...')
    // In real app: router.visit('/checkout')
  }

  return (
    <MainLayout>
      <Head title="Shopping Cart" />
      <SecondaryNav />
      
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet.
              </p>
              <div className="space-x-4">
                <Link 
                  href="/products"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                >
                  Browse Products
                </Link>
                <button 
                  onClick={continueShopping}
                  className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                    <button 
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 font-medium flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Cart
                    </button>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U1RTVFNSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5Qcm9kdWN0PC90ZXh0Pjwvc3ZnPg=='
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                      <Link href={`/products/${item.id}`} className="hover:text-blue-600">
                                        {item.name}
                                      </Link>
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">SKU: {item.sku}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                      item.category === 'DIY' ? 'bg-blue-100 text-blue-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {item.category}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Stock Status */}
                                <div className="mt-4">
                                  {item.inStock ? (
                                    <p className="text-green-600 text-sm flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      In Stock ({item.stockCount} available)
                                    </p>
                                  ) : (
                                    <p className="text-red-600 text-sm flex items-center">
                                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                      Out of Stock
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Price and Quantity */}
                              <div className="flex flex-col items-end space-y-4">
                                <p className="text-2xl font-bold text-gray-900">
                                  R {(item.price * item.quantity).toLocaleString()}
                                </p>
                                
                                <div className="flex items-center space-x-4">
                                  {/* Quantity Selector */}
                                  <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                      disabled={item.quantity <= 1}
                                    >
                                      −
                                    </button>
                                    <span className="px-4 py-1 text-lg font-medium min-w-[3rem] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                      disabled={!item.inStock || (item.stockCount && item.quantity >= item.stockCount)}
                                    >
                                      +
                                    </button>
                                  </div>
                                  
                                  {/* Remove Button */}
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-600 hover:text-red-800 p-2"
                                    title="Remove item"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                                
                                <p className="text-gray-600 text-sm">
                                  R {item.price.toLocaleString()} each
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Continue Shopping */}
                <div className="mt-6">
                  <button 
                    onClick={continueShopping}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </button>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  {/* Coupon Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                      >
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-green-600 text-sm mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        10% discount applied!
                      </p>
                    )}
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">R {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'FREE' : `R ${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (14%)</span>
                      <span className="font-medium">R {tax.toFixed(0).toLocaleString()}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount (10%)</span>
                        <span className="font-medium text-green-600">
                          -R {discount.toFixed(0).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>R {total.toFixed(0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Info */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-blue-700">Free Shipping</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      {subtotal >= 500 
                        ? 'Free shipping applied!'
                        : `Add R ${(500 - subtotal).toLocaleString()} more for free shipping`
                      }
                    </p>
                  </div>
                  
                  {/* Checkout Button */}
                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors duration-300 mb-4"
                    disabled={cartItems.some(item => !item.inStock)}
                  >
                    Proceed to Checkout
                  </button>
                  
                  {cartItems.some(item => !item.inStock) && (
                    <p className="text-red-600 text-sm text-center mb-4">
                      Please remove out-of-stock items before checkout
                    </p>
                  )}
                  
                  {/* Payment Methods */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-3">Secure payment with:</p>
                    <div className="flex space-x-3">
                      <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div className="w-10 h-6 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                        MC
                      </div>
                      <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center text-black text-xs font-bold">
                        PP
                      </div>
                      <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                        COD
                      </div>
                    </div>
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