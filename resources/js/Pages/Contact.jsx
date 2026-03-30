import React from "react";
import { Head, useForm } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import { ClockIcon, PhoneIcon, MailIcon } from "lucide-react";
import PageHead from "../Components/PageHead";

const Contact = () => {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        surname: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact');
    };

    return (
        <MainLayout>
            <PageHead title="Contact" />
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

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Form */}
                        <div className="lg:col-span-3">
                            {recentlySuccessful && (
                                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
                                    Your message has been sent. We'll get back to you soon.
                                </div>
                            )}
                            <div className="bg-white shadow-lg rounded-lg p-8 w-full">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            placeholder="Your Name"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="surname">
                                            Surname
                                        </label>
                                        <input
                                            type="text"
                                            id="surname"
                                            value={data.surname}
                                            onChange={e => setData('surname', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            placeholder="Your Surname"
                                        />
                                        {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            placeholder="Your Email"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            placeholder="Your Message"
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-greycode-light-blue text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-greycode-dark-blue transition hover:shadow-lg hover:-translate-y-2 hover:shadow-greycode-mid-blue transform disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Talk with us */}
                        <div className="lg:col-span-2">
                            <h2 className="text-4xl font-bold mb-4 text-greycode-dark-blue text-center">
                                Talk with us
                            </h2>
                            <div className="bg-greycode-light-blue rounded-lg p-8 w-full">
                                <div className="space-y-4 text-white">
                                    <p className="flex items-start gap-2">
                                        <PhoneIcon className="w-5 h-5 text-greycode-light-gray shrink-0 mt-0.5" />
                                        <span>
                                            <span className="font-bold">Phone:</span>{" "}
                                            <a href="tel:+274813515" className="text-greycode-light-gray hover:underline">
                                                +27 12 481 3515
                                            </a>
                                        </span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <MailIcon className="w-5 h-5 text-greycode-light-gray shrink-0 mt-0.5" />
                                        <span>
                                            <span className="font-bold">Email:</span>{" "}
                                            <a href="mailto:sales@greycode.co.za" className="text-greycode-light-gray hover:underline">
                                                sales@greycode.co.za
                                            </a>
                                        </span>
                                    </p>
                                    <div className="flex items-start gap-2">
                                        <ClockIcon className="w-5 h-5 text-greycode-light-gray shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold block">Working Hours</span>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Monday – Thursday:</span>{" "}
                                                    <span className="text-greycode-light-gray ml-2">8:00 AM – 4:00 PM</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Friday:</span>{" "}
                                                    <span className="text-greycode-light-gray ml-2">8:00 AM – 1:00 PM</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Saturday & Sunday:</span>{" "}
                                                    <span className="text-greycode-light-gray">Closed</span>
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