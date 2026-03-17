import React, { useState } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'

const libraries = ['places']

function AddressSearch({ onAddressSelect, placeholder = "Enter your address", defaultValue = '' }) {
  const [searchValue, setSearchValue] = useState(defaultValue)
  const [autocomplete, setAutocomplete] = useState(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance)
  }

  const onUnmount = () => {
    setAutocomplete(null)
  }

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      
      if (place.address_components && onAddressSelect) {
        const addressData = {
          street_number: '',
          route: '',
          suburb: '',
          city: '',
          province: '',
          postal_code: '',
          country: '',
          formatted_address: place.formatted_address || '',
        }

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
        })

        addressData.street = `${addressData.street_number} ${addressData.route}`.trim()

        onAddressSelect(addressData)
        setSearchValue(place.formatted_address)
      }
    }
  }

  const handleInputChange = (e) => {
    setSearchValue(e.target.value)
  }

  if (loadError) {
    return (
      <div className="text-red-600 p-2 border border-red-300 rounded">
        Error loading address search. Please enter manually.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="p-2 border border-gray-300 rounded bg-gray-50">
        Loading address search...
      </div>
    )
  }

  return (
    <Autocomplete
      onLoad={onLoad}
      onUnmount={onUnmount}
      onPlaceChanged={onPlaceChanged}
      fields={['address_components', 'formatted_address']}
      options={{
        componentRestrictions: { country: 'za' },
        types: ['address'],
      }}
    >
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </Autocomplete>
  )
}

export default AddressSearch