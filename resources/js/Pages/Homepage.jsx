import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import SecondaryNav from '../Components/SecondaryNav';


const Homepage = () => {
    return (
        <MainLayout title="Home">
            <SecondaryNav />
            <div className="min-h-[70vh] flex flex-col justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">Welcome to the Greycode Store</h1>
                        <p className="text-lg lg:text-xl xl:text-2xl text-gray-600">
                            Your premier destination for quality products
                        </p>
                    </div>
                    <div className="text-center">
                        <button className="bg-greycode-light-blue text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 transition shadow-greycode-dark-blue hover:shadow-xl hover:transform hover:scale-110">Shop Products</button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Homepage;