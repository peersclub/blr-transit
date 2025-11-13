import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bangalore Traffic Solution | Smart Bus System for Office Commuters',
  description: 'An innovative special bus system to solve Bangalore\'s traffic crisis. Real-time data visualization and comprehensive solution for office commuters.',
  keywords: 'Bangalore traffic, smart bus system, office commute, traffic solution, public transport',
  openGraph: {
    title: 'Bangalore Traffic Solution',
    description: 'Revolutionary bus system for office commuters',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-bangalore-blue opacity-50 -z-10" />
        {children}
      </body>
    </html>
  )
}