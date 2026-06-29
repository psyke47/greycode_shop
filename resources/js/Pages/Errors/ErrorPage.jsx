import React from 'react';
import { Link } from '@inertiajs/react';

const errorData = {
    403: {
        title: 'Access Denied',
        message: 'Sorry, but you do not have permission to access this page.',
    },
    404: {
        title: 'Page Not Found',
        message: 'We are sorry. But the page you requested was not found',
    },
    500: {
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.',
    },
    503: {
        title: 'Service Unavailable',
        message: 'We are currently performing maintenance. Please check back soon.',
    },
};

export default function ErrorPage({ status = 404 }) {
    const info = errorData[status] || errorData[404];

    return (
        <div className="relative h-screen w-full bg-greycode-light-blue overflow-hidden">
            {/* Full-screen background */}
            <div className="absolute inset-0 bg-greycode-light-blue" />

            {/* Centered content */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="text-center max-w-3xl w-full">
                    {/* Large status number */}
                    <div className="relative h-40 sm:h-52 flex items-center justify-center">
                        <h1 className="text-[146px] sm:text-[182px] lg:text-[220px] font-black text-white tracking-widest leading-none select-none">
                            {status}
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase text-white mt-4 mb-6 tracking-wide">
                        {info.message}
                    </h2>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                        <Link
                            href="/"
                            className="inline-block bg-white text-greycode-light-blue font-bold uppercase text-sm sm:text-lg py-3 px-8 rounded-full border-2 border-transparent hover:opacity-90 transition-opacity duration-200"
                        >
                            Go Home
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-block bg-transparent text-white font-bold uppercase text-sm sm:text-lg py-3 px-8 rounded-full border-2 border-white/80 hover:opacity-90 transition-opacity duration-200"
                        >
                            Contact us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}