import React, { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import datasheetRegistry from '../Registry/datasheetRegistry';


export default function ProductDocumentation({ product }) {
    const [isOpen, setIsOpen] = useState(false);
 
    if (!product) return null;
 
    const Datasheet = datasheetRegistry[product.slug] || datasheetRegistry[product.id];
 
    if (!Datasheet) return null;
 
    return (
        <div className="mt-6 lg:mt-4 w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-2 p-6 lg:p-8 text-left"
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-greycode-light-blue" />
                    <h2 className="text-2xl font-bold text-gray-900">
                        Documentation & Setup Guide
                    </h2>
                </span>
                <ChevronDown
                    className={`w-10 h-10 text-greycode-light-blue flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
 
            {isOpen && (
                <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <Datasheet />
                </div>
            )}
        </div>
    );
}