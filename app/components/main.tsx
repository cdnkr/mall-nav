'use client'

import useDeviceOrientation from '@/app/hooks/use-device-orientation'
import useGeolocation from '@/app/hooks/use-geolocation'
import { Car, Compass as CompassIcon, Trash } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { BoundingBox, getBoundingBox } from '../utils/geo'
import { CalibrateInstructions } from './calibrate-instructions'
import Compass from './compass'
import GooglePlacesAutocomplete, {
  GooglePlace,
} from './google-places-autocomplete'
import InstallButton from './install-pwa'
import Button from '../ui/button'

export default function Main() {
  const { position, requestPermission: requestGeolocationPermission } =
    useGeolocation()
  const {
    permission: compassPermission,
    direction,
    hasSupport: hasDeviceOrientationSupport,
    requestPermission: requestCompassPermission,
    needsCalibration,
    setNeedsCalibration,
  } = useDeviceOrientation({ userPosition: position })

  const [mall, setMall] = useState<GooglePlace | null>(null)
  const [mallBoundingBox, setMallBoundingBox] = useState<BoundingBox | null>(
    null,
  )
  const [store, setStore] = useState<GooglePlace | null>(null)
  const [autoDetectedMall, setAutoDetectedMall] = useState<boolean>(false)
  const [parkedCarLocation, setParkedCarLocation] =
    useState<GooglePlace | null>(null)
  const [isNavigatingToParkedCarLocation, setIsNavigatingToParkedCarLocation] =
    useState<boolean>(false)

  // Function to fetch nearby malls and set the closest one
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
                lng: () => closestMall.geometry.location.lng,
              },
            },
          }

          setMall(convertedMall)
          setAutoDetectedMall(true)
        }
      } else {
        console.log('No malls found nearby.')
      }
    } catch (error) {
      console.error('Error fetching malls:', error)
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
        location: new window.google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        ),
      },
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

    const boundingBox = getBoundingBox(
      mall.geometry.location.lat(),
      mall.geometry.location.lng(),
      2,
    )
    setMallBoundingBox(boundingBox)
  }, [mall])

  return (
    <div className="">
      <div className="pt-4 pb-4 pl-4 pr-4 md:pt-8 md:pb-8 md:pl-8 md:pr-8 max-w-screen-md mx-auto w-full space-y-6 lg:bg-black/20">
        <div>
          <div className="flex justify-center items-start gap-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="font-oswald text-center text-[5rem] lg:text-[9rem] text-white uppercase font-black tracking-tight leading-none transition-all duration-300">MallNav</h1>
              {compassPermission !== 'granted' && (
                <p className="text-gray-300 text-base leading-tight text-center font-mono max-w-screen-sm">
                  Select a mall, select a store, and see which direction it is
                  from where you are. <i>Or find your parked car.</i>
                </p>
              )}

            </div>
          </div>
        </div>
        {!hasDeviceOrientationSupport && (
          <div className="mt-3">
            <p className="text-red-700 border border-red-700 p-2 font-mono bg-black">
              <b>Your device does not support the compass feature.</b>
              <br />
              This app will not work on your device.
            </p>
          </div>
        )}
        {/* <hr className="border-gray-400" /> */}
        {compassPermission !== 'granted' ? (
          <Button
            onClick={onRequestPermission}
            className="w-full gap-3"
          >
            <CompassIcon className="size-5" />
            Enable Compass & Location
          </Button>
        ) : (
          <div className="space-y-8">
            <div className="space-y-8">
              {!isNavigatingToParkedCarLocation && (
                <>
                  {!parkedCarLocation ? (
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Button
                          onClick={onMarkParkedCarLocation}
                          className="w-full"
                        >
                          <Car className="size-6" />
                          Set parking location
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Button
                          onClick={onNavigateToParkedCarLocation}
                          className="w-full"
                        >
                          Go to parked car
                        </Button>
                      </div>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Button
                          onClick={() => setParkedCarLocation(null)}
                          className="w-full"
                        >
                          Clear parking location
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* <hr className="border-gray-400" /> */}
                </>
              )}
              {!isNavigatingToParkedCarLocation ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <GooglePlacesAutocomplete
                      place={mall}
                      onPlaceSelected={setMall}
                      placeholder="Search for a mall"
                      onClick={() => setAutoDetectedMall(false)}
                    />
                    {autoDetectedMall && (
                      <div className="w-full flex items-center gap-2 text-blue text-sm text-green-400 font-mono">
                        <div className="size-2 bg-green-400" />
                        Auto detected mall
                      </div>
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
                </div>
              ) : (
                <div className="text-white text-center text-xl font-mono">
                  Navigating to your parking{' '}
                  <span
                    className="text-red-700 underline cursor-pointer ml-1"
                    onClick={() => setIsNavigatingToParkedCarLocation(false)}
                  >
                    Cancel
                  </span>
                </div>
              )}
            </div>
            {(store ||
              (parkedCarLocation && isNavigatingToParkedCarLocation)) && (
                <Compass
                  position={position}
                  direction={direction}
                  toPlace={
                    isNavigatingToParkedCarLocation ? parkedCarLocation : store
                  }
                />
              )}
          </div>
        )}
        <InstallButton />
        <CalibrateInstructions
          needsCalibration={needsCalibration}
          setNeedsCalibration={setNeedsCalibration}
        />
      </div>
    </div>
  )
}
