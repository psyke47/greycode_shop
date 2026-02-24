import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const MainLayout = ({ children }) => {
    const { props } = usePage();
    const user = props.auth?.user;
    const [wishlistCount, setWishlistCount] = useState(0);

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
        </div>
    );
};

export default MainLayout;
