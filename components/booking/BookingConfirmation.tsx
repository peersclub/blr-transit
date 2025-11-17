'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Users,
  Car,
  CreditCard,
  Download,
  Share2,
  Bell,
  Navigation,
  Home,
  Bus
} from 'lucide-react';
import { useState } from 'react';

interface BookingDetails {
  bookingId: string;
  userType: 'with-vehicle' | 'without-vehicle';
  route: {
    from: string;
    to: string;
    distance: string;
  };
  pickupPoint: {
    name: string;
    address: string;
    time: string;
    type: 'parking-hub' | 'bus-stop' | 'home-pickup-zone';
  };
  vehicle?: {
    type: string;
    registrationNumber: string;
    parkingSpot?: string;
  };
  homePickup?: {
    type: 'car' | 'bike';
    address: string;
    pickupTime: string;
  };
  bus: {
    vehicleType: string;
    seatNumbers: string[];
    departureTime: string;
    estimatedArrival: string;
  };
  pricing: {
    busTicket: number;
    parking?: number;
    homePickup?: number;
    total: number;
  };
  payment: {
    method: string;
    status: 'success' | 'pending';
  };
}

interface BookingConfirmationProps {
  bookingDetails: BookingDetails;
  onClose?: () => void;
  onDownload?: () => void;
}

export default function BookingConfirmation({ bookingDetails, onClose, onDownload }: BookingConfirmationProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [ticketShared, setTicketShared] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BLR Transit - Booking Confirmation',
          text: `Booking confirmed! ID: ${bookingDetails.bookingId}. Route: ${bookingDetails.route.from} to ${bookingDetails.route.to}`,
          url: window.location.href
        });
        setTicketShared(true);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const enableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          new Notification('BLR Transit', {
            body: 'Notifications enabled! You\'ll receive updates about your journey.',
            icon: '/logo.png'
          });
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 rounded-xl p-6 lg:p-8 max-w-4xl mx-auto"
    >
      {/* Success Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p className="text-gray-400">Your journey is all set. Here are your booking details.</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
          <span className="text-gray-400 text-sm">Booking ID:</span>
          <span className="text-white font-mono font-semibold">{bookingDetails.bookingId}</span>
        </div>
      </div>

      {/* Booking Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Journey Details */}
        <div className="bg-gray-800 rounded-lg p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-tech-purple" />
            Journey Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Route</p>
                <p className="text-white">
                  {bookingDetails.route.from} → {bookingDetails.route.to}
                </p>
                <p className="text-gray-500 text-xs mt-1">{bookingDetails.route.distance}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Departure</p>
                <p className="text-white">{bookingDetails.bus.departureTime}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Arrival: {bookingDetails.bus.estimatedArrival}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup/Parking Details */}
        <div className="bg-gray-800 rounded-lg p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            {bookingDetails.userType === 'with-vehicle' ? (
              <>
                <Car className="w-5 h-5 text-tech-purple" />
                Parking Details
              </>
            ) : (
              <>
                <Home className="w-5 h-5 text-tech-purple" />
                Pickup Details
              </>
            )}
          </h3>
          <div className="space-y-3">
            {bookingDetails.userType === 'with-vehicle' && bookingDetails.vehicle ? (
              <>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Parking Hub</p>
                    <p className="text-white">{bookingDetails.pickupPoint.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{bookingDetails.pickupPoint.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Vehicle</p>
                    <p className="text-white">{bookingDetails.vehicle.type}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {bookingDetails.vehicle.registrationNumber}
                      {bookingDetails.vehicle.parkingSpot && ` • Spot: ${bookingDetails.vehicle.parkingSpot}`}
                    </p>
                  </div>
                </div>
              </>
            ) : bookingDetails.homePickup ? (
              <>
                <div className="flex items-start gap-3">
                  <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm">Home Pickup</p>
                    <p className="text-white">{bookingDetails.homePickup.address}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Pickup by {bookingDetails.homePickup.type} at {bookingDetails.homePickup.pickupTime}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-400 text-sm">Pickup Point</p>
                  <p className="text-white">{bookingDetails.pickupPoint.name}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {bookingDetails.pickupPoint.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bus & Seat Details */}
        <div className="bg-gray-800 rounded-lg p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Bus className="w-5 h-5 text-tech-purple" />
            Bus Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Bus className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Vehicle</p>
                <p className="text-white">{bookingDetails.bus.vehicleType}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Seat Numbers</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {bookingDetails.bus.seatNumbers.map(seat => (
                    <span key={seat} className="px-2 py-1 bg-tech-purple/20 text-tech-purple rounded text-sm font-semibold">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-800 rounded-lg p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-tech-purple" />
            Payment Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Bus Ticket ({bookingDetails.bus.seatNumbers.length} seats)</span>
              <span className="text-white">₹{bookingDetails.pricing.busTicket}</span>
            </div>
            {bookingDetails.pricing.parking && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Parking Fee</span>
                <span className="text-white">₹{bookingDetails.pricing.parking}</span>
              </div>
            )}
            {bookingDetails.pricing.homePickup && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Home Pickup</span>
                <span className="text-white">₹{bookingDetails.pricing.homePickup}</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-white font-semibold">Total Paid</span>
                <span className="text-white font-bold text-lg">₹{bookingDetails.pricing.total}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-500 text-sm">
                Payment successful via {bookingDetails.payment.method}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-6 py-3 bg-tech-purple text-white rounded-lg font-semibold hover:bg-tech-purple/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Ticket
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          {ticketShared ? 'Shared!' : 'Share Ticket'}
        </button>

        {!notificationsEnabled && (
          <button
            onClick={enableNotifications}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            Enable Notifications
          </button>
        )}

        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Go Home
        </button>
      </div>

      {/* Important Notes */}
      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <h4 className="text-yellow-500 font-semibold mb-2 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Important Information
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Please arrive at the pickup point 10 minutes before departure</li>
          {bookingDetails.userType === 'with-vehicle' && (
            <li>• Your parking spot will be reserved until 9:00 PM</li>
          )}
          <li>• Keep your booking ID handy for verification</li>
          <li>• You will receive updates via SMS and app notifications</li>
          <li>• For support, call: +91 80 1234 5678</li>
        </ul>
      </div>
    </motion.div>
  );
}