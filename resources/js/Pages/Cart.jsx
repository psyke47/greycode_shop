import React, { useState, useEffect } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

const placeholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U1RTVFNSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5Qcm9kdWN0PC90ZXh0Pjwvc3ZnPg=='

export default function Cart({ cart: initialCart }) {
  const { props } = usePage()
  const cartData = props.cart || initialCart || {}
  
  // State for cart items from database
  const [cartItems, setCartItems] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load cart data from props
  useEffect(() => {
    if (cartData && cartData.cart_items) {
      setCartItems(cartData.cart_items)
      setIsLoading(false)
    }
  }, [cartData])

  // Get product image URL helper
  const getProductImage = (product) => {
    if (product.product_images && product.product_images.length > 0) {
      const image = product.product_images[0]
      const filename = image.url.split('\\').pop().split('/').pop()
      return `/images/${filename}`
    }
    return placeholderSVG
  }

  // Format price helper
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Update quantity in cart
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      // Update local state first for instant feedback
      setCartItems(items => 
        items.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )
      
      // Send API request to update in database
      const response = await fetch(`/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ quantity: newQuantity })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      // Optionally show error message to user
    }
  }

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      // Send API request to remove item
      const response = await fetch(`/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      })
      
      if (response.ok) {
        // Update local state
        setCartItems(items => items.filter(item => item.id !== itemId))
      } else {
        throw new Error('Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item. Please try again.')
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return
    
    try {
      const response = await fetch('/cart/clear', {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      })
      
      if (response.ok) {
        setCartItems([])
      } else {
        throw new Error('Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Failed to clear cart. Please try again.')
    }
  }

  // Calculate totals based on database data
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity)
  }, 0)

  const shipping = subtotal > 500 ? 0 : 99
  const tax = subtotal * 0.14 // 14% VAT for South Africa
  const discount = couponApplied ? subtotal * 0.1 : 0 // 10% discount if coupon applied
  const total = subtotal + shipping + tax - discount

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode.trim() === '') return
    if (couponCode.toUpperCase() === 'GREYCODE10') {
      setCouponApplied(true)
      alert('Coupon applied! 10% discount added.')
    } else {
      alert('Invalid coupon code. Try "GREYCODE10"')
    }
  }

  const continueShopping = () => {
    window.history.back()
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }
    
    // Check if any items are out of stock
    const outOfStockItems = cartItems.filter(item => {
      const stock = item.product?.stock_quantity || 0
      return stock === 0 || item.quantity > stock
    })
    
    if (outOfStockItems.length > 0) {
      alert('Please remove out-of-stock items before checkout')
      return
    }
    
    // Redirect to checkout
    window.location.href = '/checkout'
  }

  // Check if item is in stock
  const isInStock = (item) => {
    const stock = item.product?.stock_quantity || 0
    return stock > 0 && item.quantity <= stock
  }

  // Get stock count
  const getStockCount = (item) => {
    return item.product?.stock_quantity || 0
  }

  // Get category name
  const getCategoryName = (item) => {
    return item.product?.category?.name || 'Uncategorized'
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Head title="Loading Cart..." />
        <SecondaryNav />
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </MainLayout>
    )
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
                    {cartItems.map((item) => {
                      const product = item.product || {}
                      const inStock = isInStock(item)
                      const stockCount = getStockCount(item)
                      const categoryName = getCategoryName(item)
                      
                      return (
                        <div key={item.id} className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                <img 
                                  src={getProductImage(product)} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = placeholderSVG
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
                                        <Link href={`/products/${product.id}`} className="hover:text-blue-600">
                                          {product.name}
                                        </Link>
                                      </h3>
                                      <p className="text-gray-600 text-sm mb-2">{product.description?.substring(0, 100)}...</p>
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                        categoryName === 'DIY' ? 'bg-blue-100 text-blue-800' :
                                        categoryName === 'Smart Homes' ? 'bg-purple-100 text-purple-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {categoryName}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Stock Status */}
                                  <div className="mt-4">
                                    {inStock ? (
                                      <p className="text-green-600 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {stockCount > 5 ? 'In Stock' : `Only ${stockCount} left`}
                                      </p>
                                    ) : (
                                      <p className="text-red-600 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        {stockCount === 0 ? 'Out of Stock' : `Only ${stockCount} available`}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Price and Quantity */}
                                <div className="flex flex-col items-end space-y-4">
                                  <p className="text-2xl font-bold text-gray-900">
                                    R {formatPrice(item.price * item.quantity)}
                                  </p>
                                  
                                  <div className="flex items-center space-x-4">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={item.quantity <= 1}
                                      >
                                        −
                                      </button>
                                      <span className="px-4 py-1 text-lg font-medium min-w-[3rem] text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!inStock}
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
                                    R {formatPrice(item.price)} each
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link 
                    href="/products"
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </Link>
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
                      <span className="font-medium">R {formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'FREE' : `R ${formatPrice(shipping)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT (14%)</span>
                      <span className="font-medium">R {formatPrice(tax)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount (10%)</span>
                        <span className="font-medium text-green-600">
                          -R {formatPrice(discount)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>R {formatPrice(total)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">All prices in ZAR (South African Rand)</p>
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
                        : `Add R ${formatPrice(500 - subtotal)} more for free shipping`
                      }
                    </p>
                  </div>
                  
                  {/* Checkout Button */}
                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors duration-300 mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={cartItems.length === 0 || cartItems.some(item => !isInStock(item))}
                  >
                    Proceed to Checkout
                  </button>
                  
                  {cartItems.some(item => !isInStock(item)) && (
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