'use client';

/**
 * Offline Page
 * ============
 * Shown when user is offline and page isn't cached
 */

import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Offline Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="w-24 h-24 mx-auto mb-8 bg-gray-800 rounded-full flex items-center justify-center"
        >
          <WifiOff className="w-12 h-12 text-gray-400" />
        </motion.div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          You're Offline
        </h1>
        <p className="text-gray-400 mb-8">
          It looks like you've lost your internet connection.
          Don't worry - your bookings are saved and will sync when you're back online.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-tech-purple text-white font-semibold rounded-xl hover:bg-tech-purple/80 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </Link>
        </div>

        {/* Cached Features */}
        <div className="mt-12 p-6 bg-gray-800/50 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">
            Available Offline
          </h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              View cached routes and schedules
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Access your booking history
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              View saved pickup points
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full" />
              Queue bookings (sync when online)
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
