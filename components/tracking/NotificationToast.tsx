'use client';

/**
 * Real-time Notification Toast System
 * =====================================
 * Toast notifications for trip updates
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Bell,
} from 'lucide-react';

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'trip';
  title: string;
  message: string;
  timestamp: Date;
  tripId?: string;
  duration?: number; // ms, 0 = persistent
}

// Context for managing notifications
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? 5000,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// Hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Toast container
function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual toast
function NotificationToast({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const icons = {
    info: Bell,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertTriangle,
    trip: Bus,
  };

  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    trip: 'bg-tech-purple',
  };

  const bgColors = {
    info: 'bg-blue-500/10 border-blue-500/30',
    success: 'bg-green-500/10 border-green-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    trip: 'bg-purple-500/10 border-purple-500/30',
  };

  const Icon = icons[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`pointer-events-auto w-full p-4 rounded-xl border backdrop-blur-lg shadow-lg ${bgColors[notification.type]}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colors[notification.type]}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{notification.title}</p>
          <p className="text-sm text-gray-300 mt-0.5">{notification.message}</p>
          {notification.tripId && (
            <p className="text-xs text-gray-500 mt-1">
              Trip: {notification.tripId}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      {notification.duration && notification.duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: notification.duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 right-0 h-1 origin-left rounded-b-xl ${colors[notification.type]}`}
        />
      )}
    </motion.div>
  );
}

// Standalone toast component for simple usage
export function Toast({
  type = 'info',
  title,
  message,
  isVisible,
  onClose,
}: {
  type?: 'info' | 'success' | 'warning' | 'error' | 'trip';
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <NotificationToast
          notification={{
            id: 'standalone',
            type,
            title,
            message,
            timestamp: new Date(),
          }}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
