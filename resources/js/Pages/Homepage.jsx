import React, { useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import greycodeBoard from "/public/images/greycode-board.png";
import leftPlug from "/public/images/leftplug-removebg-preview.png";
import rightPlug from "/public/images/rightplug-removebg-preview.png";

const Homepage = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate mouse position as percentage
        const xPercent = x / rect.width - 0.5;
        const yPercent = y / rect.height - 0.5;

        // Set rotation based on mouse position (-15 to 15 degrees)
        const rotateY = xPercent * 30; // -15 to 15 deg
        const rotateX = -yPercent * 30; // -15 to 15 deg (inverted for natural feel)

        // Calculate offsets for layers
        const offsetX = xPercent * 20; // -10px to 10px
        const offsetY = yPercent * 20; // -10px to 10px

        setRotation({ x: rotateX, y: rotateY });
        setPosition({ x: offsetX, y: offsetY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setPosition({ x: 0, y: 0 });
    };

    return (
        <MainLayout title="Home">
            <div className="bg-white">
                {/* ✅ Minimal vertical padding – no min-h-screen forced */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 bg-linear-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                            Welcome to the Greycode Store
                        </h1>
                        <p className="text-lg lg:text-xl xl:text-2xl text-gray-600">
                            Your premier destination for quality products
                        </p>
                    </div>
                </div>

                {/* ✅ FULL-WIDTH 3‑COLUMN ROW – anchored edges, perfect centre */}
                <div className="hidden lg:flex justify-between items-center w-full px-4 sm:px-6 lg:px-">
                    {/* LEFT PLUG – flush to left edge */}
                    <div className="shrink-0">
                        <img 
                            src={leftPlug} 
                            alt="Left Plug" 
                            className="h-auto max-w-[180px] xl:max-w-[220px]" 
                        />
                    </div>

                    {/* CENTRE – 3D BOARD (perfectly centred) */}
                    <div className="perspective-1000 w-full max-w-md mx-auto">
                        <div
                            ref={containerRef}
                            className="relative hover-3d hover-3d-container transform-gpu transition-all duration-300"
                            style={{
                                "--mouse-x": `${rotation.y}deg`,
                                "--mouse-y": `${rotation.x}deg`,
                                "--mouse-x-offset": `${position.x}px`,
                                "--mouse-y-offset": `${position.y}px`,
                                transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg) translateZ(20px)`,
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <figure className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-transparent">
                                <img
                                    src={greycodeBoard}
                                    alt="3D Greycode Board"
                                    className="w-full h-auto rounded-2xl mix-blend-multiply"
                                    style={{ background: "transparent" }}
                                />
                            </figure>
                            {/* 3D effect layers – unchanged */}
                            <div className="hover-3d-layer opacity-0 bg-linear-to-br from-blue-400/20 via-purple-400/10 to-pink-400/20"
                                 style={{ transform: `translateZ(30px) translateX(${position.x * 0.5}px) translateY(${position.y * 0.5}px)`, opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.8 : 0 }} />
                            <div className="hover-3d-layer opacity-0 bg-linear-to-tr from-cyan-400/15 via-transparent to-rose-400/15"
                                 style={{ transform: `translateZ(50px) translateX(${position.x * 0.3}px) translateY(${position.y * 0.3}px)`, opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.6 : 0 }} />
                            <div className="hover-3d-layer opacity-0 bg-linear-to-r from-violet-400/10 via-transparent to-emerald-400/10"
                                 style={{ transform: `translateZ(70px) translateX(${position.x * 0.2}px) translateY(${position.y * 0.2}px)`, opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.4 : 0 }} />
                            <div className="hover-3d-layer opacity-0"
                                 style={{ background: `linear-gradient(${45 + rotation.y * 0.5}deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)`, opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.6 : 0, transform: `translateZ(20px) rotate(${rotation.y * 0.5}deg)` }} />
                        </div>
                    </div>

                    {/* RIGHT PLUG – flush to right edge */}
                    <div className="shrink-0">
                        <img 
                            src={rightPlug} 
                            alt="Right Plug" 
                            className="h-auto max-w-[180px] xl:max-w-[220px]" 
                        />
                    </div>
                </div>

                {/* ✅ BUTTON – reduced top margin, cleaner spacing */}
                <div className="text-center mt-6 pb-10 sm:pb-3">
                    <a href="/products">
                        <button className="bg-greycode-light-blue text-white px-8 py-4 rounded-xl text-lg font-medium 
                                           hover:bg-indigo-700 transition-all shadow-greycode-dark-blue 
                                           hover:shadow-xl hover:scale-110 active:scale-95">
                            Shop Products
                        </button>
                    </a>
                </div>

                {/* ✅ MOBILE STACK (visible below lg) */}
                <div className="lg:hidden flex flex-col items-center px-4 pb-6">
                    
                    <div className="perspective-1000 w-full max-w-md">
                        <div
                            ref={containerRef}
                            className="relative hover-3d hover-3d-container transform-gpu transition-all duration-300"
                            style={{
                                "--mouse-x": `${rotation.y}deg`,
                                "--mouse-y": `${rotation.x}deg`,
                                "--mouse-x-offset": `${position.x}px`,
                                "--mouse-y-offset": `${position.y}px`,
                                transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg) translateZ(20px)`,
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <figure className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-transparent">
                                <img
                                    src={greycodeBoard}
                                    alt="3D Greycode Board"
                                    className="w-full h-auto rounded-2xl mix-blend-multiply"
                                    style={{ background: "transparent" }}
                                />
                            </figure>
                            {/* 3D effect layers – unchanged */}
                            <div className="hover-3d-layer opacity-0 bg-linear-to-br from-blue-400/20 via-purple-400/10 to-pink-400/20"
                                 style={{ transform: `translateZ(30px) translateX(${position.x * 0.5}px) translateY(${position.y * 0.5}px)`, opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.8 : 0 }} />
                            <div className="hover-3d-layer opacity-0 bg-linear-to-tr from-cyan-400/15 via-transparent to-rose-400/15"
                                 style={{ transform: `translateZ(50px) translateX(${position.x * 0.3}px) translateY(${position.y * 0.3}px)`, opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.6 : 0 }} />
                            <div className="hover-3d-layer opacity-0 bg-linear-to-r from-violet-400/10 via-transparent to-emerald-400/10"
                                 style={{ transform: `translateZ(70px) translateX(${position.x * 0.2}px) translateY(${position.y * 0.2}px)`, opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.4 : 0 }} />
                            <div className="hover-3d-layer opacity-0"
                                 style={{ background: `linear-gradient(${45 + rotation.y * 0.5}deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)`, opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.6 : 0, transform: `translateZ(20px) rotate(${rotation.y * 0.5}deg)` }} />
                        </div>
                    </div>
                    
                </div>

                
            </div>
        </MainLayout>
    );
};

export default Homepage;

{
    /* <div className="min-h-[70vh] flex flex-col justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
                            Welcome to the Greycode Store
                        </h1>

                        <div className="flex gap-8 items-stretch my-8">
                            <div className="w-3/12 flex items-center h-2/3">
                                <img
                                    src={leftPlug}
                                    alt="Left Plug"
                                    className="w-full object-contain"
                                />
                            </div>

                            <div className="w-6/12 flex items-center justify-center bg-blue-500 rounded-2xl p-6 row-span-3">
                                <p className="text-lg lg:text-xl xl:text-2xl text-white text-center">
                                    Your premier destination for quality
                                    products
                                </p>
                            </div>

                            <div className="w-3/12 flex items-center h2/3">
                                <img
                                    src={rightPlug}
                                    alt="Right Plug"
                                    className="w-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="/products">
                            <button className="bg-greycode-light-blue text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 transition shadow-greycode-dark-blue hover:shadow-xl hover:transform hover:scale-110">
                                Shop Products
                            </button>
                        </a>
                    </div>
                </div>
            </div> */
}
