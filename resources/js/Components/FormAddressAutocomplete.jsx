import React, { useState, useRef } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'

// List of libraries we need
const libraries = ['places']

function FormAddressAutocomplete({ onAddressSelect, placeholder = "Enter your address" }) {
  const [searchValue, setSearchValue] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)

  // Load the Google Maps API
  const { isLoaded: apiLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_Google_MAPS_API_KEY,
    libraries: libraries,
  })

  // Handle when the autocomplete is created
  const onLoad = (autocomplete) => {
    console.log('Autocomplete loaded')
    autocompleteRef.current = autocomplete
    setIsLoaded(true)
  }

  // Handle when the component unmounts
  const onUnmount = () => {
    console.log('Autocomplete unmounted')
    autocompleteRef.current = null
  }

  // Handle place selection
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      console.log('Place selected:', place)
      
      if (place.address_components && onAddressSelect) {
        // Parse address components into a clean object
        const addressData = {
          street_number: '',
          route: '',
          suburb: '',
          city: '',
          province: '',
          postal_code: '',
          country: '',
          formatted_address: place.formatted_address || '',
          place_id: place.place_id,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        }

        // Extract each component
        place.address_components.forEach(component => {
          const types = component.types

          if (types.includes('street_number')) {
            addressData.street_number = component.long_name
          }
          if (types.includes('route')) {
            addressData.route = component.long_name
          }
          if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
            addressData.suburb = component.long_name
          }
          if (types.includes('locality')) {
            addressData.city = component.long_name
          }
          if (types.includes('administrative_area_level_1')) {
            addressData.province = component.long_name
          }
          if (types.includes('postal_code')) {
            addressData.postal_code = component.long_name
          }
          if (types.includes('country')) {
            addressData.country = component.long_name
          }
        })

        // Combine street number and route for full street address
        addressData.street = `${addressData.street_number} ${addressData.route}`.trim()

        // Pass the parsed data back to parent
        onAddressSelect(addressData)
        
        // Update input value with formatted address
        setSearchValue(place.formatted_address)
      }
    }
  }

  // Handle manual input changes
  const handleInputChange = (e) => {
    setSearchValue(e.target.value)
  }

  // Show loading state
  if (loadError) {
    return (
      <div className="text-red-600 p-2 border border-red-300 rounded">
        Error loading Google Maps: {loadError.message}
      </div>
    )
  }

  if (!apiLoaded) {
    return (
      <div className="p-2 border border-gray-300 rounded bg-gray-50">
        Loading address search...
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <Autocomplete
        onLoad={onLoad}
        onUnmount={onUnmount}
        onPlaceChanged={onPlaceChanged}
        fields={['address_components', 'formatted_address', 'geometry', 'place_id']}
        options={{
          componentRestrictions: { country: 'za' }, // Restrict to South Africa
          types: ['address'], // Only return addresses
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{
            boxSizing: 'border-box',
          }}
        />
      </Autocomplete>
      
      {/* Optional: Show a small indicator when loaded */}
      {isLoaded && (
        <div className="absolute right-3 top-3">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default FormAddressAutocomplete