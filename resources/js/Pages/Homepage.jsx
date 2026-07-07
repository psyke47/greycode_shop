import React, { useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import greycodeBoard from "/public/images/greycode-board.png";
import leftPlug from "/public/images/leftplug-removebg-preview.png";
import rightPlug from "/public/images/rightplug-removebg-preview.png";
import { useEffect } from 'react';
import { trackViewItemList } from '@/utilis/analytics';

const Homepage = () => {
    // Separate refs for desktop and mobile 3D containers
    const desktopRef = useRef(null);
    const mobileRef = useRef(null);

    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Shared mouse handlers
    const handleMouseMove = (e, ref) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = x / rect.width - 0.5;
        const yPercent = y / rect.height - 0.5;
        setRotation({ x: -yPercent * 30, y: xPercent * 30 });
        setPosition({ x: xPercent * 20, y: yPercent * 20 });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setPosition({ x: 0, y: 0 });
    };
    useEffect(() => {
        // Track homepage view
        trackViewItemList([], 'Homepage Featured');
    }, []);

    // Reusable 3D board component
    const ThreeDBoard = ({ refProp }) => (
        <div
            ref={refProp}
            className="relative hover-3d hover-3d-container transform-gpu transition-all duration-300"
            style={{
                "--mouse-x": `${rotation.y}deg`,
                "--mouse-y": `${rotation.x}deg`,
                "--mouse-x-offset": `${position.x}px`,
                "--mouse-y-offset": `${position.y}px`,
                transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg) translateZ(20px)`,
            }}
            onMouseMove={(e) => handleMouseMove(e, refProp)}
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
            {/* 3D effect layers */}
            <div
                className="hover-3d-layer opacity-0 bg-linear-to-br from-blue-400/20 via-purple-400/10 to-pink-400/20"
                style={{
                    transform: `translateZ(30px) translateX(${position.x * 0.5}px) translateY(${position.y * 0.5}px)`,
                    opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.8 : 0,
                }}
            />
            <div
                className="hover-3d-layer opacity-0 bg-linear-to-tr from-cyan-400/15 via-transparent to-rose-400/15"
                style={{
                    transform: `translateZ(50px) translateX(${position.x * 0.3}px) translateY(${position.y * 0.3}px)`,
                    opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.6 : 0,
                }}
            />
            <div
                className="hover-3d-layer opacity-0 bg-linear-to-r from-violet-400/10 via-transparent to-emerald-400/10"
                style={{
                    transform: `translateZ(70px) translateX(${position.x * 0.2}px) translateY(${position.y * 0.2}px)`,
                    opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.4 : 0,
                }}
            />
            <div
                className="hover-3d-layer opacity-0"
                style={{
                    background: `linear-gradient(${45 + rotation.y * 0.5}deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)`,
                    opacity: Math.abs(rotation.x) > 0 || Math.abs(rotation.y) > 0 ? 0.6 : 0,
                    transform: `translateZ(20px) rotate(${rotation.y * 0.5}deg)`,
                }}
            />
        </div>
    );

    return (
        <MainLayout title="Home">
            <div className="bg-white">
                {/* Header – minimal padding */}
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

                {/* ---------- MOBILE LAYOUT (below lg) ---------- */}
                <div className="lg:hidden flex flex-col items-center px-4">
                    {/* 🔹 BUTTON FIRST on mobile (above board) */}
                    <div className="text-center w-full mb-6">
                        <Link href="/products">
                            <button className="bg-greycode-light-blue text-white px-8 py-4 rounded-xl text-lg font-medium
                                               hover:bg-indigo-700 transition-all shadow-greycode-dark-blue
                                               hover:shadow-xl hover:scale-110 active:scale-95">
                                Shop Products
                            </button>
                        </Link>
                    </div>

                    {/* 3D Board – no plugs */}
                    <div className="perspective-1000 w-full max-w-md">
                        <ThreeDBoard refProp={mobileRef} />
                    </div>
                </div>

                {/* ---------- DESKTOP LAYOUT (lg and up) ---------- */}
                <div className="hidden lg:flex flex-col items-center w-full">
                    {/* Three-column row with plugs */}
                    <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-8">
                        {/* Left plug */}
                        <div className="shrink-0">
                            <img
                                src={leftPlug}
                                alt="Left Plug"
                                className="h-auto max-w-[180px] xl:max-w-[220px]"
                            />
                        </div>

                        {/* 3D Board */}
                        <div className="perspective-1000 w-full max-w-md mx-auto">
                            <ThreeDBoard refProp={desktopRef} />
                        </div>

                        {/* Right plug */}
                        <div className="shrink-0">
                            <img
                                src={rightPlug}
                                alt="Right Plug"
                                className="h-auto max-w-[180px] xl:max-w-[220px]"
                            />
                        </div>
                    </div>

                    {/* 🔹 BUTTON BELOW on desktop (after plugs + board) */}
                    <div className="text-center mt-8 pb-10">
                        <Link href="/products">
                            <button className="bg-greycode-light-blue text-white px-8 py-4 rounded-xl text-lg font-medium
                                               hover:bg-indigo-700 transition-all shadow-greycode-dark-blue
                                               hover:shadow-xl hover:scale-110 active:scale-95">
                                Shop Products
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Homepage;