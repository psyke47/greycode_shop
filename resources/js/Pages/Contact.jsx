import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import SecondaryNav from '../Components/SecondaryNav';
import { ClockIcon, PhoneIcon} from "lucide-react"


const Contact = () => {
    return (
        <MainLayout title="Contact">
            <SecondaryNav />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-left py-16">
                    <h1 className="text-4xl font-bold mb-4">Get in touch with sales team</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        We'll help you find the right solutions and pricing for your business.<br />
                        Fill out the form below and our team will get back to you shortly.
                    </p>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"> 
            <div className="flex flex-col lg:flex-row gap-40 items-center">            
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">  
                    <form className="max-w-2xl">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
                            <input type="text" id="name" className="w-full border border-gray-300 rounded-md p-2" placeholder="Your Name" />
                        </div>
                         <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="surname">Surname</label>
                            <input type="text" id="surname" className="w-full border border-gray-300 rounded-md p-2" placeholder="Your Surname" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                            <input type="email" id="email" className="w-full border border-gray-300 rounded-md p-2" placeholder="Your Email" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">Message</label>
                            <textarea id="message" rows="4" className="w-full border border-gray-300 rounded-md p-2" placeholder="Your Message"></textarea>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 transition ">Send Message</button>
                    </form>
                    </div> 
               
     

                    <div className="bg-gray-200 rounded-lg p-8 max-w-md w-full text-center mt-12 lg:mt-0">
                                       <h1 className="text-4xl font-bold mb-4 text-center">Talk with us</h1>
                        <p className="text-lg text-gray-600  mb-6 text-left">
                            <PhoneIcon className="inline-block w-5 h-5 text-blue-600 mr-2" />
                            Phone: <a href="tel:+274813515" className="text-blue-600 hover:underline">+27 12 481 3515</a><br />
                            <ClockIcon className="inline-block w-5 h-5 text-blue-600 mr-2" />
                            Working Hours: <br />
                                           Monday -Thursday, 8:00 AM - 4:00 PM <br />
                                           Friday, 8:00 AM - 2:00 PM <br />
                                           Saturday and Sunday - Closed <br />
                        </p>
                                </div>
                            </div>
                        </div>
                </div>
              </div>

            
                
            
        </MainLayout>
    );
}


export default Contact;