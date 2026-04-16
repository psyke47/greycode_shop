import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import PageHead from '@/Components/PageHead';
import AdminLayout from '@/Layouts/AdminLayout';
import { Upload } from 'lucide-react';

export default function Product({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '',
        is_active: true,
        is_featured: false,
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/products', {
            forceFormData: true, // Required for file upload
        });
    };

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    return (
        <AdminLayout>
            <Head title="Upload Product" />
            <PageHead title="Upload Product" />

            <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h3 className="text-4xl font-bold text-greycode-dark-blue">Upload New Product</h3>
                        <p className="text-gray-600 mt-2">Add a new product to your inventory</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
                        {/* Name and Price Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-md font-semibold text-gray-700 mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-md font-semibold text-gray-700 mb-2">Price (ZAR) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue"
                                    required
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            </div>
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                            <input
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                onChange={e => setData('stock_quantity', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue"
                                required
                            />
                            {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-md font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                rows="4"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue resize-none"
                            />
                        </div>

                        {/* Category and Image Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-md font-semibold text-gray-700 mb-2">Category *</label>
                                <select
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-greycode-light-blue"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                            </div>
                            <div>
                                <label className="block text-md font-semibold text-gray-700 mb-2">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-lg file:border-0 file:p-2 file:mr-2 file:bg-greycode-light-blue file:text-white file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-greycode-light-blue"
                                />
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Active and Featured Checkboxes */}
                        <div className="flex gap-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="mr-2"
                                />
                                Active (visible in store)
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={e => setData('is_featured', e.target.checked)}
                                    className="mr-2"
                                />
                                Featured (show on homepage)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-greycode-light-blue text-white font-semibold py-3 px-8 rounded-lg hover:bg-greycode-dark-blue hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                            >
                                <Upload size={20} />
                                {processing ? 'Adding...' : 'Add New Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}