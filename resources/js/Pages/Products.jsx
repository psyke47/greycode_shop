import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

// Define the SVG data URL as a string
const placeholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U1RTVFNSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg=='

export default function Products() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [openSections, setOpenSections] = useState({
    categories: false,
    price: false,
    sort: false
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Sample products data
  const products = [
    { id: 1, name: 'Greycode IoT Dev Board', price: 900, category: 'DIY' },
    { id: 2, name: 'Arduino Starter Kit', price: 650, category: 'DIY' },
    { id: 3, name: 'Raspberry Pi 4', price: 1200, category: 'Components' },
    { id: 4, name: 'ESP32 Development Board', price: 450, category: 'Components' },
    { id: 5, name: 'Smart Light Bulb', price: 350, category: 'Home Automation' },
    { id: 6, name: 'Robotics Kit', price: 1850, category: 'DIY' },
    { id: 7, name: 'Temperature Sensor', price: 120, category: 'Components' },
    { id: 8, name: 'Smart Plug', price: 280, category: 'Home Automation' },
  ]

  return (
    <MainLayout>
      <Head title="Products" />
      <SecondaryNav />
      
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our range of development boards, IoT kits, and electronics components
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filters Toggle Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 flex items-center justify-between"
              >
                <span>{isFiltersOpen ? 'Hide Filters' : 'Show Filters'}</span>
                <svg 
                  className={`w-5 h-5 transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Left Sidebar - Filters */}
            <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block lg:w-1/4`}>
              <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button 
                    onClick={() => setIsFiltersOpen(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Categories Section - Accordion on mobile */}
                <div className="mb-8">
                  <button
                    onClick={() => toggleSection('categories')}
                    className="w-full flex justify-between items-center lg:cursor-default"
                  >
                    <h3 className="font-semibold text-gray-800">Categories</h3>
                    <svg 
                      className={`lg:hidden w-5 h-5 transform transition-transform ${openSections.categories ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`${openSections.categories || 'lg:block'} ${openSections.categories ? 'block' : 'hidden lg:block'}`}>
                    <div className="mt-4 space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="text-gray-700">DIY Kits</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="text-gray-700">Components</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="text-gray-700">Home Automation</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Price Range Section - Accordion on mobile */}
                <div className="mb-8">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex justify-between items-center lg:cursor-default"
                  >
                    <h3 className="font-semibold text-gray-800">Price Range</h3>
                    <svg 
                      className={`lg:hidden w-5 h-5 transform transition-transform ${openSections.price ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`${openSections.price || 'lg:block'} ${openSections.price ? 'block' : 'hidden lg:block'}`}>
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Min: R 0</span>
                          <span className="text-sm text-gray-600">Max: R 2000</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="2000" 
                          defaultValue="0"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="2000" 
                            defaultValue="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="2000" 
                            defaultValue="2000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sort By Section - Accordion on mobile */}
                <div className="mb-8">
                  <button
                    onClick={() => toggleSection('sort')}
                    className="w-full flex justify-between items-center lg:cursor-default"
                  >
                    <h3 className="font-semibold text-gray-800">Sort By</h3>
                    <svg 
                      className={`lg:hidden w-5 h-5 transform transition-transform ${openSections.sort ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`${openSections.sort || 'lg:block'} ${openSections.sort ? 'block' : 'hidden lg:block'}`}>
                    <select className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Name: A to Z</option>
                      <option>Name: Z to A</option>
                      <option>Newest First</option>
                    </select>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300">
                    Apply Filters
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300">
                    Clear All
                  </button>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{products.length}</span> products
                </p>
                <div className="text-sm text-gray-600">
                  Display: 
                  <button className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">Grid</button>
                  <button className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">List</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <a 
                    key={product.id}
                    href="#" 
                    className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-56 bg-gray-100 flex items-center justify-center">
                      <img 
                        src={placeholderSVG} 
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.category === 'DIY' ? 'bg-blue-100 text-blue-800' :
                          product.category === 'Components' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {product.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xl font-bold text-gray-900">R {product.price.toLocaleString()}</p>
                        <span className="text-blue-600 group-hover:text-blue-800 font-medium text-sm">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}