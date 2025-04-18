## MallNav

Select a mall (or auto-detect based on your your current location), select a store, and see which direction it is from where you are. Or find where you parked.

![Screenshot](./public/screenshots/1.jpg)

## Getting started

1. Run `pnpm i` followed by `pnpm dev` to install the dependencies and start the development server.
2. Add your API keys to the `.env` file.

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: The Google Maps API is used on the Google Places Autocomplete component.
- `NEXT_PUBLIC_NOAA_API_KEY`: The NOAA API is used to get magnetic declination. Get your key [here](https://www.ngdc.noaa.gov/geomag/CalcSurvey.shtml). Complete the usage survey and you'll be provided with an API key.

3. Navigate to [http://localhost:3000](http://localhost:3000).

### Setting Up a Development SSL Certificate for Local testing

See: [Setting Up a Development SSL Certificate for Local testing in Next.js 15](https://gist.github.com/cdnkr/7e56cfb86f255877df99f0d7a2d57d34)

### Setting up a PWA in Next.js 15

See: [Setting up a PWA in Next.js 15](https://gist.github.com/cdnkr/25d3746bdb35767d66c7ae6d26c2ed98)
