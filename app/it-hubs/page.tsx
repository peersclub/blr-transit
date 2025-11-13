'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ITHubsSection from '@/components/sections/ITHubsSection';

export default function ITHubsPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-bangalore-blue opacity-70" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-tech-purple rounded-full opacity-30"
              initial={{
                x: Math.random() * 1920,
                y: Math.random() * 1080,
              }}
              animate={{
                x: Math.random() * 1920,
                y: Math.random() * 1080,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 glass-effect backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🚌</span>
            <span className="text-xl font-bold text-white">BLR Transit</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#data"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Traffic Data
            </Link>
            <Link
              href="/it-hubs"
              className="text-white font-semibold border-b-2 border-tech-purple"
            >
              IT Hubs
            </Link>
            <Link
              href="/#solution"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Solution
            </Link>
            <Link
              href="/#action"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Get Involved
            </Link>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-tech-purple to-bangalore-blue text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
            Contact Us
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20">
        <ITHubsSection />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🚌</span>
                <span className="text-xl font-bold text-white">BLR Transit</span>
              </div>
              <p className="text-sm text-gray-400">
                Transforming Bangalore's commute through innovative public transport solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/#data" className="text-gray-400 hover:text-white text-sm transition-colors">
                    View Data
                  </Link>
                </li>
                <li>
                  <Link href="/it-hubs" className="text-gray-400 hover:text-white text-sm transition-colors">
                    IT Hubs Info
                  </Link>
                </li>
                <li>
                  <Link href="/#solution" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Our Solution
                  </Link>
                </li>
                <li>
                  <Link href="/#action" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Get Involved
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 contact@blrtransit.in</li>
                <li>📱 +91 80 1234 5678</li>
                <li>📍 Bangalore, Karnataka</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">f</span>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">t</span>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">in</span>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 BLR Transit. All rights reserved. | Built with ❤️ for Bangalore
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-tech-purple to-bangalore-blue rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </main>
  );
}