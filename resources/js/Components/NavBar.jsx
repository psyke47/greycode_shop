import React, { useState, useEffect } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import blackLogo from '../../images/Greycode_G_Logo_black.png';
import { User, LogOut, ShoppingCart, Settings, Shield } from 'lucide-react';

const NavBar = () => {
    const { auth } = usePage().props;
    const { post } = useForm();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleAdminMenu = () => {
        setIsAdminMenuOpen(!isAdminMenuOpen);
    };

    const handleLogout = () => {
        post('/logout');
        closeMenu();
    };

    const [cartCount, setCartCount] = useState(auth?.cart_count || 0);

    useEffect(() => {
        // Update cart count when auth changes
        setCartCount(auth?.cart_count || 0);
    }, [auth]);

    // Check if user is admin
    const isAdmin = auth?.user?.is_admin;

    return (
        <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow mx-auto w-full bg-white z-11">
            <Link href="/">
                <img 
                    src={blackLogo}
                    alt="Greycode Black Logo"
                    className="w-auto h-12" 
                />
            </Link>

            <nav
                id="menu"
                className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center md:justify-end max-md:h-full bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal transition-all duration-300  max-md:z-50 ${
                    isMenuOpen ? 'max-md:w-full' : 'max-md:w-0'
                }`}
            >
                <Link 
                    className="hover:text-indigo-600" 
                    href="/products"
                    onClick={closeMenu}
                >
                    Products
                </Link>
                
                {auth.user && (
                    <Link 
                        className="hover:text-indigo-600" 
                        href="/order"
                        onClick={closeMenu}
                    >
                        Order History
                    </Link>
                )}
                
                <Link 
                    className="hover:text-indigo-600" 
                    href="/tracking"
                    onClick={closeMenu}
                >
                    Tracking
                </Link>
                
                <Link 
                    className="hover:text-indigo-600" 
                    href="/contact"
                    onClick={closeMenu}
                >
                    Contact Us
                </Link>
                
                {/* Admin Links for mobile */}
                {isAdmin && (
                    <div className="md:hidden flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-indigo-700 font-medium">
                            <Shield className="w-4 h-4" />
                            <span>Admin Panel</span>
                        </div>
                        <Link 
                            className="hover:text-indigo-600 pl-4" 
                            href="/admin/order"
                            onClick={closeMenu}
                        >
                            Manage Orders
                        </Link>
                    </div>
                )}
                
                {/* Auth section for mobile */}
                <div className="md:hidden flex flex-col items-center gap-4 mt-4">
                    {auth.user ? (
                        <>
                            <Link 
                                    href="/user-profile"
                                    className="md:flex items-center gap-4 text-inherit no-underline"
                                    onClick={closeMenu}
                                    >
                                <div className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition">
                                    <User className="w-4 h-4" />
                                    <span>Hi, {auth.user.first_name}</span>
                                    {isAdmin && (
                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-600 hover:text-red-800"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                href="/login" 
                                className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                onClick={closeMenu}
                            >
                                Log in
                            </Link>
                            <Link 
                                href="/signup" 
                                className="bg-greycode-light-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                onClick={closeMenu}
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={closeMenu}
                    className="md:hidden text-gray-600"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </nav>

            <div className="flex items-center space-x-4">
                {/* Cart Icon */}
                <Link 
                    href="/cart" 
                    className="relative text-gray-600 hover:text-gray-900"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {auth.user && auth.cart_count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {auth.cart_count}
                        </span>
                    )}
                </Link>

                {/* Admin Menu for desktop */}
                {isAdmin && (
                    <div className="hidden md:block relative">
                        <button
                            onClick={toggleAdminMenu}
                            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 text-sm"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Admin</span>
                            <svg 
                                className={`w-4 h-4 transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {isAdminMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="py-2">
                                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                                        Admin Panel
                                    </div>
                                    <Link
                                        href="/admin/order"
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                        onClick={() => setIsAdminMenuOpen(false)}
                                    >
                                        Manage Orders
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Auth section for desktop */}
                {auth.user ? (
                    <div className="hidden md:flex items-center gap-4">
                        <Link 
                            href="/user-profile"
                            className="hidden md:flex items-center gap-4 text-inherit no-underline"
                            onClick={closeMenu}
                        
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition">
                                <User className="w-4 h-4" />
                                <span>Hi, {auth.user.first_name}</span>
                                {isAdmin && (
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                        Admin
                                    </span>
                                )}
                            </div>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link 
                            className="hidden md:flex bg-greycode-light-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition" 
                            href="/signup"
                        >
                            Sign up
                        </Link>

                        <Link 
                            className="hidden md:flex bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition" 
                            href="/login"
                        >
                            Log in
                        </Link>
                    </>
                )}

                {/* Mobile menu button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-gray-600"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Close admin dropdown when clicking outside */}
            {isAdminMenuOpen && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsAdminMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default NavBar;