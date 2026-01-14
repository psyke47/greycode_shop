import react from 'react';
import blackLogo from '../../images/Greycode_G_Logo_black.png';

import { useState } from 'react';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow mx-auto w-full bg-white">
            <a href="/">
                <img src={blackLogo} 
                    alt="Greycode Black Logo" 
                    className="w-auto h-12" />
            </a>
            
            <nav 
                id="menu" 
                className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center md:justify-end max-md:h-full bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal transition-all duration-300 ${
                    isMenuOpen ? 'max-md:w-full' : 'max-md:w-0'
                }`}
            >
                <a className="hover:text-indigo-600" href="/products">
                    Products
                </a>
                <a className="hover:text-indigo-600" href="/order-history">
                    Order History
                </a>
                <a className="hover:text-indigo-600" href="/tracking">
                    Tracking
                </a>
                <a className="hover:text-indigo-600" href="/contact">
                    Contact Us
                </a>
                <button 
                    onClick={closeMenu}
                    className="md:hidden text-gray-600"
                >
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
            </nav>
            
            <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle Placeholder */}
                {/* <button className="size-8 flex items-center justify-center hover:bg-gray-100 transition border border-slate-300 rounded-md">
                    <svg 
                        width="15" 
                        height="15" 
                        viewBox="0 0 15 15" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            d="M7.5 10.39a2.889 2.889 0 1 0 0-5.779 2.889 2.889 0 0 0 0 5.778M7.5 1v.722m0 11.556V14M1 7.5h.722m11.556 0h.723m-1.904-4.596-.511.51m-8.172 8.171-.51.511m-.001-9.192.51.51m8.173 8.171.51.511"
                            stroke="#353535" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                        />
                    </svg>
                </button> */}
                
                <a className="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition" href="#">
                    Sign up
                </a>

                <a className="hidden md:flex bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition" href="#">
                    Log in
                </a>
                
                <button 
                    onClick={toggleMenu}
                    className="md:hidden text-gray-600"
                >
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
                </button>
            </div>
        </header>
    );
};

export default NavBar;