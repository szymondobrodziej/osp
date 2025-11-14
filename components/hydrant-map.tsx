'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Droplet, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { useIncidentStore } from '@/store/incident-store';

// Fix dla domyślnych ikon Leaflet w Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ikona dla hydrantu
const hydrantIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v20"/>
      <path d="M8 6h8"/>
      <path d="M8 10h8"/>
      <path d="M8 14h8"/>
      <circle cx="12" cy="12" r="3" fill="#dc2626"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Ikona dla lokalizacji zdarzenia
const incidentIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#ea580c" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface Hydrant {
  id: string;
  lat: number;
  lng: number;
  type: 'underground' | 'overground' | 'reservoir';
  pressure?: string;
  diameter?: string;
  notes?: string;
}

interface HydrantMapProps {
  incidentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  onHydrantSelect?: (hydrant: Hydrant) => void;
}

// Komponent do centrowania mapy
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);
  
  return null;
}

export default function HydrantMap({ incidentLocation, onHydrantSelect }: HydrantMapProps) {
  const [hydrants, setHydrants] = useState<Hydrant[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const updateIncident = useIncidentStore(state => state.updateIncident);
  const currentIncident = useIncidentStore(state => state.currentIncident);

  // Przykładowe hydranty (w produkcji pobierz z API lub bazy danych)
  useEffect(() => {
    // Generuj przykładowe hydranty w promieniu 2 km od lokalizacji zdarzenia
    // 1 stopień szerokości geograficznej ≈ 111 km
    // 2 km ≈ 0.018 stopnia
    const radius = 0.018; // ~2 km

    const mockHydrants: Hydrant[] = [];

    // Generuj losowe hydranty w promieniu 2 km
    for (let i = 0; i < 25; i++) {
      // Losowy kąt i odległość
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;

      // Oblicz współrzędne
      const lat = incidentLocation.lat + distance * Math.cos(angle);
      const lng = incidentLocation.lng + distance * Math.sin(angle);

      // Losowy typ hydrantu
      const types: Hydrant['type'][] = ['overground', 'underground', 'reservoir'];
      const type = types[Math.floor(Math.random() * types.length)];

      // Losowe parametry
      const pressures = ['4 bar', '5 bar', '6 bar', '7 bar', '8 bar'];
      const diameters = ['80mm', '100mm', '150mm'];

      mockHydrants.push({
        id: `hydrant-${i + 1}`,
        lat,
        lng,
        type,
        pressure: type !== 'reservoir' ? pressures[Math.floor(Math.random() * pressures.length)] : undefined,
        diameter: type !== 'reservoir' ? diameters[Math.floor(Math.random() * diameters.length)] : undefined,
        notes: type === 'reservoir' ? `Zbiornik ${[30, 50, 100][Math.floor(Math.random() * 3)]}m³` :
               (Math.random() > 0.8 ? 'Wymaga konserwacji' : 'Sprawny'),
      });
    }

    console.log(`🗺️ Wygenerowano ${mockHydrants.length} hydrantów w promieniu 2 km`);
    setHydrants(mockHydrants);
  }, [incidentLocation]);

  // Pobierz lokalizację użytkownika
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      console.log('🗺️ Mapa: Pobieranie lokalizacji użytkownika...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          console.log('🗺️ Mapa: Lokalizacja użytkownika pobrana:', coords);
        },
        (error) => {
          console.error('🗺️ Mapa: Błąd pobierania lokalizacji użytkownika:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Cache na 1 minutę
        }
      );
    }
  }, []);

  // Funkcja do odświeżenia lokalizacji zdarzenia
  const handleRefreshLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setIsRefreshing(true);
      console.log('🔄 Odświeżanie lokalizacji zdarzenia...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          console.log('✅ Nowa lokalizacja pobrana:', coordinates);

          // Zaktualizuj zdarzenie
          if (currentIncident) {
            updateIncident({
              location: {
                address: currentIncident.location.address,
                coordinates,
                accessNotes: currentIncident.location.accessNotes,
              },
            });
            console.log('✅ Lokalizacja zdarzenia zaktualizowana');
          }

          setIsRefreshing(false);
        },
        (error) => {
          console.error('❌ Błąd odświeżania lokalizacji:', error.message);
          alert(`Nie można pobrać lokalizacji: ${error.message}`);
          setIsRefreshing(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolokalizacja nie jest dostępna w tej przeglądarce');
    }
  };

  const getHydrantTypeLabel = (type: Hydrant['type']) => {
    switch (type) {
      case 'overground': return '🔴 Nadziemny';
      case 'underground': return '🟡 Podziemny';
      case 'reservoir': return '🔵 Zbiornik';
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // promień Ziemi w metrach
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // dystans w metrach
  };

  const hydrantsWithDistance = hydrants.map(h => ({
    ...h,
    distance: calculateDistance(incidentLocation.lat, incidentLocation.lng, h.lat, h.lng)
  })).sort((a, b) => a.distance - b.distance);

  // Filtruj hydranty w promieniu 2 km (2000 metrów)
  const hydrantsInRange = hydrantsWithDistance.filter(h => h.distance <= 2000);
  const nearestHydrants = hydrantsInRange.slice(0, 4);

  const centerLocation: [number, number] = [incidentLocation.lat, incidentLocation.lng];

  console.log(`🗺️ Hydranty w promieniu 2 km: ${hydrantsInRange.length} / ${hydrants.length} całkowicie`);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Mapa - większa, bez listy hydrantów */}
          <div className={`relative ${isExpanded ? 'h-[70vh]' : 'h-[400px] md:h-[500px]'} transition-all duration-300`}>
            <MapContainer
              center={centerLocation}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <MapController center={centerLocation} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Marker lokalizacji zdarzenia */}
              <Marker position={centerLocation} icon={incidentIcon}>
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-red-600">🔥 Miejsce zdarzenia</p>
                    <p className="text-sm">{incidentLocation.address}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Markery hydrantów - tylko ikony, szczegóły w popup */}
              {hydrantsInRange.map((hydrant) => (
                <Marker
                  key={hydrant.id}
                  position={[hydrant.lat, hydrant.lng]}
                  icon={hydrantIcon}
                  eventHandlers={{
                    click: () => onHydrantSelect?.(hydrant),
                  }}
                >
                  <Popup>
                    <div className="p-2 space-y-1">
                      <p className="font-bold text-sm">{getHydrantTypeLabel(hydrant.type)}</p>
                      <p className="text-xs font-semibold text-blue-600">
                        📍 {hydrant.distance}m
                      </p>
                      {hydrant.pressure && <p className="text-xs">Ciśnienie: {hydrant.pressure}</p>}
                      {hydrant.diameter && <p className="text-xs">Średnica: {hydrant.diameter}</p>}
                      {hydrant.notes && <p className="text-xs text-gray-600 mt-1">{hydrant.notes}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Przyciski kontrolne */}
            <div className="absolute top-2 right-2 z-[1000] flex gap-2">
              <Button
                onClick={handleRefreshLocation}
                size="sm"
                disabled={isRefreshing}
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                title="Odśwież lokalizację"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                size="sm"
                className="bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
                title={isExpanded ? 'Zwiń mapę' : 'Rozwiń mapę'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>

            {/* Info badge - liczba hydrantów */}
            <div className="absolute bottom-2 left-2 z-[1000]">
              <Badge className="bg-white/90 text-gray-700 border shadow-lg">
                <Droplet className="w-3 h-3 mr-1" />
                {hydrantsInRange.length} hydrantów w zasięgu
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

