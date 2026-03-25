import React, { useState, useEffect } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import blackLogo from "../../images/Greycode_G_Logo_black.png";
import axios from 'axios';
import { User, LogOut, ShoppingCart, Settings, Shield, Heart } from "lucide-react";

const NavBar = ({ wishlistCount = 0 }) => {
    const { auth } = usePage().props;
    const { post } = useForm();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

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
    };

    const toggleAdminMenu = () => {
        setIsAdminMenuOpen(!isAdminMenuOpen);
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

    return (
        <>
            {/* Overlay when menu is open - prevents clicking background */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMenu}
                />
            )}

            <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow mx-auto w-full bg-white z-50 relative">
                {/* Logo - Left side */}
                <Link href="/">
                    <img
                        src={blackLogo}
                        alt="Greycode Black Logo"
                        className="w-auto h-12"
                    />
                </Link>

                {/* Desktop Navigation - Centered */}
                <div className="hidden md:flex items-center justify-center flex-1">
                    <div className="flex items-center gap-8">
                        <Link className="hover:text-greycode-light-blue hover:scale-105" href="/products">
                            Products
                        </Link>

                        {auth.user && (
                            <Link className="hover:text-greycode-light-blue hover:scale-105" href="/order">
                                Order History
                            </Link>
                        )}

                        <Link className="hover:text-greycode-light-blue hover:scale-105" href="/tracking">
                            Tracking
                        </Link>

                        <Link className="hover:text-greycode-light-blue hover:scale-105" href="/contact">
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
                            className="w-8 h-8"
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
                            className="w-8 h-8"
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

                {/* Mobile Navigation Menu - Full screen scrollable */}
                <div
                    className={`fixed top-0 left-0 w-full h-full bg-white/90 z-40 transition-transform duration-400 overflow-y-auto ${
                        isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } md:hidden`}
                    style={{ paddingTop: "80px" }}
                >
                    <div className="flex flex-col items-center gap-6 py-8 px-4">
                        <Link
                            className="text-lg hover:text-greycode-mid-blue"
                            href="/products"
                            onClick={closeMenu}
                        >
                            Products
                        </Link>

                        {auth.user && (
                            <Link
                                className="text-lg hover:text-greycode-mid-blue"
                                href="/order"
                                onClick={closeMenu}
                            >
                                Order History
                            </Link>
                        )}

                        <Link
                            className="text-lg hover:text-greycode-mid-blue"
                            href="/tracking"
                            onClick={closeMenu}
                        >
                            Tracking
                        </Link>

                        <Link
                            className="text-lg hover:text-greycode-mid-blue"
                            href="/contact"
                            onClick={closeMenu}
                        >
                            Contact Us
                        </Link>

                        {/* Admin Links for mobile */}
                        {isAdmin && (
                            <>
                                <div className="flex items-center gap-2 text-greycode-mid-blue font-medium">
                                    <Shield className="w-4 h-4" />
                                    <span>Admin Panel</span>
                                </div>
                                <Link
                                    className="text-lg hover:text-greycode-mid-blue pl-4"
                                    href="/admin/order"
                                    onClick={closeMenu}
                                >
                                    Manage Orders
                                </Link>
                            </>
                        )}

                        {/* Wishlist for mobile */}
                        <Link href="/wishlist" className="relative flex items-center gap-2" onClick={closeMenu}>
                            <Heart className="w-6 h-6" />
                            <span className="text-lg">Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart for mobile */}
                        <Link href="/cart" className="relative flex items-center gap-2" onClick={closeMenu}>
                            <ShoppingCart className="w-5 h-5" />
                            <span className="text-lg">Cart</span>
                            {auth.user && auth.cart_count > 0 && (
                                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {auth.cart_count}
                                </span>
                            )}
                        </Link>

                        {/* Auth section for mobile */}
                        {auth.user ? (
                            <>
                                <Link
                                    href="/user-profile"
                                    className="flex items-center gap-2 text-lg"
                                    onClick={closeMenu}
                                >
                                    <User className="w-4 h-4" />
                                    <span>Hi, {auth.user.first_name}</span>
                                    {isAdmin && (
                                        <span className="text-xs bg-greycode-light-blue text-white px-2 py-1 rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-800 text-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="bg-greycode-dark-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-greycode-mid-blue transition"
                                    onClick={closeMenu}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-greycode-light-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-greycode-mid-blue transition"
                                    onClick={closeMenu}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
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