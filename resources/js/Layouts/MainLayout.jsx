import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const MainLayout = ({ children }) => {
    const { props, flash } = usePage();
    const user = props.auth?.user;
    const [wishlistCount, setWishlistCount] = useState(0);

    // Display flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast(flash.warning, { icon: '⚠️' });
        }
    }, [flash]);

    useEffect(() => {
        // Fetch wishlist count when user is logged in
        if (user) {
            axios.get("/wishlist/count").then((response) => {
                setWishlistCount(response.data.count);
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar wishlistCount={wishlistCount} />
            <main>{children}</main>
            <Footer />
            <Toaster 
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#10b981',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#ef4444',
                        },
                    },
                }}
            />
        </div>
    );
};

export default MainLayout;