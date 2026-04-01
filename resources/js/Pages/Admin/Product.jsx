import React from 'react'
import { Head } from '@inertiajs/react'
import PageHead from '@/Components/PageHead'
import AdminLayout from '@/Layouts/AdminLayout'
import { Upload } from 'lucide-react'

export default function Product() {
const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: ''
})

const handleChange = (e) => {
    const { id, value, type, files } = e.target
    setFormData(prev => ({
        ...prev,
        [id]: type === 'file' ? files[0] : value
    }))
}

const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
}

return (
    <div>
        <AdminLayout>
            <PageHead title="Upload Product" />
            <div className='min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-4xl mx-auto'>
                    <div className='mb-8'>
                        <h3 className='text-4xl font-bold text-greycode-dark-blue'>Upload New Product</h3>
                        <p className='text-gray-600 mt-2'>Add a new product to your inventory</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6'>
                        {/* Name and Price Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='relative'>
                                <label htmlFor="name" className='block text-md font-semibold text-gray-700 mb-2 peer-focus:text-greycode-light-blue peer-focus:scale-105 transition transform'>
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue focus:border-transparent transition peer'
                                    placeholder='Enter product name'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="price" className='block text-md font-semibold text-gray-700 mb-2'>
                                    Price (ZAR)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue focus:border-transparent transition'
                                    placeholder='0.00'
                                    step="0.99"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className='block text-md font-semibold text-gray-700 mb-2'>
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue focus:border-transparent transition resize-none'
                                placeholder='Enter product description'
                                required
                            />
                        </div>

                        {/* Category and Image Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div>
                                <label htmlFor="category" className='block text-md font-semibold text-gray-700 mb-2'>
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue focus:border-transparent transition'
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="DiY">DiY</option>
                                    <option value="Components">Components</option>
                                    <option value="Smart Homes">Smart Homes</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="image" className='block text-md font-semibold text-gray-700 mb-2'>
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className='w-full border border-gray-300 rounded-lg file:border-0 file:p-2 file:mr-2 file:bg-greycode-light-blue file:text-white file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-greycode-light-blue focus:border-transparent transition'
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='pt-4'>
                            <button
                                type="submit"
                                className='w-full sm:w-auto flex items-center justify-center gap-2 bg-greycode-light-blue text-white font-semibold py-3 px-8 rounded-lg hover:bg-greycode-dark-blue hover:shadow-lg transform hover:scale-105 transition-all duration-300'
                            >
                                <Upload size={20} />
                                Add New Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    </div>
)
}
