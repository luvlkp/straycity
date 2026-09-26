'use client';

import MapView from '@/components/Map/MapView';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 h-screen w-full">
      <MapView pins={[{id: 1, lat: 40.758, lng: -73.9855, title: 'Test Pin', category: 'food'}]} /> 
    </div>
  );
}