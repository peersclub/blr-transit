'use client';

/**
 * Service Worker Provider
 * =======================
 * Provides service worker context and handles updates
 */

import { createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, WifiOff, X } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

interface ServiceWorkerContextType {
  isSupported: boolean;
  isRegistered: boolean;
  isOffline: boolean;
  hasUpdate: boolean;
  updateServiceWorker: () => void;
  requestNotificationPermission: () => Promise<boolean>;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(null);

export function useServiceWorkerContext() {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error('useServiceWorkerContext must be used within ServiceWorkerProvider');
  }
  return context;
}

export default function ServiceWorkerProvider({ children }: { children: ReactNode }) {
  const sw = useServiceWorker();

  return (
    <ServiceWorkerContext.Provider
      value={{
        isSupported: sw.isSupported,
        isRegistered: sw.isRegistered,
        isOffline: sw.isOffline,
        hasUpdate: sw.hasUpdate,
        updateServiceWorker: sw.updateServiceWorker,
        requestNotificationPermission: sw.requestNotificationPermission,
      }}
    >
      {children}

      {/* Offline Banner */}
      <AnimatePresence>
        {sw.isOffline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-yellow-500 text-black px-4 py-2"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">
                You're offline. Some features may be limited.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Banner */}
      <AnimatePresence>
        {sw.hasUpdate && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-[9999] max-w-md mx-auto"
          >
            <div className="bg-tech-purple text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm font-medium">New version available!</span>
              </div>
              <button
                onClick={sw.updateServiceWorker}
                className="px-4 py-1.5 bg-white text-tech-purple font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                Update
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ServiceWorkerContext.Provider>
  );
}
