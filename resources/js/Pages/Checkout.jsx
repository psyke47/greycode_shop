import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import {
    ShoppingBag,
    Truck,
    CreditCard,
    MapPin,
    ChevronRight,
    ChevronDown,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import PageHead from "../Components/PageHead";

export default function Checkout({
    cart,
    addresses,
    defaultShipping,
    defaultBilling,
    provinces,
}) {
    const [activeStep, setActiveStep] = useState(1);
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [saveShipping, setSaveShipping] = useState(false);
    const [saveBilling, setSaveBilling] = useState(false);
    const [selectedShippingId, setSelectedShippingId] = useState(
        defaultShipping?.id || "new",
    );
    const [selectedBillingId, setSelectedBillingId] = useState(
        defaultBilling?.id || "new",
    );
    const [paymentMethod, setPaymentMethod] = useState("payfast"); // Default to PayFast
    const [isProcessing, setIsProcessing] = useState(false);

    // Form state
    const { data, setData, post, processing, errors } = useForm({
        shipping: {
            address_line1: defaultShipping?.address_line1 || "",
            address_line2: defaultShipping?.address_line2 || "",
            surburb: defaultShipping?.surburb || "",
            city: defaultShipping?.city || "",
            province: defaultShipping?.province || "Gauteng",
            postal_code: defaultShipping?.postal_code || "",
            phone_number: defaultShipping?.phone_number || "",
            save_address: true,
            is_default: false,
        },
        billing: {
            same_as_shipping: true,
            address_line1: defaultBilling?.address_line1 || "",
            address_line2: defaultBilling?.address_line2 || "",
            surburb: defaultBilling?.surburb || "",
            city: defaultBilling?.city || "",
            province: defaultBilling?.province || "Gauteng",
            postal_code: defaultBilling?.postal_code || "",
            phone_number: defaultBilling?.phone_number || "",
            save_address: false,
        },
        payment_method: "payfast",
        customer_note: "",
    });

    // Handle shipping address selection
    useEffect(() => {
        if (selectedShippingId !== "new" && addresses) {
            const selected = addresses.find((a) => a.id === selectedShippingId);
            if (selected) {
                setData("shipping", {
                    address_line1: selected.address_line1,
                    address_line2: selected.address_line2 || "",
                    surburb: selected.surburb,
                    city: selected.city,
                    province: selected.province,
                    postal_code: selected.postal_code,
                    phone_number: selected.phone_number,
                    save_address: false,
                    is_default: false,
                });
            }
        }
    }, [selectedShippingId, addresses]);

    // Handle billing address selection
    useEffect(() => {
        if (selectedBillingId !== "new" && addresses && !sameAsShipping) {
            const selected = addresses.find((a) => a.id === selectedBillingId);
            if (selected) {
                setData("billing", {
                    ...data.billing,
                    same_as_shipping: false,
                    address_line1: selected.address_line1,
                    address_line2: selected.address_line2 || "",
                    surburb: selected.surburb,
                    city: selected.city,
                    province: selected.province,
                    postal_code: selected.postal_code,
                    phone_number: selected.phone_number,
                    save_address: false,
                });
            }
        }
    }, [selectedBillingId, addresses, sameAsShipping]);

    // Handle same as shipping toggle
    useEffect(() => {
        setData("billing", {
            ...data.billing,
            same_as_shipping: sameAsShipping,
        });
    }, [sameAsShipping]);

    useEffect(() => {
    setData("payment_method", paymentMethod);
}, [paymentMethod, setData]);

    // Handle form submission
    const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Get CSRF token from meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    if (!csrfToken) {
        console.error('CSRF token not found');
        alert('Security token missing. Please refresh the page.');
        setIsProcessing(false);
        return;
    }

    // Create a hidden form for normal browser submission
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/checkout';
    form.style.display = 'none';

    // Add CSRF token
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_token';
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    // Helper to add form fields
    const addField = (name, value) => {
        if (value === undefined || value === null) return;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = String(value);
        form.appendChild(input);
    };

    // Add all shipping fields
    addField('shipping[address_line1]', data.shipping.address_line1);
    addField('shipping[address_line2]', data.shipping.address_line2);
    addField('shipping[surburb]', data.shipping.surburb);
    addField('shipping[city]', data.shipping.city);
    addField('shipping[province]', data.shipping.province);
    addField('shipping[postal_code]', data.shipping.postal_code);
    addField('shipping[phone_number]', data.shipping.phone_number);
    addField('shipping[save_address]', data.shipping.save_address ? '1' : '0');
    addField('shipping[is_default]', data.shipping.is_default ? '1' : '0');

    // Add billing fields
    addField('billing[same_as_shipping]', data.billing.same_as_shipping ? '1' : '0');
    if (!data.billing.same_as_shipping) {
        addField('billing[address_line1]', data.billing.address_line1);
        addField('billing[address_line2]', data.billing.address_line2);
        addField('billing[surburb]', data.billing.surburb);
        addField('billing[city]', data.billing.city);
        addField('billing[province]', data.billing.province);
        addField('billing[postal_code]', data.billing.postal_code);
        addField('billing[phone_number]', data.billing.phone_number);
        addField('billing[save_address]', data.billing.save_address ? '1' : '0');
    }

    // Add payment method and customer note
    addField('payment_method', data.payment_method);
    addField('customer_note', data.customer_note);

    // Append form and submit
    document.body.appendChild(form);
    
    // Small delay to ensure UI updates
    setTimeout(() => {
        form.submit();
    }, 100);
};

    // Get product image URL (same as Products.jsx)
    const getProductImage = (product) => {
        if (product.product_images && product.product_images.length > 0) {
            const image = product.product_images[0];
            const filename = image.url.split("\\").pop().split("/").pop();
            return `/images/${filename}`;
        }
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U1RTVFNSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==";
    };

    // Steps configuration
    const steps = [
        { id: 1, name: "Shipping", icon: Truck },
        { id: 2, name: "Payment", icon: CreditCard },
        { id: 3, name: "Review", icon: ShoppingBag },
    ];

    return (
        <MainLayout>
            <PageHead title="Checkout" />

            <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 accent-greycode-light-blue">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Checkout
                        </h1>
                        <p className="text-gray-600">Complete your purchase</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex items-center">
                                        <div
                                            className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 
                      ${
                          activeStep >= step.id
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 bg-white text-gray-500"
                      }
                    `}
                                        >
                                            <step.icon className="w-5 h-5" />
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-900 hidden sm:block">
                                            {step.name}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="lg:grid lg:grid-cols-3 lg:gap-8"
                    >
                        {/* Main Content - 2 columns */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-greycode-light-blue">
                                    <div className="flex items-center">
                                        <Truck className="w-5 h-5 text-greycode-light-gray mr-2" />
                                        <h2 className="text-lg font-semibold text-white">
                                            Shipping Address
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Saved Addresses */}
                                    {addresses.length > 0 && (
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select saved address
                                            </label>
                                            <select
                                                value={selectedShippingId}
                                                onChange={(e) =>
                                                    setSelectedShippingId(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="new">
                                                    + Use new address
                                                </option>
                                                {addresses
                                                    .filter(
                                                        (a) =>
                                                            a.address_type ===
                                                                "Shipping" ||
                                                            a.address_type ===
                                                                "Both",
                                                    )
                                                    .map((address) => (
                                                        <option
                                                            key={address.id}
                                                            value={address.id}
                                                        >
                                                            {
                                                                address.address_line1
                                                            }
                                                            , {address.surburb},{" "}
                                                            {address.city}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Address Form */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Street Address *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.shipping
                                                            .address_line1
                                                    }
                                                    onChange={(e) =>
                                                        setData("shipping", {
                                                            ...data.shipping,
                                                            address_line1:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-greycode-light-blue"
                                                    placeholder="123 Main St"
                                                />
                                                {errors[
                                                    "shipping.address_line1"
                                                ] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors[
                                                                "shipping.address_line1"
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Address Line 2
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.shipping
                                                            .address_line2
                                                    }
                                                    onChange={(e) =>
                                                        setData("shipping", {
                                                            ...data.shipping,
                                                            address_line2:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Apt/Suite (optional)"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Suburb *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.shipping.surburb
                                                    }
                                                    onChange={(e) =>
                                                        setData("shipping", {
                                                            ...data.shipping,
                                                            surburb:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Sandton"
                                                />
                                                {errors["shipping.surburb"] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors[
                                                                "shipping.surburb"
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.shipping.city}
                                                    onChange={(e) =>
                                                        setData("shipping", {
                                                            ...data.shipping,
                                                            city: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Johannesburg"
                                                />
                                                {errors["shipping.city"] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors[
                                                                "shipping.city"
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Province *
                                                </label>
                                                <select
                                                    value={
                                                        data.shipping.province
                                                    }
                                                    onChange={(e) =>
                                                        setData("shipping", {
                                                            ...data.shipping,
                                                            province:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    {provinces.map(
                                                        (province) => (
                                                            <option
                                                                key={province}
                                                                value={province}
                                                            >
                                                                {province}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                {errors[
                                                    "shipping.province"
                                                ] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors[
                                                                "shipping.province"
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Postal Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.shipping
                                                            .postal_code
                                                    }
                                                    onChange={(e) =>
                                                        setData("shipping", {
                                                            ...data.shipping,
                                                            postal_code:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="2196"
                                                    maxLength="4"
                                                />
                                                {errors[
                                                    "shipping.postal_code"
                                                ] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors[
                                                                "shipping.postal_code"
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={
                                                    data.shipping.phone_number
                                                }
                                                onChange={(e) =>
                                                    setData("shipping", {
                                                        ...data.shipping,
                                                        phone_number:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0721234567"
                                                maxLength="10"
                                            />
                                            {errors[
                                                "shipping.phone_number"
                                            ] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        errors[
                                                            "shipping.phone_number"
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-4 pt-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={saveShipping}
                                                    onChange={(e) => {
                                                        setSaveShipping(
                                                            e.target.checked,
                                                        );
                                                        setData("shipping", {
                                                            ...data.shipping,
                                                            save_address:
                                                                e.target
                                                                    .checked,
                                                        });
                                                    }}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">
                                                    Save this address
                                                </span>
                                            </label>

                                            {saveShipping && (
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            data.shipping
                                                                .is_default
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "shipping",
                                                                {
                                                                    ...data.shipping,
                                                                    is_default:
                                                                        e.target
                                                                            .checked,
                                                                },
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Set as default
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Address Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden accent-greycode-dark-blue">
                                <div className="p-6 border-b border-gray-100 bg-greycode-light-blue">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <MapPin className="w-5 h-5 text-greycode-light-gray mr-2" />
                                            <h2 className="text-lg font-semibold text-white">
                                                Billing Address
                                            </h2>
                                        </div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sameAsShipping}
                                                onChange={(e) =>
                                                    setSameAsShipping(
                                                        e.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-white">
                                                Same as shipping
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {!sameAsShipping && (
                                    <div className="p-6">
                                        {/* Saved Billing Addresses */}
                                        {addresses.length > 0 && (
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Select saved address
                                                </label>
                                                <select
                                                    value={selectedBillingId}
                                                    onChange={(e) =>
                                                        setSelectedBillingId(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="new">
                                                        + Use new address
                                                    </option>
                                                    {addresses
                                                        .filter(
                                                            (a) =>
                                                                a.address_type ===
                                                                    "Billing" ||
                                                                a.address_type ===
                                                                    "Both",
                                                        )
                                                        .map((address) => (
                                                            <option
                                                                key={address.id}
                                                                value={
                                                                    address.id
                                                                }
                                                            >
                                                                {
                                                                    address.address_line1
                                                                }
                                                                ,{" "}
                                                                {
                                                                    address.surburb
                                                                }
                                                                , {address.city}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Billing Address Form - Same fields as shipping */}
                                        <div className="space-y-4">
                                            {/* Copy the same address form fields here */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Street Address *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.billing
                                                                .address_line1
                                                        }
                                                        onChange={(e) =>
                                                            setData("billing", {
                                                                ...data.billing,
                                                                address_line1:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Address Line 2
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.billing
                                                                .address_line2
                                                        }
                                                        onChange={(e) =>
                                                            setData("billing", {
                                                                ...data.billing,
                                                                address_line2:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Suburb *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.billing.surburb
                                                        }
                                                        onChange={(e) =>
                                                            setData("billing", {
                                                                ...data.billing,
                                                                surburb:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        City *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.billing.city
                                                        }
                                                        onChange={(e) =>
                                                            setData("billing", {
                                                                ...data.billing,
                                                                city: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Province *
                                                    </label>
                                                    <select
                                                        value={
                                                            data.billing
                                                                .province
                                                        }
                                                        onChange={(e) =>
                                                            setData("billing", {
                                                                ...data.billing,
                                                                province:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        {provinces.map(
                                                            (province) => (
                                                                <option
                                                                    key={
                                                                        province
                                                                    }
                                                                    value={
                                                                        province
                                                                    }
                                                                >
                                                                    {province}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Postal Code *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.billing
                                                                .postal_code
                                                        }
                                                        onChange={(e) =>
                                                            setData("billing", {
                                                                ...data.billing,
                                                                postal_code:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        maxLength="4"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={
                                                        data.billing
                                                            .phone_number
                                                    }
                                                    onChange={(e) =>
                                                        setData("billing", {
                                                            ...data.billing,
                                                            phone_number:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    maxLength="10"
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={saveBilling}
                                                        onChange={(e) => {
                                                            setSaveBilling(
                                                                e.target
                                                                    .checked,
                                                            );
                                                            setData("billing", {
                                                                ...data.billing,
                                                                save_address:
                                                                    e.target
                                                                        .checked,
                                                            });
                                                        }}
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        Save this address
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method Card */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-100 bg-greycode-light-blue">
        <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-greycode-light-gray mr-2" />
            <h2 className="text-lg font-semibold text-white">
                Payment Method
            </h2>
        </div>
    </div>

    <div className="p-6">
        <div className="space-y-4">
            {/* PayFast Option */}
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                    type="radio"
                    name="payment_method"
                    value="payfast"
                    checked={paymentMethod === "payfast"}
                    onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setData("payment_method", e.target.value);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-medium text-gray-900">
                                PayFast
                            </span>
                            <p className="text-sm text-gray-500">
                                Credit Card, Instant EFT, or Mobile Money
                            </p>
                        </div>
                        {/* PayFast Logo */}
                        <div className="flex space-x-1">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Visa</span>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">MC</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">EFT</span>
                        </div>
                    </div>
                    
                    {/* PayFast Info Box - shown when selected */}
                    {paymentMethod === "payfast" && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                You'll be redirected to PayFast to complete your payment securely.
                            </p>
                        </div>
                    )}
                </div>
            </label>

            {/* EFT Option */}
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                    type="radio"
                    name="payment_method"
                    value="eft"
                    checked={paymentMethod === "eft"}
                    onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setData("payment_method", e.target.value);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-4">
                    <span className="font-medium text-gray-900">
                        EFT
                    </span>
                    <p className="text-sm text-gray-500">
                        Electronic Funds Transfer (Manual)
                    </p>
                </div>
            </label>

            {/* Cash on Delivery Option */}
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                    type="radio"
                    name="payment_method"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setData("payment_method", e.target.value);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-4">
                    <span className="font-medium text-gray-900">
                        Cash on Delivery
                    </span>
                    <p className="text-sm text-gray-500">
                        Pay when you receive your order
                    </p>
                </div>
            </label>
        </div>
    </div>
</div>

                            {/* Order Notes */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Notes (Optional)
                                    </label>
                                    <textarea
                                        value={data.customer_note}
                                        onChange={(e) =>
                                            setData(
                                                "customer_note",
                                                e.target.value,
                                            )
                                        }
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Special instructions, delivery preferences, etc."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar - 1 column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6">
                                <div className="p-6 border-b border-gray-100 bg-greycode-light-blue">
                                    <h2 className="text-lg font-semibold text-white">
                                        Your Order
                                    </h2>
                                </div>

                                {/* Cart Items */}
                                <div className="p-6 max-h-96 overflow-y-auto">
                                    <div className="space-y-4">
                                        {cart.cart_items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-start space-x-4"
                                            >
                                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={getProductImage(
                                                            item.product,
                                                        )}
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                                        R{" "}
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="p-6 border-t border-gray-100">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Subtotal
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                R {cart.subtotal?.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Shipping
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {cart.shipping > 0
                                                    ? `R ${cart.shipping.toFixed(2)}`
                                                    : "Free"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                VAT (15%)
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                R {cart.vat?.toFixed(2)}
                                            </span>
                                        </div>

                                        {cart.needs_for_free_shipping > 0 && (
                                            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-700">
                                                    Add R{" "}
                                                    {cart.needs_for_free_shipping.toFixed(
                                                        2,
                                                    )}{" "}
                                                    more for free shipping
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex justify-between">
                                                <span className="text-base font-semibold text-gray-900">
                                                    Total
                                                </span>
                                                <span className="text-xl font-bold text-greycode-light-blue">
                                                    R {cart.total?.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {cart.currency || "ZAR"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || isProcessing}
                                        className={`
                      w-full mt-6 py-3 px-4 rounded-lg font-medium text-white
                      transition-all duration-300 flex items-center justify-center
                      ${
                          processing || isProcessing
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-greycode-light-blue hover:bg-greycode-dark-blue hover:shadow-lg hover:shadow-greycode-mid-blue"
                      }
                    `}
                                    >
                                        {processing || isProcessing ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            "Place Order"
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        By placing your order, you agree to our
                                        <a
                                            href="/terms"
                                            className="text-blue-600 hover:underline mx-1"
                                        >
                                            Terms
                                        </a>
                                        and
                                        <a
                                            href="/privacy"
                                            className="text-blue-600 hover:underline ml-1"
                                        >
                                            Privacy Policy
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Return to Cart Link */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/cart"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            ← Return to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
