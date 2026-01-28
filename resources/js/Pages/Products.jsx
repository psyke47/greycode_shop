import React, { useState, useEffect } from 'react'
import { Head, usePage } from '@inertiajs/react'
import MainLayout from '../Layouts/MainLayout'
import SecondaryNav from '../Components/SecondaryNav'

// Define the SVG data URL as a string
const placeholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U1RTVFNSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg=='

export default function Products({ products: initialProducts, categories: initialCategories }) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [openSections, setOpenSections] = useState({
    categories: false,
    price: false,
    sort: false
  })

  // State for temporary filters (what user selects)
  const [tempFilters, setTempFilters] = useState({
    categories: [],
    minPrice: 0,
    maxPrice: 2000,
    sortBy: 'name_asc'
  })

  // State for applied filters (active filters)
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    minPrice: 0,
    maxPrice: 2000,
    sortBy: 'name_asc'
  })

  const [filteredProducts, setFilteredProducts] = useState(initialProducts || [])

  const { props } = usePage()
  const products = props.products || initialProducts || []
  const categories = props.categories || initialCategories || []

  // Initialize temp filters with all categories
  useEffect(() => {
    if (categories.length > 0) {
      setTempFilters(prev => ({
        ...prev,
        categories: categories.map(cat => cat.id)
      }))
      setAppliedFilters(prev => ({
        ...prev,
        categories: categories.map(cat => cat.id)
      }))
    }
  }, [categories])

  // Apply filters whenever appliedFilters change (ONLY after clicking Apply)
  useEffect(() => {
    if (products.length > 0) {
      let result = [...products]

      // Filter by category
      if (appliedFilters.categories.length > 0) {
        result = result.filter(product => 
          appliedFilters.categories.includes(product.category_id)
        )
      }

      // Filter by price
      result = result.filter(product => 
        parseFloat(product.price) >= appliedFilters.minPrice && 
        parseFloat(product.price) <= appliedFilters.maxPrice
      )

      // Sort products
      result.sort((a, b) => {
        switch (appliedFilters.sortBy) {
          case 'price_asc':
            return parseFloat(a.price) - parseFloat(b.price)
          case 'price_desc':
            return parseFloat(b.price) - parseFloat(a.price)
          case 'name_asc':
            return a.name.localeCompare(b.name)
          case 'name_desc':
            return b.name.localeCompare(a.name)
          default:
            return 0
        }
      })

      setFilteredProducts(result)
    }
  }, [appliedFilters, products])

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (categoryId) => {
    setTempFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
      
      return { ...prev, categories: newCategories }
    })
  }

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    setTempFilters(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  const handleSortChange = (e) => {
    setTempFilters(prev => ({
      ...prev,
      sortBy: e.target.value
    }))
  }

  const handleApplyFilters = () => {
    // Apply the temp filters
    setAppliedFilters(tempFilters)
    setIsFiltersOpen(false)
  }

  const handleClearFilters = () => {
    const defaultFilters = {
      categories: categories.map(cat => cat.id),
      minPrice: 0,
      maxPrice: 2000,
      sortBy: 'name_asc'
    }
    
    // Reset both temp and applied filters
    setTempFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  // Check if filters have been changed
  const hasFilterChanges = () => {
    return (
      JSON.stringify(tempFilters.categories.sort()) !== JSON.stringify(appliedFilters.categories.sort()) ||
      tempFilters.minPrice !== appliedFilters.minPrice ||
      tempFilters.maxPrice !== appliedFilters.maxPrice ||
      tempFilters.sortBy !== appliedFilters.sortBy
    )
  }

  // Get product image URL
  const getProductImage = (product) => {
    if (product.product_images && product.product_images.length > 0) {
      const image = product.product_images[0];
      const filename = image.url;
      
      // Ensure it's a clean filename
      const cleanFilename = filename.split('\\').pop().split('/').pop();
      
      // Return web-accessible path
      return `/images/${cleanFilename}`;
    }
    
    return placeholderSVG;
  }

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Uncategorized'
  }

  // Get count of active filters
  const getActiveFilterCount = () => {
    let count = 0
    
    // Category filters (excluding "all selected")
    const allCategories = categories.map(cat => cat.id)
    const allCategoriesSelected = JSON.stringify(appliedFilters.categories.sort()) === JSON.stringify(allCategories.sort())
    if (!allCategoriesSelected && appliedFilters.categories.length > 0) {
      count++
    }
    
    // Price filters (if not default)
    if (appliedFilters.minPrice > 0 || appliedFilters.maxPrice < 2000) {
      count++
    }
    
    // Sort filter (if not default)
    if (appliedFilters.sortBy !== 'name_asc') {
      count++
    }
    
    return count
  }

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
                <span>Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}</span>
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
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    {getActiveFilterCount() > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
                      </p>
                    )}
                  </div>
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
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={tempFilters.categories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{category.name}</span>
                        </label>
                      ))}
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
                          <span className="text-sm text-gray-600">Min: R {tempFilters.minPrice}</span>
                          <span className="text-sm text-gray-600">Max: R {tempFilters.maxPrice}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="2000" 
                          value={tempFilters.maxPrice}
                          onChange={(e) => setTempFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                          <input 
                            type="number" 
                            name="minPrice"
                            value={tempFilters.minPrice}
                            onChange={handlePriceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                          <input 
                            type="number" 
                            name="maxPrice"
                            value={tempFilters.maxPrice}
                            onChange={handlePriceChange}
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
                    <select 
                      value={tempFilters.sortBy}
                      onChange={handleSortChange}
                      className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="name_asc">Name: A to Z</option>
                      <option value="name_desc">Name: Z to A</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={handleApplyFilters}
                    disabled={!hasFilterChanges()}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
                      hasFilterChanges() 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {hasFilterChanges() ? 'Apply Filters' : 'Filters Applied'}
                  </button>
                  <button 
                    onClick={handleClearFilters}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
                  </p>
                  {getActiveFilterCount() > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">Active filters:</span>
                      <div className="flex flex-wrap gap-2">
                        {appliedFilters.categories.length < categories.length && appliedFilters.categories.length > 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {appliedFilters.categories.length} categor{appliedFilters.categories.length === 1 ? 'y' : 'ies'}
                          </span>
                        )}
                        {(appliedFilters.minPrice > 0 || appliedFilters.maxPrice < 2000) && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            R{appliedFilters.minPrice} - R{appliedFilters.maxPrice}
                          </span>
                        )}
                        {appliedFilters.sortBy !== 'name_asc' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {appliedFilters.sortBy === 'price_asc' ? 'Price: Low to High' :
                             appliedFilters.sortBy === 'price_desc' ? 'Price: High to Low' :
                             appliedFilters.sortBy === 'name_desc' ? 'Name: Z to A' : 'Sorted'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Display: 
                  <button className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">Grid</button>
                 {/*  <button className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">List</button> */}
                </div>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                  <button 
                    onClick={handleClearFilters}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const imageUrl = getProductImage(product);
                    
                    return (
                      <a 
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                      >
                        <div className="relative h-56 flex items-center justify-center">
                          <img 
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                              console.error(`Failed to load image: ${imageUrl}`);
                              e.target.src = placeholderSVG;
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              product.category_id === categories.find(c => c.name === 'DIY')?.id ? 'bg-blue-100 text-blue-800' :
                              product.category_id === categories.find(c => c.name === 'Smart Homes')?.id ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {getCategoryName(product.category_id)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <p className="text-xl font-bold text-gray-900">R {parseFloat(product.price).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
                            <span className="text-blue-600 group-hover:text-blue-800 font-medium text-sm">
                              View Details →
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}