import React, { useEffect, useRef, useState } from 'react';

export default function AddressAutocomplete({ value, onChange, placeholder, onSelect }) {
    const containerRef = useRef(null);
    const [loadError, setLoadError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const autocompleteRef = useRef(null);
    const mountedRef = useRef(true);
    const initStarted = useRef(false);

    useEffect(() => {
        mountedRef.current = true;
        
        // Prevent multiple initializations
        if (initStarted.current) return;
        initStarted.current = true;

        console.log('🚀 AddressAutocomplete mounted', { 
            containerExists: !!containerRef.current,
            googleExists: !!window.google 
        });

        const initAutocomplete = async () => {
            try {
                // Wait for container to be available
                if (!containerRef.current) {
                    console.log('⏳ Container not ready, retrying in 100ms');
                    setTimeout(initAutocomplete, 100);
                    return;
                }

                console.log('✅ Container is ready:', containerRef.current);

                if (!window.google || !window.google.maps) {
                    console.log('⏳ Google Maps not ready, retrying in 100ms');
                    setTimeout(initAutocomplete, 100);
                    return;
                }

                // Check if places library is available
                if (!window.google.maps.importLibrary) {
                    console.log('⏳ importLibrary not available, retrying in 100ms');
                    setTimeout(initAutocomplete, 100);
                    return;
                }

                console.log('📚 Importing places library...');
                const places = await window.google.maps.importLibrary("places");
                
                if (!places || !places.PlaceAutocompleteElement) {
                    console.log('⏳ PlaceAutocompleteElement not available, retrying in 100ms');
                    setTimeout(initAutocomplete, 100);
                    return;
                }

                console.log('✅ Places library loaded, creating autocomplete...');

                const { PlaceAutocompleteElement } = places;
                const autocomplete = new PlaceAutocompleteElement();
                autocompleteRef.current = autocomplete;

                // Style the element
                autocomplete.style.width = '100%';
                autocomplete.style.padding = '8px 12px';
                autocomplete.style.border = '1px solid #d1d5db';
                autocomplete.style.borderRadius = '0.5rem';
                autocomplete.style.fontSize = '16px';
                autocomplete.style.backgroundColor = 'white';

                if (placeholder) {
                    autocomplete.placeholder = placeholder;
                }

                // Clear and append to container
                if (containerRef.current && mountedRef.current) {
                    containerRef.current.innerHTML = '';
                    containerRef.current.appendChild(autocomplete);
                    console.log('✅ Autocomplete appended to DOM');
                }

                // Handle place selection
                autocomplete.addEventListener('placechanged', () => {
                    if (!mountedRef.current) return;
                    
                    const place = autocomplete.value;
                    if (!place) return;

                    console.log('📍 Place selected');
                    
                    place.fetchFields({
                        fields: ['addressComponents', 'formattedAddress']
                    }).then(() => {
                        if (!mountedRef.current) return;
                        
                        const addressComponents = place.addressComponents || [];
                        const addressData = {
                            street_number: '',
                            route: '',
                            suburb: '',
                            city: '',
                            province: '',
                            postal_code: ''
                        };

                        addressComponents.forEach(component => {
                            const types = component.types || [];
                            if (types.includes('street_number')) {
                                addressData.street_number = component.longText || '';
                            }
                            if (types.includes('route')) {
                                addressData.route = component.longText || '';
                            }
                            if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
                                addressData.suburb = component.longText || '';
                            }
                            if (types.includes('locality')) {
                                addressData.city = component.longText || '';
                            }
                            if (types.includes('administrative_area_level_1')) {
                                addressData.province = component.longText || '';
                            }
                            if (types.includes('postal_code')) {
                                addressData.postal_code = component.longText || '';
                            }
                        });

                        if (onSelect) onSelect(addressData);
                        if (onChange) onChange(place.formattedAddress);
                    }).catch(error => {
                        console.error('Error fetching place details:', error);
                    });
                });

                if (mountedRef.current) {
                    setIsLoading(false);
                    setLoadError(null);
                }

            } catch (error) {
                console.error('Error in initAutocomplete:', error);
                if (mountedRef.current) {
                    setLoadError(error.message || 'Failed to load address autocomplete');
                    setIsLoading(false);
                }
            }
        };

        initAutocomplete();

        return () => {
            console.log('🧹 Cleaning up AddressAutocomplete');
            mountedRef.current = false;
            if (autocompleteRef.current && containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []); // Empty dependency array - run once

    // Show loading state
    if (isLoading) {
        return (
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-sm">Loading address finder...</p>
            </div>
        );
    }

    // Show error state with manual input
    if (loadError) {
        return (
            <div>
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    placeholder={placeholder || "Enter address manually"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-amber-600 mt-1">
                    ⚠️ {loadError}
                </p>
            </div>
        );
    }

    // Render container for autocomplete
    return <div ref={containerRef} className="w-full min-h-[42px]" />;
}