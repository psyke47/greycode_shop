import React from 'react';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="pt-4">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;