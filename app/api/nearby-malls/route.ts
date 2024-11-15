import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=shopping_mall&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()

  return NextResponse.json(data)
}
