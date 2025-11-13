'use client';

import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  residentialAreas,
  itHubs,
  commuterFlows,
  getFlowsToHub,
  type Location
} from '@/lib/data/bangaloreLocations';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for IT hubs
const itHubIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#ef4444; width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-weight: bold; color: white; font-size: 10px;'>IT</div>",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Custom icon for residential areas
const residentialIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#3b82f6; width: 1.5rem; height: 1.5rem; border-radius: 50%; border: 2px solid white;'></div>",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Custom icon for mixed areas
const mixedIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#eab308; width: 1.5rem; height: 1.5rem; border-radius: 50%; border: 2px solid white;'></div>",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Major roads data
const majorRoads = [
  {
    name: 'Outer Ring Road',
    points: [[13.0358, 77.5946], [12.9536, 77.6396], [12.9215, 77.6876], [12.9562, 77.7019], [12.9856, 77.6646], [13.0452, 77.6201]] as [number, number][],
    congestion: 'severe'
  },
  {
    name: 'Hosur Road (NH-75)',
    points: [[12.9250, 77.5938], [12.9165, 77.6101], [12.9081, 77.6476], [12.8456, 77.6603]] as [number, number][],
    congestion: 'severe'
  },
  {
    name: 'Sarjapur Road',
    points: [[12.9352, 77.6245], [12.9081, 77.6476], [12.9010, 77.6850]] as [number, number][],
    congestion: 'high'
  },
  {
    name: 'Whitefield Road',
    points: [[12.9716, 77.6412], [12.9562, 77.7019], [12.9698, 77.7500]] as [number, number][],
    congestion: 'high'
  },
];

