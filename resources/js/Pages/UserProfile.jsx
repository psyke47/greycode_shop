import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { User, Mail, Phone, Calendar, Lock, ShoppingBag, Home, MapPin, Edit2, Check, X } from 'lucide-react';
import AddressSearch from '../Components/AddressSearch';

export default function UserProfile() {
    // Get all props including the new addresses array
    const { auth, addresses = [], shippingAddress, billingAddress, orders = [], flash } = usePage().props;
    const user = auth.user;

    // Log to verify data
    console.log('All addresses:', addresses);
    console.log('Shipping address:', shippingAddress);
    console.log('Billing address:', billingAddress);

    // ---------- Personal Information Form ----------
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        patch('/user-profile', {
            onSuccess: () => setIsEditing(false),
        });
    };

    // ---------- Address State ----------
    const [isEditingShipping, setIsEditingShipping] = useState(false);
    const [isEditingBilling, setIsEditingBilling] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    // ---------- Address Form (Shipping + Billing) ----------
    const {
        data: addressData,
        setData: setAddressData,
        put: updateAddress,
        processing: addressProcessing,
        errors: addressErrors,
    } = useForm({
        // Shipping - using the separate shippingAddress prop
        shipping_street: shippingAddress?.address_line1 || '',
        shipping_building: shippingAddress?.address_line2 || '',
        shipping_suburb: shippingAddress?.surburb || '',
        shipping_city: shippingAddress?.city || '',
        shipping_postal: shippingAddress?.postal_code || '',
        shipping_province: shippingAddress?.province || '',
        shipping_phone: shippingAddress?.phone_number || '',

        // Billing - using the separate billingAddress prop
        billing_street: billingAddress?.address_line1 || '',
        billing_building: billingAddress?.address_line2 || '',
        billing_suburb: billingAddress?.surburb || '',
        billing_city: billingAddress?.city || '',
        billing_postal: billingAddress?.postal_code || '',
        billing_province: billingAddress?.province || '',
        billing_phone: billingAddress?.phone_number || '',

        // Checkbox
        billing_same_as_shipping: false,
    });

    // When checkbox changes, copy shipping fields to billing if checked
    const handleBillingSameChange = (e) => {
        const checked = e.target.checked;
        setAddressData('billing_same_as_shipping', checked);
        if (checked) {
            setAddressData('billing_street', addressData.shipping_street);
            setAddressData('billing_building', addressData.shipping_building);
            setAddressData('billing_suburb', addressData.shipping_surburb);
            setAddressData('billing_city', addressData.shipping_city);
            setAddressData('billing_postal', addressData.shipping_postal);
            setAddressData('billing_province', addressData.shipping_province);
            setAddressData('billing_phone', addressData.shipping_phone);
        }
    };

    // If shipping fields change while checkbox is checked, keep billing in sync
    useEffect(() => {
        if (addressData.billing_same_as_shipping) {
            setAddressData('billing_street', addressData.shipping_street);
            setAddressData('billing_building', addressData.shipping_building);
            setAddressData('billing_suburb', addressData.shipping_surburb);
            setAddressData('billing_city', addressData.shipping_city);
            setAddressData('billing_postal', addressData.shipping_postal);
            setAddressData('billing_province', addressData.shipping_province);
            setAddressData('billing_phone', addressData.shipping_phone);
        }
    }, [
        addressData.shipping_street,
        addressData.shipping_building,
        addressData.shipping_suburb,
        addressData.shipping_city,
        addressData.shipping_postal,
        addressData.shipping_province,
        addressData.shipping_phone,
        addressData.billing_same_as_shipping,
    ]);

    // Submit shipping address
    const submitShippingAddress = () => {
        const shippingData = {
            address_id: selectedAddressId,
            address_type: 'Shipping',
            address_line1: addressData.shipping_street,
            address_line2: addressData.shipping_building,
            surburb: addressData.shipping_suburb,
            city: addressData.shipping_city,
            postal_code: addressData.shipping_postal,
            province: addressData.shipping_province,
            phone_number: addressData.shipping_phone,
        };

        updateAddress('/address', shippingData, {
            onSuccess: () => {
                setIsEditingShipping(false);
                setSelectedAddressId(null);
            },
        });
    };

    // Submit billing address
    const submitBillingAddress = () => {
        // If billing same as shipping, use shipping values
        if (addressData.billing_same_as_shipping) {
            setAddressData({
                ...addressData,
                billing_street: addressData.shipping_street,
                billing_building: addressData.shipping_building,
                billing_suburb: addressData.shipping_suburb,
                billing_city: addressData.shipping_city,
                billing_postal: addressData.shipping_postal,
                billing_province: addressData.shipping_province,
                billing_phone: addressData.shipping_phone,
            });
        }

        const billingData = {
            address_id: selectedAddressId,
            address_type: 'Billing',
            address_line1: addressData.billing_street,
            address_line2: addressData.billing_building,
            surburb: addressData.billing_suburb,
            city: addressData.billing_city,
            postal_code: addressData.billing_postal,
            province: addressData.billing_province,
            phone_number: addressData.billing_phone,
        };

        updateAddress('/address', billingData, {
            onSuccess: () => {
                setIsEditingBilling(false);
                setSelectedAddressId(null);
            },
        });
    };

    // Cancel editing
    const cancelShippingEdit = () => {
        setAddressData({
            ...addressData,
            shipping_street: shippingAddress?.address_line1 || '',
            shipping_building: shippingAddress?.address_line2 || '',
            shipping_suburb: shippingAddress?.surburb || '',
            shipping_city: shippingAddress?.city || '',
            shipping_postal: shippingAddress?.postal_code || '',
            shipping_province: shippingAddress?.province || '',
            shipping_phone: shippingAddress?.phone_number || '',
        });
        setIsEditingShipping(false);
        setSelectedAddressId(null);
    };

    const cancelBillingEdit = () => {
        setAddressData({
            ...addressData,
            billing_street: billingAddress?.address_line1 || '',
            billing_building: billingAddress?.address_line2 || '',
            billing_suburb: billingAddress?.surburb || '',
            billing_city: billingAddress?.city || '',
            billing_postal: billingAddress?.postal_code || '',
            billing_province: billingAddress?.province || '',
            billing_phone: billingAddress?.phone_number || '',
        });
        setIsEditingBilling(false);
        setSelectedAddressId(null);
    };

    // Load address from saved addresses
    const loadAddressFromSaved = (addressId, type) => {
        const selected = addresses.find(a => a.id === parseInt(addressId));
        if (selected) {
            if (type === 'shipping') {
                setAddressData({
                    ...addressData,
                    shipping_street: selected.line1,
                    shipping_building: selected.line2 || '',
                    shipping_suburb: selected.surburb,
                    shipping_city: selected.city,
                    shipping_postal: selected.postal_code,
                    shipping_province: selected.province,
                    shipping_phone: selected.phone,
                });
                setSelectedAddressId(selected.id);
            } else {
                setAddressData({
                    ...addressData,
                    billing_street: selected.line1,
                    billing_building: selected.line2 || '',
                    billing_suburb: selected.surburb,
                    billing_city: selected.city,
                    billing_postal: selected.postal_code,
                    billing_province: selected.province,
                    billing_phone: selected.phone,
                });
                setSelectedAddressId(selected.id);
            }
        }
    };

    // ---------- Password Change Form ----------
    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const submitPassword = (e) => {
        e.preventDefault();
        updatePassword('/password', {
            onSuccess: () => resetPassword(),
        });
    };

    // Helper: format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleShippingAddressSelect = (addressData) => {
        setAddressData({
            ...addressData,
            shipping_street: addressData.street || addressData.formatted_address,
            shipping_suburb: addressData.suburb || addressData.shipping_suburb,
            shipping_city: addressData.city || addressData.shipping_city,
            shipping_province: addressData.province || addressData.shipping_province,
            shipping_postal: addressData.postal_code || addressData.shipping_postal,
        });
        setSelectedAddressId(null); // New address, not saved
    };

    const handleBillingAddressSelect = (addressData) => {
        setAddressData({
            ...addressData,
            billing_street: addressData.street || addressData.formatted_address,
            billing_suburb: addressData.suburb || addressData.billing_suburb,
            billing_city: addressData.city || addressData.billing_city,
            billing_province: addressData.province || addressData.billing_province,
            billing_postal: addressData.postal_code || addressData.billing_postal,
            billing_same_as_shipping: false,
        });
        setSelectedAddressId(null); // New address, not saved
    };

    return (
        <MainLayout>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Head title="My Profile" />
                <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8 max-w-4xl mx-auto w-full">
                        <h1 className="text-3xl font-bold text-greycode-dark-blue">My Profile</h1>
                        <p className="text-gray-600 mt-1">Manage your account, addresses, and view your orders</p>
                    </div>

                    {/* Flash success message */}
                    {flash?.success && (
                        <div className="mb-6 max-w-4xl mx-auto w-full">
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                {flash.success}
                            </div>
                        </div>
                    )}

                    {/* Saved Addresses Dropdown - Show if there are multiple addresses */}
                    {/* {addresses.length > 1 && (
                        <div className="mb-6 max-w-4xl mx-auto w-full">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <label className="block text-sm font-medium text-blue-800 mb-2">
                                    Your Saved Addresses
                                </label>
                                <select
                                    onChange={(e) => {
                                        const [type, id] = e.target.value.split(':');
                                        if (id) loadAddressFromSaved(id, type);
                                    }}
                                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select an address to edit</option>
                                    {addresses.map(addr => (
                                        <React.Fragment key={addr.id}>
                                            <option value={`shipping:${addr.id}`}>Shipping: {addr.formatted}</option>
                                            <option value={`billing:${addr.id}`}>Billing: {addr.formatted}</option>
                                        </React.Fragment>
                                    ))}
                                </select>
                                <p className="text-xs text-blue-600 mt-2">
                                    Select an address to load it into the form below
                                </p>
                            </div>
                        </div>
                    )}
 */}
                    {/* Cards container */}
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {/* Personal Information Card - Same as before */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-greycode-light-blue border-b-5 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-greycode-light-blue" />
                                    Personal Information
                                </h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-sm text-greycode-light-blue hover:text-indigo-700 font-medium flex items-center gap-1"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                )}
                            </div>
                            <div className="p-6">
                                {!isEditing ? (
                                    <dl className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">First name</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{user.first_name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Last name</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{user.last_name}</dd>
                                            </div>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                                <Mail className="w-4 h-4" /> Email
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                                <Phone className="w-4 h-4" /> Phone
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> Date of birth
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(user.date_of_birth)}</dd>
                                        </div>
                                    </dl>
                                ) : (
                                    <form onSubmit={submitProfile} className="space-y-4">
                                        {/* Edit form remains the same */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    First name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="first_name"
                                                    value={data.first_name}
                                                    onChange={(e) => setData('first_name', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="last_name"
                                                    value={data.last_name}
                                                    onChange={(e) => setData('last_name', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                                                Date of birth
                                            </label>
                                            <input
                                                type="date"
                                                id="date_of_birth"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 bg-greycode-light-blue text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                {processing ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-greycode-light-blue border-b-5 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Home className="w-5 h-5 text-greycode-light-blue" />
                                    Shipping Address
                                </h2>
                                {!isEditingShipping && (
                                    <button
                                        onClick={() => setIsEditingShipping(true)}
                                        className="text-sm text-greycode-light-blue hover:text-indigo-700 font-medium flex items-center gap-1"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                )}
                            </div>
                            <div className="p-6">
                                {!isEditingShipping ? (
                                    // Display Mode
                                    <div className="space-y-2">
                                        {shippingAddress ? (
                                            <>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Street:</span> {shippingAddress.address_line1}
                                                </p>
                                                {shippingAddress.address_line2 && (
                                                    <p className="text-gray-900">
                                                        <span className="font-medium">Building:</span> {shippingAddress.address_line2}
                                                    </p>
                                                )}
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Suburb:</span> {shippingAddress.surburb}
                                                </p>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">City:</span> {shippingAddress.city}
                                                </p>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Postal Code:</span> {shippingAddress.postal_code}
                                                </p>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Province:</span> {shippingAddress.province}
                                                </p>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Phone:</span> {shippingAddress.phone_number}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-gray-500 italic">No shipping address saved yet.</p>
                                        )}
                                    </div>
                                ) : (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        {addresses.length > 0 && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Load from saved addresses
                                                </label>
                                                <select
                                                    onChange={(e) => loadAddressFromSaved(e.target.value, 'shipping')}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">Select a saved address</option>
                                                    {addresses.map(addr => (
                                                        <option key={addr.id} value={addr.id}>
                                                            {addr.formatted}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {Object.keys(addressErrors).length > 0 && (
                                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                                <div className="text-red-600 text-sm">
                                                    {Object.values(addressErrors).map((error, idx) => (
                                                        <div key={idx}>• {error}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Street Address *
                                            </label>
                                            <AddressSearch
                                                onAddressSelect={handleShippingAddressSelect}
                                                placeholder="Start typing your shipping address..."
                                                defaultValue={addressData.shipping_street}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Building/Complex</label>
                                            <input
                                                type="text"
                                                value={addressData.shipping_building}
                                                onChange={(e) => setAddressData('shipping_building', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                                                <input
                                                    type="text"
                                                    value={addressData.shipping_suburb}
                                                    onChange={(e) => setAddressData('shipping_suburb', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={addressData.shipping_city}
                                                    onChange={(e) => setAddressData('shipping_city', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                                <input
                                                    type="text"
                                                    value={addressData.shipping_postal}
                                                    onChange={(e) => setAddressData('shipping_postal', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                                <select
                                                    value={addressData.shipping_province}
                                                    onChange={(e) => setAddressData('shipping_province', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">Select Province</option>
                                                    <option value="Gauteng">Gauteng</option>
                                                    <option value="Western Cape">Western Cape</option>
                                                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                                    <option value="Eastern Cape">Eastern Cape</option>
                                                    <option value="Free State">Free State</option>
                                                    <option value="Limpopo">Limpopo</option>
                                                    <option value="Mpumalanga">Mpumalanga</option>
                                                    <option value="North West">North West</option>
                                                    <option value="Northern Cape">Northern Cape</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={addressData.shipping_phone}
                                                onChange={(e) => setAddressData('shipping_phone', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                maxLength={10}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={cancelShippingEdit}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                            >
                                                <X className="w-4 h-4" /> Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={submitShippingAddress}
                                                disabled={addressProcessing}
                                                className="px-4 py-2 bg-greycode-light-blue text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
                                            >
                                                <Check className="w-4 h-4" /> Update Address
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                                                {/* Billing Address Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-greycode-light-blue border-b-5 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-greycode-light-blue" />
                                    Billing Address
                                </h2>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={addressData.billing_same_as_shipping}
                                            onChange={handleBillingSameChange}
                                            className="rounded border-gray-300 text-greycode-light-blue focus:ring-greycode-light-blue"
                                        />
                                        Same as shipping
                                    </label>
                                    {!isEditingBilling && !addressData.billing_same_as_shipping && (
                                        <button
                                            onClick={() => setIsEditingBilling(true)}
                                            className="text-sm text-greycode-light-blue hover:text-indigo-700 font-medium flex items-center gap-1"
                                        >
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                {addressData.billing_same_as_shipping ? (
                                    <p className="text-gray-600">Same as shipping address</p>
                                ) : !isEditingBilling ? (
                                    // Display Mode
                                    <div className="space-y-2">
                                        {billingAddress ? (
                                            <>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Street:</span> {billingAddress.address_line1}
                                                </p>
                                                {billingAddress.address_line2 && (
                                                    <p className="text-gray-900">
                                                        <span className="font-medium">Building:</span> {billingAddress.address_line2}
                                                    </p>
                                                )}
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Suburb:</span> {billingAddress.surburb}
                                                </p>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">City:</span> {billingAddress.city}
                                                </p>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Postal Code:</span> {billingAddress.postal_code}
                                                </p>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Province:</span> {billingAddress.province}
                                                </p>
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Phone:</span> {billingAddress.phone_number}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-gray-500 italic">No billing address saved yet.</p>
                                        )}
                                    </div>
                                ) : (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        {addresses.length > 0 && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Load from saved addresses
                                                </label>
                                                <select
                                                    onChange={(e) => loadAddressFromSaved(e.target.value, 'billing')}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">Select a saved address</option>
                                                    {addresses.map(addr => (
                                                        <option key={addr.id} value={addr.id}>
                                                            {addr.formatted}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {Object.keys(addressErrors).length > 0 && (
                                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                                <div className="text-red-600 text-sm">
                                                    {Object.values(addressErrors).map((error, idx) => (
                                                        <div key={idx}>• {error}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Street Address *
                                            </label>
                                            <AddressSearch
                                                onAddressSelect={handleBillingAddressSelect}
                                                placeholder="Start typing your billing address..."
                                                defaultValue={addressData.billing_street}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Building/Complex</label>
                                            <input
                                                type="text"
                                                value={addressData.billing_building}
                                                onChange={(e) => setAddressData('billing_building', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                                                <input
                                                    type="text"
                                                    value={addressData.billing_suburb}
                                                    onChange={(e) => setAddressData('billing_suburb', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={addressData.billing_city}
                                                    onChange={(e) => setAddressData('billing_city', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                                <input
                                                    type="text"
                                                    value={addressData.billing_postal}
                                                    onChange={(e) => setAddressData('billing_postal', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                                <select
                                                    value={addressData.billing_province}
                                                    onChange={(e) => setAddressData('billing_province', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">Select Province</option>
                                                    <option value="Gauteng">Gauteng</option>
                                                    <option value="Western Cape">Western Cape</option>
                                                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                                    <option value="Eastern Cape">Eastern Cape</option>
                                                    <option value="Free State">Free State</option>
                                                    <option value="Limpopo">Limpopo</option>
                                                    <option value="Mpumalanga">Mpumalanga</option>
                                                    <option value="North West">North West</option>
                                                    <option value="Northern Cape">Northern Cape</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={addressData.billing_phone}
                                                onChange={(e) => setAddressData('billing_phone', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                maxLength={10}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={cancelBillingEdit}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                            >
                                                <X className="w-4 h-4" /> Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={submitBillingAddress}
                                                disabled={addressProcessing}
                                                className="px-4 py-2 bg-greycode-light-blue text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
                                            >
                                                <Check className="w-4 h-4" /> Update Address
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Change Password Card */}
                        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-greycode-light-blue border-b-5">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-greycode-light-blue" />
                                    Change Password
                                </h2>
                            </div>
                            <div className="p-6">
                                <form onSubmit={submitPassword} className="space-y-4">
                                    {Object.keys(passwordErrors).length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                            <div className="text-red-600 text-sm">
                                                {Object.values(passwordErrors).map((error, idx) => (
                                                    <div key={idx}>• {error}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="current_password"
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="new_password"
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData('new_password', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="new_password_confirmation"
                                            value={passwordData.new_password_confirmation}
                                            onChange={(e) => setPasswordData('new_password_confirmation', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={passwordProcessing}
                                            className="px-4 py-2 bg-greycode-light-blue text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {passwordProcessing ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}