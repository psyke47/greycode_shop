import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import PageHead from '@/Components/PageHead';
import MainLayout from '@/Layouts/MainLayout';
import { Save, X } from 'lucide-react';

export default function ProductEdit({ product, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || '',
        category_id: product.category_id || '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    return (
        <MainLayout>
            <Head title="Edit Product" />
            <PageHead title="Edit Product" />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-gray-600 mt-1">Update product information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 sm:p-8 space-y-6">
                        {/* Name and Price Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (ZAR) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows="4"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Category and Stock */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock_quantity}
                                    onChange={e => setData('stock_quantity', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>}
                            </div>
                        </div>

                        {/* Active and Featured */}
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

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => router.get('/admin/products')}
                                className="px-6 py-3 border border-gray-300 rounded-lg bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}