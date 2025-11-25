'use client';

/**
 * Tech Park Geographic Visualization
 * ===================================
 * Interactive map showing IT corridors and tech parks in Bangalore
 */

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Building2, Users, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface TechPark {
  name: string;
  companies: number;
  employees: number;
  coordinates: { lat: number; lng: number };
  area?: number;
}

interface TechParkMapProps {
  techParks: TechPark[];
  corridors?: Array<{
    name: string;
    path: Array<[number, number]>;
    color: string;
  }>;
  className?: string;
}

// Animate map bounds
function MapBoundsController({ techParks }: { techParks: TechPark[] }) {
  const map = useMap();

  useEffect(() => {
    if (techParks.length > 0) {
      const bounds = techParks.map(p => [p.coordinates.lat, p.coordinates.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, techParks]);

  return null;
}

export default function TechParkMap({ techParks, corridors = [], className = '' }: TechParkMapProps) {
  const [selectedPark, setSelectedPark] = useState<TechPark | null>(null);

  // Bangalore center
  const center: [number, number] = [12.9716, 77.6246];

  // Calculate radius based on employees (scaled for visibility)
  const getRadius = (employees: number) => {
    const base = Math.sqrt(employees) / 15;
    return Math.max(15, Math.min(base, 50));
  };

  // Color based on employee density
  const getColor = (employees: number) => {
    if (employees > 500000) return '#ef4444'; // Red - highest
    if (employees > 100000) return '#f97316'; // Orange
    if (employees > 50000) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  // Major IT corridors
  const defaultCorridors = [
    {
      name: 'Outer Ring Road',
      path: [
        [12.9698, 77.6000] as [number, number],
        [12.9536, 77.6396] as [number, number],
        [12.9350, 77.6800] as [number, number],
      ],
      color: '#6B46C1',
    },
    {
      name: 'Electronic City Corridor',
      path: [
        [12.9175, 77.6226] as [number, number], // Silk Board
        [12.8456, 77.6603] as [number, number], // EC
      ],
      color: '#003366',
    },
    {
      name: 'Whitefield Corridor',
      path: [
        [12.9562, 77.7019] as [number, number], // Marathahalli
        [12.9698, 77.7500] as [number, number], // Whitefield
      ],
      color: '#0066CC',
    },
  ];

  const corridorsToShow = corridors.length > 0 ? corridors : defaultCorridors;

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 text-sm">
        <p className="text-white font-semibold mb-2">Employee Density</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-300">500K+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-300">100K-500K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-gray-300">50K-100K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-300">&lt;50K</span>
          </div>
        </div>
      </div>

      {/* Selected Park Info */}
      {selectedPark && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 z-[1000] bg-gray-900/95 backdrop-blur-sm rounded-xl p-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-white">{selectedPark.name}</h4>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1 text-gray-300">
                  <Building2 className="w-4 h-4 text-tech-purple" />
                  <span>{selectedPark.companies}+ companies</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{(selectedPark.employees / 1000).toFixed(0)}K employees</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedPark(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', minHeight: '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapBoundsController techParks={techParks} />

        {/* IT Corridors */}
        {corridorsToShow.map((corridor, index) => (
          <Polyline
            key={index}
            positions={corridor.path}
            pathOptions={{
              color: corridor.color,
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 5',
            }}
          />
        ))}

        {/* Tech Parks as Circles */}
        {techParks.map((park, index) => (
          <CircleMarker
            key={index}
            center={[park.coordinates.lat, park.coordinates.lng]}
            radius={getRadius(park.employees)}
            pathOptions={{
              color: getColor(park.employees),
              fillColor: getColor(park.employees),
              fillOpacity: 0.6,
              weight: 2,
            }}
            eventHandlers={{
              click: () => setSelectedPark(park),
            }}
          >
            <Popup>
              <div className="text-center p-1">
                <strong className="text-gray-900">{park.name}</strong>
                <br />
                <span className="text-sm text-gray-600">
                  {(park.employees / 1000).toFixed(0)}K employees
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Custom CSS for dark theme */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          background: white;
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
}
