'use client'

import useDeviceOrientation from '@/app/hooks/use-device-orientation'
import useGeolocation from '@/app/hooks/use-geolocation'
import { Car, Compass as CompassIcon, MapPinCheck, Navigation, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import Compass from './compass'
import GooglePlacesAutocomplete, {
  GooglePlace,
} from './google-places-autocomplete'
import InstallButton from './install-pwa'
import Image from 'next/image'
import { BoundingBox, getBoundingBox } from '../utils/geo'

export default function Main() {
  const {
    position,
    requestPermission: requestGeolocationPermission,
  } = useGeolocation()
  const {
    permission: compassPermission,
    direction,
    hasSupport: hasDeviceOrientationSupport,
    requestPermission: requestCompassPermission,
  } = useDeviceOrientation({ userPosition: position })

  const [mall, setMall] = useState<GooglePlace | null>(null)
  const [mallBoundingBox, setMallBoundingBox] = useState<BoundingBox | null>(null)
  const [store, setStore] = useState<GooglePlace | null>(null)
  const [autoDetectedMall, setAutoDetectedMall] = useState<boolean>(false)
  const [parkedCarLocation, setParkedCarLocation] = useState<GooglePlace | null>(null)
  const [isNavigatingToParkedCarLocation, setIsNavigatingToParkedCarLocation] = useState<boolean>(false)
  // Add auto detection of closest mall
  // Function to fetch nearby malls
  async function findClosestMall() {
    if (!position) return
    const lat = position.coords.latitude
    const lng = position.coords.longitude

    try {
      const response = await fetch(`/api/nearby-malls?lat=${lat}&lng=${lng}`)
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const closestMall = data.results[0]
        if (closestMall.types.includes('shopping_mall')) {
          // Convert the API response to GooglePlace format
          const convertedMall: GooglePlace = {
            ...closestMall,
            geometry: {
              ...closestMall.geometry,
              location: {
                lat: () => closestMall.geometry.location.lat,
                lng: () => closestMall.geometry.location.lng
              }
            }
          }

          setMall(convertedMall)
          setAutoDetectedMall(true)
        }
      } else {
        console.log("No malls found nearby.")
      }
    } catch (error) {
      console.error("Error fetching malls:", error)
    }
  }

  async function onRequestPermission() {
    await requestCompassPermission()
    await requestGeolocationPermission()
  }

  function onMarkParkedCarLocation() {
    if (!position) return

    // Convert position to GooglePlace format with minimal required properties
    const carLocation: GooglePlace = {
      geometry: {
        location:
          new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      }
    }
    setParkedCarLocation(carLocation)
  }

  function onNavigateToParkedCarLocation() {
    setIsNavigatingToParkedCarLocation(true)
  }

  useEffect(() => {
    findClosestMall()
  }, [position])

  useEffect(() => {
    if (!mall || !mall.geometry || !mall.geometry.location) return

    const boundingBox = getBoundingBox(mall.geometry.location.lat(), mall.geometry.location.lng(), 2)
    setMallBoundingBox(boundingBox)
  }, [mall])

  return (
    <div className='md:pt-8'>
      <div className="pt-4 pb-4 pl-4 pr-4 md:pt-4 md:pb-12 md:pl-8 md:pr-8 max-w-screen-sm mx-auto w-full space-y-4 bg-[#111111] rounded-xl">
        <div>
          <div className="flex justify-center items-start gap-4">
            <div className='rounded-xl overflow-hidden bg-black shrink-0'>
              <Image
                src="/icons/512.png"
                alt="Compass disabled"
                width={70}
                height={70}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MallNav</h1>
              <p className="text-gray-400 text-base leading-tight">
                Select a mall, select a store, and see which direction it is from where you are. <i>Or find your parked car.</i>
              </p>
            </div>
          </div>
        </div>
        {!hasDeviceOrientationSupport && (
          <div className="mt-3">
            <p className="text-red-700 border border-red-700 rounded-md p-2">
              <b>Your device does not support the compass feature.</b>
              <br />
              This app will not work on your device.
            </p>
          </div>
        )}
        <hr className="border-gray-700" />
        {compassPermission !== 'granted' ? (
          <button
            onClick={onRequestPermission}
            className="px-2 py-4 rounded-md w-full cursor-pointer flex items-center justify-center gap-2 bg-violet-700 leading-none text-center"
          >
            <CompassIcon className="size-6" />
            Enable Compass and Location
          </button>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              {!isNavigatingToParkedCarLocation && (
                <>
                  {!parkedCarLocation ? (
                    <div className='flex items-center justify-center gap-4'>
                      <div className='flex flex-col items-center gap-2 w-full max-w-[240px]'>
                        <button
                          onClick={onMarkParkedCarLocation}
                          className="px-6 py-4 w-full rounded-md cursor-pointer flex items-center justify-center gap-2 bg-violet-700 leading-none text-center"
                        >
                          <Car className="size-6" />
                          Set parking location
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className='flex items-center justify-center gap-4'>
                      <div className='flex flex-col items-center gap-2 min-w-[160px]'>
                        <button
                          onClick={onNavigateToParkedCarLocation}
                          className="px-6 py-4 w-full rounded-md cursor-pointer flex items-center justify-center gap-2 bg-violet-700 leading-none text-center"
                        >
                          <Car className="size-6" />
                        </button>
                        <span className='text-gray-400 text-sm'>Go to parked car</span>
                      </div>
                      <div className='flex flex-col items-center gap-2 min-w-[160px]'>
                        <button
                          onClick={() => setParkedCarLocation(null)}
                          className="px-6 py-4 w-full rounded-md cursor-pointer flex items-center justify-center gap-2 bg-red-700 leading-none text-center"
                        >
                          <Trash className="size-6" />
                        </button>
                        <span className='text-gray-400 text-sm'>Clear parking location</span>
                      </div>
                    </div>
                  )}
                  <hr className="border-gray-700" />
                </>
              )}
              {!isNavigatingToParkedCarLocation ? (
                <>
                  <div className='space-y-1'>
                    <GooglePlacesAutocomplete
                      place={mall}
                      onPlaceSelected={setMall}
                      placeholder="Search for a mall"
                      onClick={() => setAutoDetectedMall(false)}
                    />
                    {autoDetectedMall && (
                      <div className='w-full flex items-center gap-2 text-blue text-sm'><div className='size-2 rounded-full bg-blue' />Auto detected mall</div>
                    )}
                  </div>
                  {mall && mallBoundingBox && (
                    <GooglePlacesAutocomplete
                      bounds={mallBoundingBox}
                      place={store}
                      onPlaceSelected={setStore}
                      placeholder="Search for a store"
                    />
                  )}
                </>
              ) : (
                <div className='text-white text-center text-xl'>
                  Navigating to your parking <span className='text-red-700 underline cursor-pointer ml-1' onClick={() => setIsNavigatingToParkedCarLocation(false)}>Cancel</span>
                </div>
              )}
            </div>
            {(store || (parkedCarLocation && isNavigatingToParkedCarLocation)) && (
              <Compass
                position={position}
                direction={direction}
                toPlace={isNavigatingToParkedCarLocation ? parkedCarLocation : store}
              />
            )}
          </div>
        )}
        <InstallButton />
      </div>
    </div>
  )
}