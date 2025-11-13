'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  residentialAreas,
  itHubs,
  commuterFlows,
  getFlowsToHub,
  calculateTrafficDensity,
  type Location,
  type CommuterFlow,
} from '@/lib/data/bangaloreLocations';

// Camera Controller
function CameraController({ target }: { target: [number, number, number] | null }) {
  const { camera } = useThree();

  useEffect(() => {
    if (target) {
      // Animate camera to target position
      const targetPosition = new THREE.Vector3(...target);
      const startPosition = camera.position.clone();

      let progress = 0;
      const animateCamera = () => {
        progress += 0.02;
        if (progress <= 1) {
          camera.position.lerpVectors(startPosition, targetPosition, progress);
          camera.lookAt(0, 0, 0);
          requestAnimationFrame(animateCamera);
        }
      };
      animateCamera();
    }
  }, [target, camera]);

  return null;
}

// Heat Map Plane
function HeatMapPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  const heatMapTexture = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const lat = 12.7 + (y / size) * 0.6; // Bangalore latitude range
        const lng = 77.4 + (x / size) * 0.5; // Bangalore longitude range

        const density = calculateTrafficDensity(lat, lng);
        const idx = (y * size + x) * 4;

        // Create color gradient from blue (low) to red (high)
        if (density < 33) {
          data[idx] = 0; // R
          data[idx + 1] = Math.floor((density / 33) * 255); // G
          data[idx + 2] = 255 - Math.floor((density / 33) * 255); // B
        } else if (density < 66) {
          data[idx] = Math.floor(((density - 33) / 33) * 255); // R
          data[idx + 1] = 255; // G
          data[idx + 2] = 0; // B
        } else {
          data[idx] = 255; // R
          data[idx + 1] = 255 - Math.floor(((density - 66) / 34) * 255); // G
          data[idx + 2] = 0; // B
        }
        data[idx + 3] = Math.floor(density * 2.55); // Alpha based on density
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial
        map={heatMapTexture}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Location Marker Component
function LocationMarker({
  location,
  isSelected,
  onClick,
}: {
  location: Location;
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const position: [number, number, number] = [
    (location.coordinates.lng - 77.65) * 100,
    location.type === 'it-hub' ? 1.2 : 0.8,
    (location.coordinates.lat - 12.95) * 100,
  ];

  useFrame((state) => {
    if (meshRef.current) {
      if (location.type === 'it-hub') {
        meshRef.current.rotation.y = state.clock.elapsedTime;
      }
      const scale = isSelected ? 1.5 : hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }

    // Animate ring pulse for IT hubs
    if (ringRef.current && location.type === 'it-hub') {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      ringRef.current.scale.set(pulseScale, pulseScale, 1);
    }
  });

  const color = location.type === 'it-hub' ? '#FF4444' : location.type === 'mixed' ? '#FFAA00' : '#4444FF';

  return (
    <group position={position}>
      {/* Main marker */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        {location.type === 'it-hub' ? (
          <coneGeometry args={[0.8, 2, 8]} />
        ) : (
          <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.5 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Pulse ring for IT hubs */}
      {location.type === 'it-hub' && (
        <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.8, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isSelected ? 0.8 : hovered ? 0.5 : 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Glow effect when hovered or selected */}
      {(hovered || isSelected) && (
        <pointLight
          position={[0, 0.5, 0]}
          color={color}
          intensity={isSelected ? 2 : 1}
          distance={5}
        />
      )}
    </group>
  );
}

// Traffic Flow Line using Tube Geometry for better visibility
function TrafficFlowLine({ flow, isActive }: { flow: CommuterFlow; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const fromLocation = [...residentialAreas, ...itHubs].find(loc => loc.name === flow.from);
  const toLocation = [...residentialAreas, ...itHubs].find(loc => loc.name === flow.to);

  if (!fromLocation || !toLocation) return null;

  const { tubeGeometry, curve } = useMemo(() => {
    const from = new THREE.Vector3(
      (fromLocation.coordinates.lng - 77.65) * 100,
      0.5,
      (fromLocation.coordinates.lat - 12.95) * 100
    );
    const to = new THREE.Vector3(
      (toLocation.coordinates.lng - 77.65) * 100,
      0.5,
      (toLocation.coordinates.lat - 12.95) * 100
    );

    // Create curved path
    const midPoint = from.clone().add(to).multiplyScalar(0.5);
    midPoint.y = 3 + Math.random() * 2; // Raise middle point for arc effect with variation

    const curve = new THREE.QuadraticBezierCurve3(from, midPoint, to);

    // Create tube geometry for better visibility
    const tubeRadius = Math.max(0.05, Math.min(0.3, flow.dailyCommuters / 50000));
    const tubeGeometry = new THREE.TubeGeometry(curve, 32, tubeRadius, 8, false);

    return { tubeGeometry, curve };
  }, [fromLocation, toLocation, flow.dailyCommuters]);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  const congestionColor =
    flow.congestionLevel === 'severe' ? '#FF0000' :
    flow.congestionLevel === 'high' ? '#FF6600' :
    flow.congestionLevel === 'medium' ? '#FFAA00' :
    '#00FF00';

  if (!isActive) return null;

  return (
    <group>
      {/* Main flow line */}
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color={congestionColor}
          emissive={congestionColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Animated flow particles */}
      <FlowParticles curve={curve} color={congestionColor} />
    </group>
  );
}

// Animated particles flowing along the route
function FlowParticles({ curve, color }: { curve: THREE.QuadraticBezierCurve3; color: string }) {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 10;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const point = curve.getPoint(t);
      pos[i * 3] = point.x;
      pos[i * 3 + 1] = point.y;
      pos[i * 3 + 2] = point.z;
    }
    return pos;
  }, [curve]);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < particleCount; i++) {
        const t = ((i / particleCount) + time * 0.2) % 1;
        const point = curve.getPoint(t);
        positions.setXYZ(i, point.x, point.y, point.z);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.3}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Main Scene Component
function TrafficScene({ selectedHub, onHubClick }: { selectedHub: string | null; onHubClick: (hub: string | null) => void }) {
  const activeFlows = selectedHub ? getFlowsToHub(selectedHub) : [];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <pointLight position={[-10, 10, -10]} color="#6B46C1" intensity={0.3} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Grid */}
      <gridHelper args={[60, 60, '#111111', '#0a0a0a']} />

      {/* Heat Map */}
      <HeatMapPlane />

      {/* Residential Areas */}
      {residentialAreas.map((area) => (
        <LocationMarker
          key={area.name}
          location={area}
          isSelected={false}
          onClick={() => {}}
        />
      ))}

      {/* IT Hubs */}
      {itHubs.map((hub) => (
        <LocationMarker
          key={hub.name}
          location={hub}
          isSelected={hub.name === selectedHub}
          onClick={() => onHubClick(hub.name === selectedHub ? null : hub.name)}
        />
      ))}

      {/* Traffic Flows */}
      {commuterFlows.map((flow, index) => (
        <TrafficFlowLine
          key={index}
          flow={flow}
          isActive={selectedHub === flow.to}
        />
      ))}

      {/* Traffic flow indicators - removed problematic sprites */}
    </>
  );
}