export default function BangaloreMapOSM() {
  const [selectedHub, setSelectedHub] = useState<Location | null>(null);
  const [center] = useState<[number, number]>([12.9716, 77.5946]);
  const [zoom] = useState(11);

  const handleHubClick = useCallback((hub: Location) => {
    setSelectedHub(hub);
  }, []);

  // Get traffic flows for selected hub
  const flowLines = selectedHub ? getFlowsToHub(selectedHub.name) : [];

  // Get color based on congestion level
  const getFlowColor = (congestionLevel: string) => {
    switch (congestionLevel) {
      case 'severe': return '#FF0000';
      case 'high': return '#FF6600';
      case 'medium': return '#FFAA00';
      default: return '#00FF00';
    }
  };

  const getRoadColor = (congestion: string) => {
    switch (congestion) {
      case 'severe': return '#FF0000';
      case 'high': return '#FF6600';
      default: return '#FFAA00';
    }
  };

  return (
    <div className="w-full h-[700px] relative rounded-3xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ background: '#1a1a1a' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Major Roads */}
        {majorRoads.map((road, index) => (
          <Polyline
            key={index}
            positions={road.points}
            color={getRoadColor(road.congestion)}
            weight={4}
            opacity={0.7}
          />
        ))}

        {/* Traffic flow lines when hub is selected */}
        {selectedHub && flowLines.map((flow, index) => {
          const fromLocation = [...residentialAreas, ...itHubs].find(loc => loc.name === flow.from);
          const toLocation = [...residentialAreas, ...itHubs].find(loc => loc.name === flow.to);

          if (!fromLocation || !toLocation) return null;

          const positions: [number, number][] = [
            [fromLocation.coordinates.lat, fromLocation.coordinates.lng],
            [toLocation.coordinates.lat, toLocation.coordinates.lng]
          ];

          return (
            <Polyline
              key={index}
              positions={positions}
              color={getFlowColor(flow.congestionLevel)}
              weight={Math.max(2, Math.min(8, flow.dailyCommuters / 5000))}
              opacity={0.7}
              dashArray="10, 10"
            />
          );
        })}

        {/* IT Hub markers with enriched popups */}
        {itHubs.map(hub => (
          <Marker
            key={hub.name}
            position={[hub.coordinates.lat, hub.coordinates.lng]}
            icon={itHubIcon}
            eventHandlers={{
              click: () => handleHubClick(hub),
            }}
          >
            <Popup className="custom-popup" maxWidth={350}>
              <div className="p-3">
                <h3 className="font-bold text-lg mb-2">{hub.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">IT Hub</span>
                  </div>
                  {hub.employees && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Employees:</span>
                      <span className="font-semibold">{hub.employees.toLocaleString()}</span>
                    </div>
                  )}
                  {hub.biggestEmployer && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Biggest Employer:</span>
                      <span className="font-semibold">{hub.biggestEmployer.name} ({hub.biggestEmployer.employees.toLocaleString()})</span>
                    </div>
                  )}
                  {hub.majorCompanies && (
                    <div className="mt-2">
                      <span className="text-gray-600">Major Companies:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {hub.majorCompanies.slice(0, 5).map((company, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {company}
                          </span>
                        ))}
                        {hub.majorCompanies.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{hub.majorCompanies.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {hub.servicesUsed && (
                    <div className="mt-2">
                      <span className="text-gray-600">Transportation Services:</span>
                      <div className="mt-1 space-y-1">
                        {hub.servicesUsed.filter(s => s.type === 'shuttle' || s.type === 'carpool').slice(0, 3).map((service, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span>{service.name}</span>
                            <span className="font-semibold">{service.users.toLocaleString()} users</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {hub.parkingSpaces && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parking Spaces:</span>
                      <span className="font-semibold">{hub.parkingSpaces.toLocaleString()}</span>
                    </div>
                  )}
                  {hub.busRoutes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bus Routes:</span>
                      <span className="font-semibold">{hub.busRoutes}</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Residential area markers with enriched popups */}
        {residentialAreas.map(area => (
          <Marker
            key={area.name}
            position={[area.coordinates.lat, area.coordinates.lng]}
            icon={area.type === 'mixed' ? mixedIcon : residentialIcon}
          >
            <Popup className="custom-popup" maxWidth={350}>
              <div className="p-3">
                <h3 className="font-bold text-lg mb-2">{area.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold capitalize">{area.type}</span>
                  </div>
                  {area.population && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population:</span>
                      <span className="font-semibold">{area.population.toLocaleString()}</span>
                    </div>
                  )}
                  {area.vehicles && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registered Vehicles:</span>
                      <span className="font-semibold">{area.vehicles.toLocaleString()}</span>
                    </div>
                  )}
                  {area.apartments && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Apartments/Complexes:</span>
                      <span className="font-semibold">{area.apartments.toLocaleString()}</span>
                    </div>
                  )}
                  {area.avgRent && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Rent (2BHK):</span>
                      <span className="font-semibold">₹{area.avgRent.toLocaleString()}</span>
                    </div>
                  )}
                  {area.professionCategories && (
                    <div className="mt-2">
                      <span className="text-gray-600">Profession Distribution:</span>
                      <div className="mt-1 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>IT/Software:</span>
                          <span className="font-semibold">{area.professionCategories.IT}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Finance/Banking:</span>
                          <span className="font-semibold">{area.professionCategories.Finance}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Healthcare:</span>
                          <span className="font-semibold">{area.professionCategories.Healthcare}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Others:</span>
                          <span className="font-semibold">{area.professionCategories.Others}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {area.density && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Density:</span>
                      <span className="font-semibold">{area.density.toLocaleString()} /sq.km</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Heat map circles for population density */}
        {[...residentialAreas, ...itHubs].map(location => (
          <CircleMarker
            key={`heat-${location.name}`}
            center={[location.coordinates.lat, location.coordinates.lng]}
            radius={location.type === 'it-hub' ?
              Math.sqrt((location.employees || 100000) / 2000) :
              Math.sqrt((location.population || 100000) / 3000)
            }
            fillColor="#ff4444"
            fillOpacity={0.2}
            stroke={false}
          />
        ))}
      </MapContainer>

      {/* Info Panel with improved contrast */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 max-w-xs z-[1000] shadow-lg">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Bangalore Traffic Map</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">IT Hubs (Click to see traffic origins)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Residential Areas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Mixed Areas</span>
          </div>
        </div>

        {selectedHub && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-gray-900 font-bold mb-2">{selectedHub.name}</p>
            <p className="text-gray-600 text-xs">
              Showing traffic flows from residential areas
            </p>
            <button
              onClick={() => setSelectedHub(null)}
              className="mt-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Statistics Panel with improved contrast */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 z-[1000] shadow-lg">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-gray-900">21</p>
            <p className="text-xs text-gray-600 font-medium">Residential Areas</p>
          </div>
          <div>
            <p className="text-xl font-bold text-red-600">11</p>
            <p className="text-xs text-gray-600 font-medium">Major IT Hubs</p>
          </div>
          <div>
            <p className="text-xl font-bold text-yellow-600">1M+</p>
            <p className="text-xs text-gray-600 font-medium">Daily Commuters</p>
          </div>
          <div>
            <p className="text-xl font-bold text-orange-600">34 min</p>
            <p className="text-xs text-gray-600 font-medium">For 10km (2024)</p>
          </div>
        </div>
      </div>
    </div>
  );
}