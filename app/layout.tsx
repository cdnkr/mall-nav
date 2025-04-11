import type { Metadata } from 'next'

import {
  Gochi_Hand,
  JetBrains_Mono,
  Libre_Franklin,
  Oswald,
  Tiny5,
} from "next/font/google";

import './globals.css'

export const metadata: Metadata = {
  title: 'MallNav',
  description:
    'Select a mall, select a store, and see which direction it is from where you are.',
}


const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const gochiHand = Gochi_Hand({
  variable: "--font-gochi-hand",
  subsets: ["latin"],
  weight: ["400"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
});

const tiny5 = Tiny5({
  variable: "--font-tiny5",
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/192.png" />
        <meta name="theme-color" content="#222222" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body
        className={`${oswald.variable} ${libreFranklin.variable} ${jetBrainsMono.variable} ${gochiHand.variable} ${tiny5.variable} antialiased bg-background text-text`}
      >
        {children}
      </body>
    </html>
  )
}
