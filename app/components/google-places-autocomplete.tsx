import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/app/ui/input'
import { BoundingBox } from '../utils/geo'

export type GooglePlace = google.maps.places.PlaceResult

interface GooglePlacesAutocompleteProps {
  place: GooglePlace | null
  onPlaceSelected: (place: GooglePlace) => void
  placeholder: string
  bounds?: BoundingBox
  onClick?: () => void
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  place,
  onPlaceSelected,
  placeholder,
  bounds,
  onClick,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    place?.formatted_address || '',
  )
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`
      script.async = true
      script.onload = () => initializeAutocomplete()
      document.body.appendChild(script)
    } else {
      initializeAutocomplete()
    }
  }, [])

  const initializeAutocomplete = () => {
    if (inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: [
            'address_components',
            'geometry.location',
            'place_id',
            'formatted_address',
            'name',
          ],
          bounds: bounds
            ? new window.google.maps.LatLngBounds(
                new window.google.maps.LatLng(bounds.south, bounds.west),
                new window.google.maps.LatLng(bounds.north, bounds.east),
              )
            : undefined,
          strictBounds: true,
        },
      )

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
    }
  }

  const handlePlaceSelect = () => {
    const place: google.maps.places.PlaceResult | undefined =
      autocompleteRef.current?.getPlace()
    if (place && place.geometry) {
      onPlaceSelected(place)
      setInputValue(place.name || place.formatted_address || '')
    }
  }

  useEffect(() => {
    if (!place && inputValue) setInputValue('')
    if (place && !inputValue)
      setInputValue(place.name || place.formatted_address || '')
  }, [place])

  function handleClick() {
    if (onClick) onClick()
    setInputValue('')
  }

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
      onClick={handleClick}
    />
  )
}

export default GooglePlacesAutocomplete
