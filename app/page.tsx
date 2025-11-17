'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';
import DataVisualization from '@/components/sections/DataVisualization';
import SolutionPresentation from '@/components/sections/SolutionPresentation';
import CallToAction from '@/components/sections/CallToAction';
import { motion } from 'framer-motion';

export default function Home() {
  useEffect(() => {
    // Smooth scroll polyfill for older browsers
    if (typeof window !== 'undefined' && !('scrollBehavior' in document.documentElement.style)) {
      import('smoothscroll-polyfill').then((smoothscroll) => {
        smoothscroll.polyfill();
      });
    }
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-bangalore-blue opacity-70" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 glass-effect backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🚌</span>
            <span className="text-xl font-bold text-white">BLR Transit</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#home"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#data"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Data
            </a>
            <a
              href="/transport"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Transport
            </a>
            <a
              href="/plan"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Park & Ride
            </a>
            <a
              href="/it-hubs"
              className="text-gray-300 hover:text-white transition-colors"
            >
              IT Hubs
            </a>
            <a
              href="#solution"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Solution
            </a>
            <a
              href="#action"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Get Involved
            </a>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-tech-purple to-bangalore-blue text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
            Contact Us
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <section id="home">
          <HeroSection />
        </section>

        {/* Data Visualization Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50" />
          <DataVisualization />
        </section>

        {/* Solution Presentation */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50" />
          <SolutionPresentation />
        </section>

        {/* Call to Action */}
        <section className="relative">
          <CallToAction />
        </section>

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
                    <a href="#data" className="text-gray-400 hover:text-white text-sm transition-colors">
                      View Data
                    </a>
                  </li>
                  <li>
                    <a href="/it-hubs" className="text-gray-400 hover:text-white text-sm transition-colors">
                      IT Hubs Info
                    </a>
                  </li>
                  <li>
                    <a href="#solution" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Our Solution
                    </a>
                  </li>
                  <li>
                    <a href="#action" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Get Involved
                    </a>
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
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
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