// Main Export Component
export default function TrafficHeatMap() {
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
  const [stats, setStats] = useState<{
    totalCommuters: number;
    avgTravelTime: number;
    topOrigins: { name: string; count: number }[];
  } | null>(null);

  const handleHubClick = useCallback((hubName: string | null) => {
    setSelectedHub(hubName);

    if (hubName) {
      const hub = itHubs.find(h => h.name === hubName);
      if (hub) {
        // Set camera to focus on selected hub
        setCameraTarget([
          (hub.coordinates.lng - 77.65) * 100 + 10,
          15,
          (hub.coordinates.lat - 12.95) * 100 + 10,
        ]);

        // Calculate statistics
        const flows = getFlowsToHub(hubName);
        const totalCommuters = flows.reduce((sum, f) => sum + f.dailyCommuters, 0);
        const avgTravelTime = flows.reduce((sum, f) => sum + f.avgTravelTime, 0) / flows.length;
        const topOrigins = flows
          .sort((a, b) => b.dailyCommuters - a.dailyCommuters)
          .slice(0, 5)
          .map(f => ({ name: f.from, count: f.dailyCommuters }));

        setStats({ totalCommuters, avgTravelTime, topOrigins });
      }
    } else {
      setCameraTarget([20, 25, 20]);
      setStats(null);
    }
  }, []);

  return (
    <div className="w-full h-[700px] relative bg-black rounded-3xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [20, 25, 20], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000');
        }}
      >
        <CameraController target={cameraTarget} />
        <TrafficScene selectedHub={selectedHub} onHubClick={handleHubClick} />
      </Canvas>

      {/* Legend */}
      <div className="absolute top-4 left-4 glass-effect rounded-xl p-4 max-w-xs">
        <h4 className="text-sm font-semibold text-white mb-3">Traffic Heat Map</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-300">IT Hubs (Click to explore)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-300">Residential Areas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-300">Mixed Areas</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Congestion Levels:</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-green-500"></div>
              <span className="text-xs text-gray-300">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-yellow-500"></div>
              <span className="text-xs text-gray-300">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-orange-500"></div>
              <span className="text-xs text-gray-300">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-red-500"></div>
              <span className="text-xs text-gray-300">Severe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Hub Info */}
      {selectedHub && stats && (
        <div className="absolute top-4 right-4 glass-effect rounded-xl p-4 max-w-sm animate-slide-in">
          <h3 className="text-lg font-semibold text-white mb-3">{selectedHub}</h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400">Daily Commuters</p>
              <p className="text-2xl font-bold text-white">{stats.totalCommuters.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Average Travel Time</p>
              <p className="text-xl font-bold text-yellow-400">{Math.round(stats.avgTravelTime)} mins</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Top Origin Areas</p>
              <div className="space-y-2">
                {stats.topOrigins.map((origin, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{origin.name}</span>
                    <span className="text-sm font-semibold text-white">
                      {(origin.count / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleHubClick(null)}
            className="mt-4 w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Bottom Info Panel */}
      <div className="absolute bottom-4 left-4 right-4 glass-effect rounded-xl p-4">
        <div className="grid grid-cols-4 gap-4 text-center mb-3">
          <div>
            <p className="text-2xl font-bold text-white">21</p>
            <p className="text-xs text-gray-400">Residential Areas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">10</p>
            <p className="text-xs text-gray-400">Major IT Hubs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">800K+</p>
            <p className="text-xs text-gray-400">Daily Commuters</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-400">45 min</p>
            <p className="text-xs text-gray-400">Avg Commute Time</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center">
          <span className="font-semibold text-white">Click on any red IT hub</span> to see where its traffic originates from.
          The heat map shows traffic density across Bangalore with flow lines indicating commuter patterns.
        </p>
      </div>
    </div>
  );
}