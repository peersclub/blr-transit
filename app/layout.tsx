import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorkerProvider from '@/components/pwa/ServiceWorkerProvider'
import InstallPrompt from '@/components/pwa/InstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BLR Transit | Smart Shuttle Service for Bangalore',
  description: 'An innovative smart shuttle bus system to solve Bangalore\'s traffic crisis. Real-time tracking, easy booking, and hassle-free commute for office goers.',
  keywords: 'Bangalore traffic, smart bus system, office commute, traffic solution, public transport, shuttle service, BLR Transit',
  authors: [{ name: 'BLR Transit' }],
  creator: 'BLR Transit',
  publisher: 'BLR Transit',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BLR Transit',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://blrtransit.com',
    siteName: 'BLR Transit',
    title: 'BLR Transit - Smart Shuttle Service',
    description: 'Revolutionary shuttle bus system for Bangalore office commuters. Beat the traffic, save time.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BLR Transit - Smart Shuttle Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLR Transit - Smart Shuttle Service',
    description: 'Revolutionary shuttle bus system for Bangalore office commuters',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6B46C1' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BLR Transit" />
        <meta name="application-name" content="BLR Transit" />
        <meta name="msapplication-TileColor" content="#6B46C1" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Splash screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1125-2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1242-2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-750-1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-640-1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        />
      </head>
      <body className={`${inter.className} bg-black`}>
        <ServiceWorkerProvider>
          <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-bangalore-blue opacity-50 -z-10" />
          {children}
          <InstallPrompt />
        </ServiceWorkerProvider>
      </body>
    </html>
  )
}
