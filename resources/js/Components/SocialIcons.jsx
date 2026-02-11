import React from 'react';
import { FaTiktok, FaLinkedinIn, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SocialIcons = () => {
    return (
        <div  className='flex flex-wrap justify-center items-center gap-6 my-6'>
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-10 h-10 flex items-center justify-center'>
                    <a href ="https://www.tiktok.com/@greycode_skillshare?is_from_webapp=1&sender_device=pc"><FaTiktok className='text-white text-2xl'/></a>
                </div>
                <p className='text-center mt-2 text-white'>TikTok</p> 

            </div>
  
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-10 h-10 flex items-center justify-center'>
                    <a href = "https://www.linkedin.com/company/greycode-pty-ltd/?originalSubdomain=za" ><FaLinkedinIn className='text-white text-2xl'/></a>
                </div>
                <p className='text-center mt-2 text-white'>LinkedIn</p>
            </div>
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-10 h-10 flex items-center justify-center'>
                   <a href ="https://www.instagram.com/greycode_za/"><FaInstagram className='text-white text-2xl'/></a>
                </div>
                <p className='text-center mt-2 text-white'>Instagram</p>
            </div>
  
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-10 h-10 flex items-center justify-center'>
                    <a href = "https://www.facebook.com/profile.php/?id=61565652753412" ><FaFacebookF className='text-white text-2xl'/></a>
                </div>
                <p className='text-center mt-2 text-white'>Facebook</p>
            </div>
  
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-10 h-10 flex items-center justify-center'>
                     <a href = "https://x.com/we_are_greycode" ><FaXTwitter className='text-white text-2xl'/></a>
                </div>
                <p className='text-center mt-2 text-white'>X</p>
            </div>
  
            <div className='flex flex-col items-center'>
                <div className='bg-black border rounded-full p-3 w-10 h-10 flex items-center justify-center'>
                    <a href = "https://www.youtube.com/@Greycode-skillshare" ><FaYoutube className='text-white text-2xl'/></a>
                </div>
            <p className='text-center mt-2 text-white'>YouTube</p>
            </div>
        </div>
    );
};


export default SocialIcons;