import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import SecondaryNav from '../Components/SecondaryNav';


const Homepage = () => {
    return (
        <MainLayout title="Home">
            <SecondaryNav />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-16">
                    <h1 className="text-4xl font-bold mb-4">Welcome to the Greycode Store</h1>
                    <p className="text-lg text-gray-600">
                        Your premier destination for quality products
                    </p>
                </div>
                <div className="text-center">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 transition ">Shop Products</button>
                </div>
            </div>
        </MainLayout>
    );
}

export default Homepage;