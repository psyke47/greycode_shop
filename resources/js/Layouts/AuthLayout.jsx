import React from 'react';
import { Link } from '@inertiajs/react';
import blueLogo from "/public/images/Greycode-Blue-Logo.png";

export default function AuthLayout({ children }) {
    return (
        <div className=" bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <a href="https://www.greycode.co.za/" className="flex items-center">
                            <img
                                src={blueLogo}
                                alt="Greycode Blue Logo"
                                className="h-10 w-auto"
                            />
                        </a>

                        {/* Back to Home */}
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-indigo-600 transition"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
}