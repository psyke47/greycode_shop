import React, { useEffect, useRef } from 'react';

export default function AddressAutocomplete({ value, onChange, placeholder, onSelect }) {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        // Initialize Google Places Autocomplete
        if (window.google && inputRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                {
                    types: ['address'],
                    componentRestrictions: { country: 'ZA' }, // Restrict to South Africa
                    fields: ['address_components', 'formatted_address']
                }
            );

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace();
                if (!place.address_components) return;

                // Parse address components
                const addressData = parseAddressComponents(place.address_components);
                
                // Fill all address fields
                if (onSelect) {
                    onSelect(addressData);
                }
            });
        }
    }, []);

    const parseAddressComponents = (components) => {
        const addressData = {
            street_number: '',
            route: '',
            suburb: '',
            city: '',
            province: '',
            postal_code: ''
        };

        components.forEach(component => {
            const types = component.types;
            
            if (types.includes('street_number')) {
                addressData.street_number = component.long_name;
            }
            if (types.includes('route')) {
                addressData.route = component.long_name;
            }
            if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
                addressData.suburb = component.long_name;
            }
            if (types.includes('locality')) {
                addressData.city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
                addressData.province = component.long_name;
            }
            if (types.includes('postal_code')) {
                addressData.postal_code = component.long_name;
            }
        });

        return addressData;
    };

    return (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Start typing your address..."}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoComplete="off"
        />
    );
}