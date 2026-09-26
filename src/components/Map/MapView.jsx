'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

const categoryColors = {
  food: '#ef4444',
  events: '#3b82f6',
  popups: '#a855f7',
  adventure: '#22c55e',
};

const NYC_CENTER = [40.758, -73.9855];

export default function MapView({ pins = [] }) {
  const router = useRouter();
  const [lib, setLib] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([import('react-leaflet'), import('leaflet')])
      .then(([reactLeaflet, leafletMod]) => {
        if (mounted) {
          setLib({
            MapContainer: reactLeaflet.MapContainer,
            TileLayer: reactLeaflet.TileLayer,
            Marker: reactLeaflet.Marker,
            Popup: reactLeaflet.Popup,
            L: leafletMod.default,
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load map libraries:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!lib) {
    return (
      <div
        style={{ height: '100vh', width: '100%' }}
        className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-900"
      >
        <p className="text-sm text-zinc-500">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, L } = lib;

  const createCategoryIcon = (color) =>
    L.divIcon({
      className: 'custom-pin',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={NYC_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pins.map((pin) => {
          const pinColor = categoryColors[pin.category] || '#3b82f6';
          return (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={createCategoryIcon(pinColor)}
              eventHandlers={{
                click: () => router.push(`/pin/${pin.id}`),
              }}
            >
              <Popup>
                <strong>{pin.title}</strong>
                <br />
                {pin.category}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}