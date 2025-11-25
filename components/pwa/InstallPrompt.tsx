'use client';

/**
 * PWA Install Prompt Component
 * ============================
 * Shows a banner prompting users to install the app
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap, Wifi } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed before (don't show for 7 days)
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 30 seconds of browsing
      setTimeout(() => setShowBanner(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        setShowBanner(false);
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error('Install prompt error:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't render if already installed or no prompt available
  if (isInstalled || !showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] max-w-lg mx-auto"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 shadow-2xl border border-gray-700">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              {/* App Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-tech-purple to-bangalore-blue rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-7 h-7 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  Install BLR Transit
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Get the full app experience on your device
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>Faster</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span>Works Offline</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Download className="w-3 h-3 text-blue-500" />
                    <span>No App Store</span>
                  </div>
                </div>

                {/* Install Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstall}
                  className="w-full py-3 bg-gradient-to-r from-tech-purple to-bangalore-blue text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Install Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// iOS-specific install instructions (shown in a modal)
export function IOSInstallInstructions({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/80 flex items-end justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-t-3xl p-6 w-full max-w-md"
      >
        <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />

        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Install on iOS
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">1</span>
            </div>
            <p className="text-gray-300">
              Tap the <strong>Share</strong> button in Safari
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">2</span>
            </div>
            <p className="text-gray-300">
              Scroll and tap <strong>"Add to Home Screen"</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">3</span>
            </div>
            <p className="text-gray-300">
              Tap <strong>"Add"</strong> to install
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gray-800 text-white font-semibold rounded-xl"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}
