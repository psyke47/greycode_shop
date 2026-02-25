import React from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import { ClockIcon, PhoneIcon, MailIcon } from "lucide-react";

const Contact = () => {
    return (
        <MainLayout title="Contact">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 py-16">
                <div className="text-left">
                    <h1 className="text-5xl font-bold mb-4 text-greycode-dark-blue">
                        Get in touch with sales team
                    </h1>
                    <p className="text-lg text-gray-600 mb-12">
                        We'll help you find the right solutions and pricing for
                        your business.
                        <br />
                        Fill out the form below and our team will get back to
                        you shortly.
                    </p>

                    {/* 5‑column grid: 3/5 for form, 2/5 for talk */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Form – 3/5 width */}
                        <div className="lg:col-span-3">
                            <div className="bg-white shadow-lg rounded-lg p-8 w-full">
                                <form className="space-y-4">
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            htmlFor="name"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            htmlFor="surname"
                                        >
                                            Surname
                                        </label>
                                        <input
                                            type="text"
                                            id="surname"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            placeholder="Your Surname"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            htmlFor="email"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            placeholder="Your Email"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                            htmlFor="message"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            placeholder="Your Message"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-greycode-light-blue text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-greycode-dark-blue transition hover:shadow-lg hover:-translate-y-2 hover:shadow-greycode-mid-blue transform"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Talk with us – 2/5 width */}
                        <div className="lg:col-span-2">
                            <h2 className="text-4xl font-bold mb-4 text-greycode-dark-blue text-center">
                                Talk with us
                            </h2>
                            <div className="bg-greycode-light-blue rounded-lg p-8 w-full">
                                <div className="space-y-4 text-white">
                                    <p className="flex items-start gap-2">
                                        <PhoneIcon className="w-5 h-5 text-greycode-light-gray shrink-0 mt-0.5" />
                                        <span>
                                            <span className="font-bold">
                                                Phone:
                                            </span>{" "}
                                            <a
                                                href="tel:+274813515"
                                                className="text-greycode-light-gray hover:underline"
                                            >
                                                +27 12 481 3515
                                            </a>
                                        </span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <MailIcon className="w-5 h-5 text-greycode-light-gray shrink-0 mt-0.5" />
                                        <span>
                                            <span className="font-bold">
                                                Email:
                                            </span>{" "}
                                            <a
                                                href="mailto:sales@greycode.co.za"
                                                className="text-greycode-light-gray hover:underline"
                                            >
                                                sales@greycode.co.za
                                            </a>
                                        </span>
                                    </p>
                                    <div className="flex items-start gap-2">
                                        <ClockIcon className="w-5 h-5 text-greycode-light-gray shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold block">
                                                Working Hours
                                            </span>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Monday – Thursday:
                                                    </span>{" "}
                                                    <span className="text-greycode-light-gray ml-2">
                                                        8:00 AM – 4:00 PM
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Friday: 
                                                    </span>{" "}
                                                    <span className="text-greycode-light-gray ml-2">
                                                        8:00 AM – 1:00 PM
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">
                                                        Saturday & Sunday: 
                                                    </span>{" "}
                                                    <span className="text-greycode-light-gray">
                                                        Closed
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Contact;
