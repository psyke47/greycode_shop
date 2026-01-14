import React from 'react';
import { FaTiktok, FaLinkedinIn, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SocialIcons = () => {
    return (
        <div className='flex flex-wrap justify-center items-center gap-8 mt-6'>
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-16 h-16 flex items-center justify-center'>
                    <FaTiktok className='text-white text-3xl'/>
                </div>
                <p className='text-center mt-2'>TikTok</p>
            </div>
  
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-16 h-16 flex items-center justify-center'>
                    <FaLinkedinIn className='text-white text-3xl'/>
                </div>
                <p className='text-center mt-2'>LinkedIn</p>
            </div>
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-16 h-16 flex items-center justify-center'>
                    <FaInstagram className='text-white text-3xl'/>
                </div>
                <p className='text-center mt-2'>Instagram</p>
            </div>
  
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-16 h-16 flex items-center justify-center'>
                    <FaFacebookF className='text-white text-3xl'/>
                </div>
                <p className='text-center mt-2'>Facebook</p>
            </div>
  
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-16 h-16 flex items-center justify-center'>
                    <FaXTwitter className='text-white text-3xl'/>
                </div>
                <p className='text-center mt-2'>X</p>
            </div>
  
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-16 h-16 flex items-center justify-center'>
                    <FaYoutube className='text-white text-3xl'/>
                </div>
            <p className='text-center mt-2'>YouTube</p>
            </div>
        </div>
    );
};


export default SocialIcons;