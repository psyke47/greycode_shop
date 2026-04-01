import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Package, Bell } from 'lucide-react';
import NotificationBell from '@/Components/NotificationBell';
import Footer from '@/Components/Footer';

export default function AdminLayout({ children }) {
    const { url } = usePage();
    
    const isActive = (path) => {
        return url.startsWith(path) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex space-x-8">
                            <Link
                                href="/admin/products"
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/admin/products')}`}
                            >
                                <Package className="w-4 h-4 mr-2" />
                                Products
                            </Link>
                            <Link
                                href="/admin/order"
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive('/admin/order')}`}
                            >
                                <LayoutGrid className="w-4 h-4 mr-2" />
                                Orders
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <NotificationBell />
                            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                                Back to Store
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* Main Content */}
            <main>{children}</main>
            <Footer />
        </div>
    );
}