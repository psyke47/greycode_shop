import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

// SVG placeholder component
const PlaceholderImage = ({ className = "w-full h-full" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="#f3f4f6" />
    <text 
      x="150" 
      y="150" 
      fontFamily="Arial" 
      fontSize="16" 
      textAnchor="middle" 
      fill="#9ca3af"
      dy=".3em"
    >
      Product Image
    </text>
  </svg>
)

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Mock product data
  const product = {
    id: 1,
    name: 'Greycode IoT Development Board',
    category: 'DIY',
    price: 900,
    oldPrice: 1100,
    rating: 4.7,
    reviewCount: 128,
    description: 'A powerful IoT development board designed for prototyping and production IoT applications. Features built-in WiFi, Bluetooth, and multiple GPIO pins for connecting sensors and actuators.',
    features: [
      'Dual-core 32-bit LX6 microprocessor',
      'Built-in WiFi 802.11 b/g/n',
      'Bluetooth 4.2 with BLE',
      '40+ GPIO pins',
      '16 MB Flash memory',
      '8 MB PSRAM',
      'USB-C programming interface',
      'Low power consumption modes'
    ],
    specifications: {
      'Processor': 'ESP32-S3 Dual-core',
      'Clock Speed': '240 MHz',
      'Flash Memory': '16 MB',
      'RAM': '8 MB PSRAM',
      'Wireless': 'WiFi 802.11 b/g/n, Bluetooth 4.2',
      'GPIO Pins': '42',
      'ADC': '18 channels, 12-bit',
      'DAC': '2 channels, 8-bit',
      'USB': 'USB-C for programming and power',
      'Operating Voltage': '3.3V',
      'Dimensions': '65mm x 45mm'
    },
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1624124544403-6c7a1d5950a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800',
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800'
    ],
    inStock: true,
    stockCount: 42,
    sku: 'GC-IOT-001',
    tags: ['IoT', 'ESP32', 'Development', 'Microcontroller', 'Wireless'],
    reviews: [
      {
        id: 1,
        name: 'Alex Johnson',
        rating: 5,
        date: '2024-01-15',
        comment: 'Excellent board for IoT projects. Very stable WiFi connection and plenty of GPIO pins.',
        verified: true
      },
      {
        id: 2,
        name: 'Sam Wilson',
        rating: 4,
        date: '2024-01-10',
        comment: 'Great value for money. Documentation could be better, but overall very satisfied.',
        verified: true
      },
      {
        id: 3,
        name: 'Taylor Smith',
        rating: 5,
        date: '2024-01-05',
        comment: 'Perfect for my home automation projects. Easy to program with Arduino IDE.',
        verified: false
      }
    ],
    relatedProducts: [
      { id: 2, name: 'Arduino Starter Kit', price: 650, category: 'DIY' },
      { id: 3, name: 'Raspberry Pi 4', price: 1200, category: 'Components' },
      { id: 4, name: 'ESP32 Development Board', price: 450, category: 'Components' },
      { id: 5, name: 'Sensor Pack', price: 350, category: 'Components' }
    ]
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  const addToCart = () => {
    alert(`Added ${quantity} × ${product.name} to cart!`)
    // In a real app, this would dispatch to a cart store
  }

  const buyNow = () => {
    alert(`Proceeding to checkout with ${quantity} × ${product.name}`)
    // In a real app, this would redirect to checkout
  }

  return (
    <MainLayout>
      <Head title={product.name} />
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
                <Link href="/products" className="hover:text-blue-600 transition-colors duration-300">
                  Products
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors duration-300">
                  {product.category}
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Images */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                <div className="relative h-96 mb-4">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg"><PlaceholderImage className="w-48 h-48" /></div>'
                    }}
                  />
                  {product.oldPrice && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save R {(product.oldPrice - product.price).toLocaleString()}
                    </span>
                  )}
                </div>
                
                {/* Thumbnail Images */}
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                        selectedImage === index 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentNode.innerHTML = '<div class="w-full h-full bg-gray-100 flex items-center justify-center"><PlaceholderImage className="w-10 h-10" /></div>'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:w-1/2">
              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600 font-medium">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="text-4xl font-bold text-gray-900">
                      R {product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className="ml-4 text-xl text-gray-500 line-through">
                        R {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">VAT included</p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">In Stock</span>
                      <span className="ml-2 text-gray-600">({product.stockCount} available)</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Out of Stock</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantity and Actions */}
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={decrementQuantity}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-3 text-lg font-medium">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-gray-600">
                      Total: <span className="text-2xl font-bold text-gray-900">R {(product.price * quantity).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={addToCart}
                      className="flex-1 min-w-[200px] bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                    <button
                      onClick={buyNow}
                      className="flex-1 min-w-[200px] bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-lg">
                  Specifications
                </button>
                <button className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium text-lg">
                  Reviews ({product.reviewCount})
                </button>
                <button className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium text-lg">
                  Shipping & Returns
                </button>
              </nav>
            </div>

            {/* Specifications Table */}
            <div className="py-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700 w-1/3">
                          {key}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reviews */}
            <div className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Customer Reviews ({product.reviewCount})
              </h3>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          {review.verified && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Products */}
            <div className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {product.relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/products/${related.id}`}
                    className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                      <PlaceholderImage className="w-32 h-32" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          related.category === 'DIY' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {related.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-2">
                        {related.name}
                      </h4>
                      <p className="text-lg font-bold text-gray-900">R {related.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}