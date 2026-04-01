import React from 'react';
import { FaTiktok, FaLinkedinIn, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SocialIcons = () => {
    const socialLinks = [
        { icon: FaTiktok, href: "https://www.tiktok.com/@greycode_skillshare?is_from_webapp=1&sender_device=pc", label: "TikTok" },
        { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/greycode-pty-ltd/?originalSubdomain=za", label: "LinkedIn" },
        { icon: FaInstagram, href: "https://www.instagram.com/greycode_za/", label: "Instagram" },
        { icon: FaFacebookF, href: "https://www.facebook.com/profile.php/?id=61565652753412", label: "Facebook" },
        { icon: FaXTwitter, href: "https://x.com/we_are_greycode", label: "X" },
        { icon: FaYoutube, href: "https://www.youtube.com/@Greycode-skillshare", label: "YouTube" },
    ];

    return (
        <div className="border-t border-white pt-6 mb-6">
            <div className="text-center mb-4">
                <h3 className="text-white text-lg font-semibold">Follow Us</h3>
                <p className="text-white/80 text-sm">Stay connected on social media</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center items-center my-6">
                {socialLinks.map((social, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="bg-black border rounded-full p-3 w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                            <a href={social.href} target="_blank" rel="noopener noreferrer">
                                <social.icon className="text-white text-xl" />
                            </a>
                        </div>
                        <p className="text-center mt-2 text-white text-sm">{social.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialIcons;