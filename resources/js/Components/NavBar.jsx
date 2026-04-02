import React, { useState, useEffect } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import blueLogo from "/public/images/Greycode-Blue-Logo.png";
import { User, LogOut, ShoppingCart, Settings, Shield, Heart } from "lucide-react";
import NotificationBell from "../Components/NotificationBell";

const NavBar = ({ wishlistCount = 0 }) => {
    const { url } = usePage(); // ✅ url is at the root level
    const { auth } = usePage().props;
    const { post } = useForm();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isMobileAdminOpen, setIsMobileAdminOpen] = useState(false);

    const isAdmin = auth?.user?.is_admin;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
        setIsMobileAdminOpen(false);
    };

    const toggleAdminMenu = () => {
        setIsAdminMenuOpen(!isAdminMenuOpen);
    };

    const toggleMobileAdmin = () => {
        setIsMobileAdminOpen(!isMobileAdminOpen);
    };

    const handleLogout = () => {
        post("/logout");
        closeMenu();
    };

    const [cartCount, setCartCount] = useState(auth?.cart_count || 0);

    useEffect(() => {
        setCartCount(auth?.cart_count || 0);
    }, [auth]);

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Determine if a link is active
    const isActive = (path) => {
        const currentUrl = url || '';
        if (path === '/') return currentUrl === '/';
        return currentUrl === path || currentUrl.startsWith(path + '/');
    };

    return (
        <>
            {/* Overlay when menu is open */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMenu}
                />
            )}

            <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow mx-auto w-full bg-white z-50 relative">
                {/* Logo - Left side */}
                <a href="https://www.greycode.co.za" target="_blank" rel="noopener noreferrer">
                    <img
                        src={blueLogo}
                        alt="Greycode Blue Logo"
                        className="w-auto h-12"
                    />
                </a>

                {/* Desktop Navigation - Centered */}
                <div className="hidden md:flex items-center justify-center flex-1">
                    <div className="flex items-center gap-8">
                        <Link className={`hover:text-indigo-600 ${isActive('/') ? 'text-indigo-600 font-medium' : ''}`} href="/">
                            Home
                        </Link>
                        <Link className={`hover:text-indigo-600 ${isActive('/products') ? 'text-indigo-600 font-medium' : ''}`} href="/products">
                            Products
                        </Link>

                        {auth.user && (
                            <Link className={`hover:text-indigo-600 ${isActive('/order') ? 'text-indigo-600 font-medium' : ''}`} href="/order">
                                Order History
                            </Link>
                        )}

                        <Link className={`hover:text-indigo-600 ${isActive('/tracking') ? 'text-indigo-600 font-medium' : ''}`} href="/tracking">
                            Tracking
                        </Link>

                        <Link className={`hover:text-indigo-600 ${isActive('/contact') ? 'text-indigo-600 font-medium' : ''}`} href="/contact">
                            Contact Us
                        </Link>
                    </div>
                </div>

                {/* Right side icons */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* Wishlist Icon */}
                    <Link href="/wishlist" className="relative">
                        <Heart className="w-6 h-6" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart Icon */}
                    <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
                        <ShoppingCart className="w-5 h-5" />
                        {auth.user && auth.cart_count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {auth.cart_count}
                            </span>
                        )}
                    </Link>

                    {/* Notification Bell for Admin */}
                    {isAdmin && (
                        <div className="relative">
                            <NotificationBell />
                        </div>
                    )}

                    {/* Admin Menu for desktop */}
                    {isAdmin && (
                        <div className="relative">
                            <button
                                onClick={toggleAdminMenu}
                                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 text-sm"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Admin</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isAdminMenuOpen ? "rotate-180" : ""}`}
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
                                        <Link
                                            href="/admin/products"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                            onClick={() => setIsAdminMenuOpen(false)}
                                        >
                                            Manage Products
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Auth section for desktop */}
                    {auth.user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/user-profile" className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition">
                                <User className="w-4 h-4" />
                                <span>Hi, {auth.user.first_name}</span>
                                {isAdmin && (
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                        Admin
                                    </span>
                                )}
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
                            <Link className="bg-greycode-light-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition" href="/signup">
                                Sign up
                            </Link>
                            <Link className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition" href="/login">
                                Log in
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-greycode-light-blue z-50 relative"
                >
                    {isMenuOpen ? (
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
                    ) : (
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
                    )}
                </button>

                {/* Mobile Navigation Menu - Redesigned */}
                <div
                    className={`fixed top-0 left-0 w-full h-full bg-white z-40 transition-transform duration-300 overflow-y-auto ${
                        isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } md:hidden`}
                >
                    {/* Header with Logo and Close Button */}
                    <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200">
                        <a href="https://www.greycode.co.za" target="_blank" rel="noopener noreferrer">
                            <img src={blueLogo} alt="Greycode Blue Logo" className="h-10 w-auto" />
                        </a>
                        <button onClick={closeMenu} className="text-gray-600 p-2">
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
                    </div>

                    {/* Navigation Links with Dividers */}
                    <div className="flex flex-col divide-y divide-gray-200">
                        <Link
                            className={`text-lg py-4 px-6 ${isActive('/') ? 'bg-greycode-light-blue text-white font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                            href="/"
                            onClick={closeMenu}
                        >
                            Home
                        </Link>
                        <Link
                            className={`text-lg py-4 px-6 ${isActive('/products') ? 'bg-greycode-light-blue text-white font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                            href="/products"
                            onClick={closeMenu}
                        >
                            Products
                        </Link>

                        {auth.user && (
                            <Link
                                className={`text-lg py-4 px-6 ${isActive('/order') ? 'bg-greycode-light-blue text-white font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                                href="/order"
                                onClick={closeMenu}
                            >
                                Order History
                            </Link>
                        )}

                        <Link
                            className={`text-lg py-4 px-6 ${isActive('/tracking') ? 'bg-greycode-light-blue text-white font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                            href="/tracking"
                            onClick={closeMenu}
                        >
                            Tracking
                        </Link>

                        <Link
                            className={`text-lg py-4 px-6 ${isActive('/contact') ? 'bg-greycode-light-blue text-white font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                            href="/contact"
                            onClick={closeMenu}
                        >
                            Contact Us
                        </Link>

                        {/* Admin Panel Dropdown (Mobile) */}
                        {isAdmin && (
                            <div className="py-2 px-6">
                                <button
                                    onClick={toggleMobileAdmin}
                                    className="w-full flex items-center justify-between text-lg text-indigo-700 font-medium hover:text-indigo-800 py-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        <span>Admin Panel</span>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-200 ${isMobileAdminOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isMobileAdminOpen && (
                                    <div className="mt-2 space-y-2 pl-6">
                                        <Link
                                            className={`block text-md py-2 ${isActive('/admin/order') ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                                            href="/admin/order"
                                            onClick={closeMenu}
                                        >
                                            Manage Orders
                                        </Link>
                                        <Link
                                            className={`block text-md py-2 ${isActive('/admin/products') ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                                            href="/admin/products"
                                            onClick={closeMenu}
                                        >
                                            Manage Products
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Wishlist & Cart */}
                        <div className="flex gap-6 py-4 px-6">
                            <Link href="/wishlist" className={`flex items-center gap-2 text-lg ${isActive('/wishlist') ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600'}`} onClick={closeMenu}>
                                <Heart className="w-5 h-5" />
                                <span>Wishlist</span>
                                {wishlistCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <Link href="/cart" className={`flex items-center gap-2 text-lg ${isActive('/cart') ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600'}`} onClick={closeMenu}>
                                <ShoppingCart className="w-5 h-5" />
                                <span>Cart</span>
                                {auth.user && auth.cart_count > 0 && (
                                    <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {auth.cart_count}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Auth Section */}
                        <div className="py-4 px-6">
                            {auth.user ? (
                                <div className="space-y-3">
                                    <Link
                                        href="/user-profile"
                                        className={`flex items-center gap-2 text-lg ${isActive('/user-profile') ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                                        onClick={closeMenu}
                                    >
                                        <User className="w-5 h-5" />
                                        <span>Hi, {auth.user.first_name}</span>
                                        {isAdmin && (
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-lg text-red-600 hover:text-red-800"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link
                                        href="/login"
                                        className={`block text-lg ${isActive('/login') ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                                        onClick={closeMenu}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className={`block text-lg ${isActive('/signup') ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600'}`}
                                        onClick={closeMenu}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>

                        

                        {/* Footer */}
                        {/* <div className="mt-auto pt-4 pb-8 px-6 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                © {new Date().getFullYear()} Greycode Electronics
                            </div>
                        </div> */}
                    </div>
                </div>
            </header>

            {/* Close admin dropdown when clicking outside */}
            {isAdminMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsAdminMenuOpen(false)}
                />
            )}
        </>
    );
};

export default NavBar;