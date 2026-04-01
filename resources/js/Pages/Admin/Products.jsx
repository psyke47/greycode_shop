import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PageHead from '@/Components/PageHead';
import AdminLayout from '@/Layouts/AdminLayout';
import { Pencil, Plus, Search, ArrowUpDown, ChevronUp, ChevronDown, Eye, EyeOff, Power, PowerOff } from 'lucide-react';

export default function Products({ products, categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [showInactive, setShowInactive] = useState(false);

    const handleToggleActive = (id, isActive, name) => {
        const action = isActive ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} "${name}"?`)) {
            router.put(`/admin/products/${id}/toggle-active`);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    const getProductImage = (product) => {
        if (product.product_images && product.product_images.length > 0) {
            const image = product.product_images[0];
            const filename = image.url.split('\\').pop().split('/').pop();
            return `/images/${filename}`;
        }
        return null;
    };

    // Sorting logic
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="w-3 h-3 ml-1 inline" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="w-3 h-3 ml-1 inline" />
            : <ChevronDown className="w-3 h-3 ml-1 inline" />;
    };

    // Filter based on active status and search
    const filteredProducts = products?.filter(product => {
        // If not showing inactive, only show active products
        if (!showInactive && !product.is_active) return false;
        // Search logic
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(term) ||
            product.description?.toLowerCase().includes(term) ||
            getCategoryName(product.category_id).toLowerCase().includes(term)
        );
    });

    // Sort products
    const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
        let aVal, bVal;

        switch (sortConfig.key) {
            case 'name':
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
                break;
            case 'category':
                aVal = getCategoryName(a.category_id).toLowerCase();
                bVal = getCategoryName(b.category_id).toLowerCase();
                break;
            case 'price':
                aVal = parseFloat(a.price);
                bVal = parseFloat(b.price);
                break;
            case 'stock':
                aVal = a.stock_quantity;
                bVal = b.stock_quantity;
                break;
            case 'status':
                aVal = a.is_active ? 1 : 0;
                bVal = b.is_active ? 1 : 0;
                break;
            default:
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const activeCount = products?.filter(p => p.is_active).length || 0;
    const inactiveCount = products?.filter(p => !p.is_active).length || 0;

    /* console.log('Products:', products);
console.log('Inactive products:', products?.filter(p => !p.is_active));
console.log('Inactive count:', products?.filter(p => !p.is_active).length); */

    return (
        <AdminLayout>
            <Head title="Manage Products" />
            <PageHead title="Manage Products" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Search and Toggle */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-greycode-dark-blue">Products</h1>
                            <p className="text-gray-600 mt-1">Manage your product inventory</p>
                            <div className="flex gap-3 mt-2">
                                <span className="text-sm text-green-600">Active: {activeCount}</span>
                                <span className="text-sm text-gray-500">Inactive: {inactiveCount}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 text-bold" />
                                <input
                                    type="search"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greycode-light-blue focus:border-transparent w-64"
                                />
                            </div>

                            {/* Show/Hide Inactive Button */}
                            <button
                                onClick={() => setShowInactive(!showInactive)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                                    showInactive 
                                        ? 'bg-yellow-50 border-yellow-300 text-yellow-700' 
                                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
                                {inactiveCount > 0 && !showInactive && (
                                    <span className="ml-1 bg-gray-400 text-white text-xs rounded-full px-1.5 py-0.5">
                                        {inactiveCount}
                                    </span>
                                )}
                            </button>

                            {/* Add Product Button */}
                            <Link
                                href="/admin/product"
                                className="bg-greycode-light-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-greycode-dark-blue transition"
                            >
                                <Plus className="w-5 h-5 text-bold" />
                                Add New Product
                            </Link>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {window.flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
                            {window.flash.success}
                        </div>
                    )}

                    {window.flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
                            {window.flash.error}
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-greycode-mid-blue sticky top-0 z-10">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-greycode-dark-blue transition"
                                            onClick={() => requestSort('name')}
                                        >
                                            Product {getSortIcon('name')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-greycode-dark-blue transition"
                                            onClick={() => requestSort('category')}
                                        >
                                            Category {getSortIcon('category')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-greycode-dark-blue transition"
                                            onClick={() => requestSort('price')}
                                        >
                                            Price {getSortIcon('price')}
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-greycode-dark-blue transition"
                                            onClick={() => requestSort('stock')}
                                        >
                                            Stock {getSortIcon('stock')}
                                        </th>
                                        {/* <th
                                            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-greycode-dark-blue transition"
                                            onClick={() => requestSort('status')}
                                        >
                                            Status {getSortIcon('status')}
                                        </th> */}
                                        <th className="px-6 py-3 text-right text-md font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedProducts?.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                {searchTerm ? 'No products matching your search.' : 'No products found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedProducts?.map((product) => {
                                            const productImage = getProductImage(product);
                                            const isActive = product.is_active;
                                            
                                            return (
                                                <tr
                                                    key={product.id}
                                                    className={`transition duration-200 ${!isActive ? 'bg-red-200 opacity-75' : 'hover:bg-gray-50'}`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex items-center gap-3">
                                                            {productImage && (
                                                                <img 
                                                                    src={productImage} 
                                                                    alt={product.name}
                                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                                />
                                                            )}
                                                            <span className={`font-medium ${!isActive ? 'text-gray-500' : 'text-gray-900'}`}>
                                                                {product.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {getCategoryName(product.category_id)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        R {parseFloat(product.price).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <span className={`font-medium ${product.stock_quantity <= 5 && product.stock_quantity > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                            {product.stock_quantity}
                                                        </span>
                                                        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                                                            <span className="ml-1 text-xs text-red-500">(Low stock)</span>
                                                        )}
                                                        {product.stock_quantity === 0 && (
                                                            <span className="ml-1 text-xs text-red-500">(Out of stock)</span>
                                                        )}
                                                    </td>
                                                   {/*  <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {!isActive && (
                                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                isActive 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-200 text-gray-600'
                                                            }`}>
                                                                {isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </td> */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            className="text-greycode-light-blue hover:text-greycode-dark-blue mr-4 inline-flex items-center gap-1 transition"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleToggleActive(product.id, isActive, product.name)}
                                                            className={`inline-flex items-center gap-1 transition ${
                                                                isActive 
                                                                    ? 'text-orange-600 hover:text-orange-800' 
                                                                    : 'text-green-600 hover:text-green-800'
                                                            }`}
                                                        >
                                                            {isActive ? (
                                                                <>
                                                                    <PowerOff className="w-4 h-4" />
                                                                    Deactivate
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Power className="w-4 h-4" />
                                                                    Activate
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Results Count and Quick Actions */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="text-sm text-gray-500">
                            Showing {sortedProducts.length} of {filteredProducts.length} products
                            {searchTerm && ` (filtered from ${products?.length || 0} total)`}
                            {!showInactive && inactiveCount > 0 && (
                                <button
                                    onClick={() => setShowInactive(true)}
                                    className="ml-3 text-blue-600 hover:underline text-sm"
                                >
                                    Show {inactiveCount} inactive {inactiveCount === 1 ? 'product' : 'products'}
                                </button>
                            )}
                            {showInactive && (
                                <span className="ml-3 text-gray-400 text-sm">
                                    Showing inactive products
                                </span>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-4 text-xs text-gray-500">
                            <span>Total: {products?.length || 0}</span>
                            <span className="text-green-600">Active: {activeCount}</span>
                            <span className="text-gray-500">Inactive: {inactiveCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}