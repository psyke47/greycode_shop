import React from "react";
import blackLogo from "../../images/Greycode_G_Logo_black.png";
import whiteLogo from "/public/images/greycode-white-logo.png";
import blueLogo from "/public/images/blueGreycodeLogo.png";
import blackGreycodeLogo from "/public/images/Black-Greycode-Logo.png";
import SocialIcons from "./SocialIcons";

const Footer = () => {
    return (
        <footer className="bg-greycode-light-blue text-black pt-12 pb-8 lg:px-12 px-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <img
                                src={blackGreycodeLogo}
                                alt="Greycode White Logo"
                                className="w-auto h-12 "
                            />
                            {/* <span className="ml-2 text-xl font-bold">Greycode</span> */}
                        </div>
                        <p className="text-white">
                            Your gateway to cutting-edge IoT solutions for a
                            smarter, more connected life.
                        </p>
                        <div className="flex space-x-4">
                            <address className="not-italic text-white">
                                13 Stamvrug St, Val De Grace, <br />
                                Pretoria, 0184
                            </address>
                        </div>
                    </div>

                    {/* Official Website */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            Official Website
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://www.greycode.co.za/"
                                    className="text-white hover:text-greycode-dark-blue transition"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.greycode.co.za/about"
                                    className="text-white hover:text-greycode-dark-blue transition"
                                >
                                    About Us
                                </a>
                            </li>
                            <li className="relative group">
                                <a className="text-white hover:text-greycode-dark-blue transition">
                                    Services
                                </a>
                                <ul className="absolute left-3 mt-0 hidden group-hover:block bg-greycode-dark-blue shadow-lg rounded">
                                    <li>
                                        <a
                                            href="https://www.greycode.co.za/smart-farming"
                                            className="block px-4 py-2 text-white hover:bg-greycode-light-blue"
                                        >
                                            Smart Farming
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.greycode.co.za/manufacturing"
                                            className="block px-4 py-2 text-white hover:bg-greycode-light-blue"
                                        >
                                            Manufacturing
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.greycode.co.za/mining-oil-gas"
                                            className="block px-4 py-2 text-white hover:bg-greycode-light-blue"
                                        >
                                            Mining, Oils & Gas
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.greycode.co.za/smart-homes"
                                            className="block px-4 py-2 text-white hover:bg-greycode-light-blue"
                                        >
                                            Smart Homes
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    {/* Shop */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Shop</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-white hover:text-greycode-dark-blue transition"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/products"
                                    className="text-white hover:text-greycode-dark-blue transition"
                                >
                                    Shop Products
                                </a>
                            </li>
                            <li>
                                <a
                                    href="track"
                                    className="text-white hover:text-greycode-dark-blue transition"
                                >
                                    Track Orders
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="text-white hover:text-greycode-dark-blue transition"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Skillshare */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Skillshare</h3>
                        <ul className="space-y-2">
                            <li className="text-white hover:animate-pulse transition">
                                Home (Coming soon...)
                            </li>
                        </ul>
                    </div>
                </div>
                <SocialIcons />

                <div className="border-t border-white pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-white text-sm mb-4 md:mb-0">
                        © 2026 Company. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
