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
     * Display the user's profile page with all addresses.
     */
    public function edit()
    {
        $user = Auth::user()->load(['orders']);
        
        // Get all addresses for this user
        $addresses = Address::where('user_id', $user->id)->get();
        
        // Find default/shipping/billing addresses
        $shippingAddress = $addresses->where('address_type', 'Shipping')->first();
        $billingAddress = $addresses->where('address_type', 'Billing')->first();
        
        // Get all saved addresses for the dropdown
        $savedAddresses = $addresses->map(function ($address) {
            return [
                'id' => $address->id,
                'type' => $address->address_type,
                'line1' => $address->address_line1,
                'line2' => $address->address_line2,
                'surburb' => $address->surburb,
                'city' => $address->city,
                'province' => $address->province,
                'postal_code' => $address->postal_code,
                'phone' => $address->phone_number,
                'is_default' => $address->is_default,
                'formatted' => $this->formatAddress($address),
            ];
        });

        return Inertia::render('UserProfile', [
            'auth' => [
                'user' => $user,
            ],
            'addresses' => $savedAddresses,
            'shippingAddress' => $shippingAddress,
            'billingAddress' => $billingAddress,
            'orders' => $user->orders ?? [],
        ]);
    }

    /**
     * Format address for display.
     */
    private function formatAddress($address)
    {
        $parts = [
            $address->address_line1,
            $address->address_line2,
            $address->surburb,
            $address->city,
            $address->province,
            $address->postal_code,
        ];
        
        return implode(', ', array_filter($parts));
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
     * Update or create shipping/billing addresses.
     */
    public function updateAddress(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            // If editing an existing address
            'address_id' => ['nullable', 'exists:addresses,id'],
            
            // Address fields
            'address_type' => ['required', Rule::in(['Shipping', 'Billing', 'Both'])],
            'address_line1' => ['required', 'string', 'max:255'],
            'address_line2' => ['nullable', 'string', 'max:255'],
            'surburb' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'province' => ['required', Rule::in([
                'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
                'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
            ])],
            'postal_code' => ['required', 'string', 'size:4'],
            'phone_number' => ['required', 'string', 'size:10'],
            'is_default' => ['boolean'],
        ]);

        $addressData = [
            'user_id' => $user->id,
            'address_type' => $validated['address_type'],
            'is_default' => $validated['is_default'] ?? false,
            'address_line1' => $validated['address_line1'],
            'address_line2' => $validated['address_line2'] ?? null,
            'surburb' => $validated['surburb'],
            'city' => $validated['city'],
            'province' => $validated['province'],
            'postal_code' => $validated['postal_code'],
            'country' => 'South Africa',
            'phone_number' => $validated['phone_number'],
        ];

        if ($request->filled('address_id')) {
            // Update existing address
            $address = Address::where('id', $validated['address_id'])
                ->where('user_id', $user->id)
                ->firstOrFail();
            $address->update($addressData);
            $message = 'Address updated successfully.';
        } else {
            // Create new address
            Address::create($addressData);
            $message = 'Address added successfully.';
        }

        // If this is set as default, remove default from other addresses of same type
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', $user->id)
                ->where('address_type', $validated['address_type'])
                ->where('id', '!=', $request->address_id ?? 0)
                ->update(['is_default' => false]);
        }

        return back()->with('flash', ['success' => $message]);
    }

    /**
     * Delete an address.
     */
    public function deleteAddress($id)
    {
        $user = Auth::user();
        
        $address = Address::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        $address->delete();

        return back()->with('flash', ['success' => 'Address deleted successfully.']);
    }

    /**
     * Set an address as default.
     */
    public function setDefaultAddress($id)
    {
        $user = Auth::user();
        
        $address = Address::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        
        // Remove default from other addresses of same type
        Address::where('user_id', $user->id)
            ->where('address_type', $address->address_type)
            ->update(['is_default' => false]);
        
        // Set this as default
        $address->update(['is_default' => true]);

        return back()->with('flash', ['success' => 'Default address updated.']);
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