import React from 'react';
import NavBar from '../Components/NavBar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100/10">
            <NavBar />
            <main className="pt-4">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;