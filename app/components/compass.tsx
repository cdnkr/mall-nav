'use client'

import { useState } from 'react'
import { Switch } from '../ui/switch'
import { calculateBearing } from '../utils/geo'
import { GooglePlace } from './google-places-autocomplete'

interface Props {
  position: GeolocationPosition | null
  direction: { degrees: number; cardinal: string } | null
  toPlace: GooglePlace | null
}

export default function Compass({ position, direction, toPlace }: Props) {
  const [showNorth, setShowNorth] = useState(false)

  function isWithinRange() {
    if (!position || !toPlace) return false

    if (!toPlace.geometry || !toPlace.geometry.location) return false

    const bearing = calculateBearing(
      position.coords.latitude,
      position.coords.longitude,
      toPlace.geometry.location.lat(),
      toPlace.geometry.location.lng(),
    )

    return (
      bearing > (direction?.degrees || 0) - 30 &&
      bearing < (direction?.degrees || 0) + 30
    )
  }

  function renderPlaceOnCompass() {
    if (!position || !toPlace) return null

    if (!toPlace.geometry || !toPlace.geometry.location) return null

    const bearing = calculateBearing(
      position.coords.latitude,
      position.coords.longitude,
      toPlace.geometry.location.lat(),
      toPlace.geometry.location.lng(),
    )

    const angleInDegrees = bearing - (direction?.degrees || 0)

    return (
      <svg
        viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
        className={`absolute size-60 text-green-400 z-1 transition-opacity duration-300 ${isWithinRange() ? 'opacity-100' : 'opacity-75'}`}
        style={{
          transform: `rotate(${angleInDegrees}deg)`
        }}
        strokeWidth={1}
      >
        <g fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="48">
          <path d="m112 244 144-144 144 144"/>
          <path d="m256 120v292"/>
        </g>
      </svg>
    )
  }

  function renderNorthOnCompass() {
    const maxRadius = 140
    const scaledRadius = maxRadius
    // North is at 0 degrees, so we only need to calculate relative to current direction
    const angleInRadians = ((0 - (direction?.degrees || 0)) * Math.PI) / 180
    const x = scaledRadius * Math.sin(angleInRadians)
    const y = -scaledRadius * Math.cos(angleInRadians)

    return (
      <div
        className="absolute w-4 h-2 bg-red-700 z-1"
        style={{
          transform: `translate(${x}px, ${y}px) rotate(${angleInRadians * (180 / Math.PI)}deg)`,
        }}
      />
    )
  }

  return (
    <div className="space-y-4 text-white w-full flex flex-col items-center">
      <div className="h-auto w-[280px] aspect-square relative bg-black flex items-center justify-center rounded-full">
        <div className="flex flex-col items-center justify-center">
          {position && toPlace && renderPlaceOnCompass()}
        </div>
        {showNorth && renderNorthOnCompass()}
      </div>
      <div className="flex items-center space-x-2 pt-3">
        <Switch
          id="show-north"
          checked={showNorth}
          onCheckedChange={setShowNorth}
        />
        <label htmlFor="show-north" className="text-sm font-mono uppercase">
          Show North
        </label>
      </div>
    </div>
  )
}
