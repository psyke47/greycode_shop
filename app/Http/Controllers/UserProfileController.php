<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    /**
     * Display the user's profile page.
     */
    public function edit()
    {
        $user = Auth::user()->load(['shippingAddress', 'billingAddress']);

        return Inertia::render('UserProfile', [
            'auth' => ['user' => $user],
            'orders' => [],
        ]);
    }

    /**
     * Update the user's personal information.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone'      => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
        ]);

        $user->update($validated);

        return back()->with('flash', ['success' => 'Profile updated successfully.']);
    }

    /**
     * Update shipping and billing addresses.
     * Matches your addresses table schema.
     */
    public function updateAddress(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            // Shipping fields
            'shipping_street'   => ['required', 'string', 'max:255'],
            'shipping_building' => ['nullable', 'string', 'max:255'],
            'shipping_suburb'   => ['required', 'string', 'max:255'],
            'shipping_city'     => ['required', 'string', 'max:255'],
            'shipping_postal'   => ['required', 'string', 'size:4'],
            'shipping_province' => ['required', Rule::in([
                'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
                'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
            ])],
            'shipping_phone'    => ['required', 'string', 'size:10'],

            // Billing fields
            'billing_street'    => ['required', 'string', 'max:255'],
            'billing_building'  => ['nullable', 'string', 'max:255'],
            'billing_suburb'    => ['required', 'string', 'max:255'],
            'billing_city'      => ['required', 'string', 'max:255'],
            'billing_postal'    => ['required', 'string', 'size:4'],
            'billing_province'  => ['required', Rule::in([
                'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
                'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
            ])],
            'billing_phone'     => ['required', 'string', 'size:10'],
        ]);

        // ----- Shipping Address -----
        $shippingData = [
            'address_line1' => $validated['shipping_street'],
            'address_line2' => $validated['shipping_building'] ?? null,
            'surburb'       => $validated['shipping_suburb'],
            'city'          => $validated['shipping_city'],
            'province'      => $validated['shipping_province'],
            'postal_code'   => $validated['shipping_postal'],
            'country'       => 'South Africa',  // default from migration
            'phone_number'  => $validated['shipping_phone'],
            'is_default'    => false,           // adjust if needed
            'address_type'  => 'Shipping',
        ];

        $user->shippingAddress()->updateOrCreate(
            ['user_id' => $user->id, 'address_type' => 'Shipping'],
            $shippingData
        );

        // ----- Billing Address -----
        $billingData = [
            'address_line1' => $validated['billing_street'],
            'address_line2' => $validated['billing_building'] ?? null,
            'surburb'       => $validated['billing_suburb'],
            'city'          => $validated['billing_city'],
            'province'      => $validated['billing_province'],
            'postal_code'   => $validated['billing_postal'],
            'country'       => 'South Africa',
            'phone_number'  => $validated['billing_phone'],
            'is_default'    => false,
            'address_type'  => 'Billing',
        ];

        $user->billingAddress()->updateOrCreate(
            ['user_id' => $user->id, 'address_type' => 'Billing'],
            $billingData
        );

        return back()->with('flash', ['success' => 'Addresses updated successfully.']);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'new_password'     => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return back()->with('flash', ['success' => 'Password changed successfully.']); 
    }
}
