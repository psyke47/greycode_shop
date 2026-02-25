import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { User, Mail, Phone, Calendar, Lock, ShoppingBag, Home, MapPin } from 'lucide-react';

export default function UserProfile() {

const { auth, orders = [], flash } = usePage().props;
const user = auth.user;

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

    // ---------- Address Form (Shipping + Billing) ----------
const {
    data: addressData,
    setData: setAddressData,
    put: updateAddress,
    processing: addressProcessing,
    errors: addressErrors,
} = useForm({
    // Shipping
    shipping_street: user.shipping_address?.address_line1 || '',
    shipping_building: user.shipping_address?.address_line2 || '',
    shipping_suburb: user.shipping_address?.surburb || '',         
    shipping_city: user.shipping_address?.city || '',
    shipping_postal: user.shipping_address?.postal_code || '',
    shipping_province: user.shipping_address?.province || '',
    shipping_phone: user.shipping_address?.phone_number || '',

    // Billing
    billing_street: user.billing_address?.address_line1 || '',
    billing_building: user.billing_address?.address_line2 || '',
    billing_suburb: user.billing_address?.surburb || '',
    billing_city: user.billing_address?.city || '',
    billing_postal: user.billing_address?.postal_code || '',
    billing_province: user.billing_address?.province || '',
    billing_phone: user.billing_address?.phone_number || '',

    // Checkbox
    billing_same_as_shipping: false,
});

    // Edit modes for addresses
    const [isEditingShipping, setIsEditingShipping] = useState(false);
    const [isEditingBilling, setIsEditingBilling] = useState(false);

      // Reset shipping fields to original user data
 const resetShippingToOriginal = () => {
    const orig = user.shipping_address || {};
    setAddressData('shipping_street', orig.address_line1 || '');
    setAddressData('shipping_building', orig.address_line2 || '');
    setAddressData('shipping_suburb', orig.surburb || '');
    setAddressData('shipping_city', orig.city || '');
    setAddressData('shipping_postal', orig.postal_code || '');
    setAddressData('shipping_province', orig.province || '');
    setAddressData('shipping_phone', orig.phone_number || '');
  };

    // Reset billing fields to original user data
  const resetBillingToOriginal = () => {
    const orig = user.billing_address || {};
    setAddressData('billing_street', orig.address_line1 || '');
    setAddressData('billing_building', orig.address_line2 || '');
    setAddressData('billing_suburb', orig.surburb || '');
    setAddressData('billing_city', orig.city || '');
    setAddressData('billing_postal', orig.postal_code || '');
    setAddressData('billing_province', orig.province || '');
    setAddressData('billing_phone', orig.phone_number || '');
    setAddressData('billing_same_as_shipping', false); // reset checkbox
  };

    // When checkbox changes, copy shipping fields to billing if checked
    const handleBillingSameChange = (e) => {
        const checked = e.target.checked;
        setAddressData('billing_same_as_shipping', checked);
        if (checked) {
            // Copy current shipping values to billing
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

    const submitAddress = (e) => {
        e.preventDefault();
        // If billing same as shipping, ensure billing fields match shipping before submit
        if (addressData.billing_same_as_shipping) {
            setAddressData('billing_street', addressData.shipping_street);
            setAddressData('billing_building', addressData.shipping_building);
            setAddressData('billing_suburb', addressData.shipping_suburb);
            setAddressData('billing_city', addressData.shipping_city);
            setAddressData('billing_postal', addressData.shipping_postal);
            setAddressData('billing_province', addressData.shipping_province);
            setAddressData('billing_phone', addressData.shipping_phone);
        }
        updateAddress('/address', {
            onSuccess: () => {
                // Optionally reset checkbox or show message
            },
        });
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

      // Helper: format address for display
    const formatAddress = (addr) => {
        if (!addr) return null;
        const parts = [
            addr.address_line1,
            addr.address_line2,
            addr.surburb,
            addr.city,
            addr.province,
            addr.postal_code,
            ].filter(Boolean);
        return parts.join(', ');
    };

  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col bg-gray-50">
            <Head title="My Profile" />
            <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your account and addresses</p>
                </div>

                {/* Flash success message */}
                {flash?.success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-10 justify-center w-full max-w-5xl mx-auto">
                    {/* Left Column – Personal Info, Addresses, Password */}
                    <div className="space-y-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-greycode-light-blue" />
                                    Personal Information
                                </h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-sm text-greycode-light-blue hover:text-indigo-700 font-medium"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="p-6">
                                {!isEditing ? (
                                    // Display mode
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
                                    // Edit mode form (same as before)
                                    <form onSubmit={submitProfile} className="space-y-4">
                                        {Object.keys(errors).length > 0 && (
                                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                                <div className="text-red-600 text-sm">
                                                    {Object.values(errors).map((error, idx) => (
                                                        <div key={idx}>• {error}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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
                        {/* Shipping Address Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Home className="w-5 h-5 text-greycode-light-blue" />
                                Shipping Address
                            </h2>
                            {user.shipping_address && !isEditingShipping && (
                                <button
                                onClick={() => setIsEditingShipping(true)}
                                className="text-sm text-greycode-light-blue hover:text-indigo-700 font-medium"
                                >
                                Edit
                                </button>
                            )}
                            </div>
                            <div className="p-6">
                            {user.shipping_address && !isEditingShipping ? (
                                // Display mode
                                <div className="space-y-2">
                                <p className="text-sm text-gray-900">{formatAddress(user.shipping_address)}</p>
                                {user.shipping_address.phone_number && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <Phone className="w-4 h-4" /> {user.shipping_address.phone_number}
                                    </p>
                                )}
                                </div>
                            ) : (
                                // Edit mode (form)
                                <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        value={addressData.shipping_street}
                                        onChange={(e) => setAddressData('shipping_street', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue"
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
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (for this address)</label>
                                    <input
                                        type="tel"
                                        value={addressData.shipping_phone}
                                        onChange={(e) => setAddressData('shipping_phone', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        maxLength={10}
                                    />
                                    </div>
                                </div>
                                {user.shipping_address && (
                                    <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                        resetShippingToOriginal();
                                        setIsEditingShipping(false);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    </div>
                                )}
                                </div>
                            )}
                            </div>
                        </div>

                        {/* Billing Address Card (with checkbox) */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-greycode-light-blue" />
                                Billing Address
                            </h2>
                            {user.billing_address && !isEditingBilling && (
                                <button
                                onClick={() => setIsEditingBilling(true)}
                                className="text-sm text-greycode-light-blue hover:text-indigo-700 font-medium"
                                >
                                Edit
                                </button>
                            )}
                            </div>
                            <div className="p-6">
                            {user.billing_address && !isEditingBilling ? (
                                // Display mode
                                <div className="space-y-2">
                                <p className="text-sm text-gray-900">{formatAddress(user.billing_address)}</p>
                                {user.billing_address.phone_number && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <Phone className="w-4 h-4" /> {user.billing_address.phone_number}
                                    </p>
                                )}
                                </div>
                            ) : (
                                // Edit mode (form)
                                <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={addressData.billing_same_as_shipping}
                                        onChange={handleBillingSameChange}
                                        className="rounded border-gray-300 text-greycode-light-blue focus:ring-greycode-light-blue"
                                    />
                                    Same as shipping
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        value={addressData.billing_street}
                                        onChange={(e) => setAddressData('billing_street', e.target.value)}
                                        disabled={addressData.billing_same_as_shipping}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                    </div>
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Building/Complex</label>
                                    <input
                                        type="text"
                                        value={addressData.billing_building}
                                        onChange={(e) => setAddressData('billing_building', e.target.value)}
                                        disabled={addressData.billing_same_as_shipping}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                                        <input
                                        type="text"
                                        value={addressData.billing_suburb}
                                        onChange={(e) => setAddressData('billing_suburb', e.target.value)}
                                        disabled={addressData.billing_same_as_shipping}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue disabled:bg-gray-100 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                        type="text"
                                        value={addressData.billing_city}
                                        onChange={(e) => setAddressData('billing_city', e.target.value)}
                                        disabled={addressData.billing_same_as_shipping}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue disabled:bg-gray-100 disabled:text-gray-500"
                                        />
                                    </div>
                                    </div>
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                    <input
                                        type="text"
                                        value={addressData.billing_postal}
                                        onChange={(e) => setAddressData('billing_postal', e.target.value)}
                                        disabled={addressData.billing_same_as_shipping}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-greycode-light-blue focus:border-greycode-light-blue disabled:bg-gray-100 disabled:text-gray-500"
                                    />
                                    </div>
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                    <select
                                        value={addressData.billing_province}
                                        onChange={(e) => setAddressData('billing_province', e.target.value)}
                                        disabled={addressData.billing_same_as_shipping}
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
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (for this address)</label>
                                    <input
                                        type="tel"
                                        value={addressData.billing_phone}
                                        onChange={(e) => setAddressData('billing_phone', e.target.value)}
                                        disabled={addressData.billing_same_as_shipping}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        maxLength={10}
                                    />
                                    </div>
                                </div>
                                {user.billing_address && (
                                    <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                        resetBillingToOriginal();
                                        setIsEditingBilling(false);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    </div>
                                )}
                                </div>
                            )}
                            </div>
                        </div>

                        {/* Address form errors and global submit button */}
                        {Object.keys(addressErrors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="text-red-600 text-sm">
                                {Object.values(addressErrors).map((error, idx) => (
                                <div key={idx}>• {error}</div>
                                ))}
                            </div>
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                            onClick={submitAddress}
                            disabled={addressProcessing}
                            className="px-4 py-2 bg-greycode-light-blue text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                            >
                            {addressProcessing ? 'Updating...' : 'Update Addresses'}
                            </button>
                        </div>

                        {/* Change Password Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
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
        </div>

    </MainLayout>
  )
}
