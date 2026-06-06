import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { places, getCategoryIcon, getNearbyAlternatives, Place } from '@/data/places';
import { artisans, getCraftIcon } from '@/data/artisans';
import { trails, getTrailIcon, Trail } from '@/data/trails';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  selectedPlaceId?: string;
  showArtisans?: boolean;
  onPlaceSelect?: (placeId: string) => void;
}

const colors: Record<string, string> = {
  heritage: '#6b2137',
  art: '#d4a843',
  nature: '#2d6a4f',
  food: '#c96442',
  culture: '#d4a843',
  artisan: '#d4a843',
  trail: '#8b5cf6',
};

const createCustomIcon = (emoji: string, color: string, isHighlighted = false, isHighCrowd = false) => {
  const size = isHighlighted ? 44 : 36;
  const border = isHighlighted ? '4px solid #22c55e' : isHighCrowd ? '3px solid #ef4444' : '3px solid white';
  const shadow = isHighlighted ? '0 0 12px rgba(34, 197, 94, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)';
  
  return L.divIcon({
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:${border};box-shadow:${shadow};font-size:${isHighlighted ? 20 : 16}px;transition:all 0.3s ease;">${emoji}</div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const MapView = ({ selectedPlaceId, showArtisans = true, onPlaceSelect }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const placeMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const artisanMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const linesRef = useRef<L.Polyline[]>([]);
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [alternatives, setAlternatives] = useState<Place[]>([]);
  const [activeTrail, setActiveTrail] = useState<Trail | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([12.3051, 76.6551], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add place markers
    places.forEach((place) => {
      const isHighCrowd = place.crowdLevel === 'high';
      const marker = L.marker(place.coordinates, {
        icon: createCustomIcon(getCategoryIcon(place.category), colors[place.category], false, isHighCrowd),
      }).addTo(map);

      const crowdBadge = isHighCrowd 
        ? `<span style="background:#ef4444;color:white;padding:2px 6px;border-radius:4px;font-size:10px;margin-left:4px;">High Crowd</span>`
        : '';

      marker.bindPopup(`
        <div class="p-2 min-w-[220px]">
          <h3 class="font-semibold mb-1">${place.name} ${crowdBadge}</h3>
          <p class="text-xs text-gray-600 mb-2">${place.description}</p>
          <p class="text-xs"><strong>Best time:</strong> ${place.bestTime}</p>
          ${place.nearbyAlternatives ? `<p class="text-xs mt-2 text-green-600 font-medium">🔄 Click to see ${place.nearbyAlternatives.length} alternatives</p>` : ''}
        </div>
      `);

      marker.on('click', () => {
        onPlaceSelect?.(place.id);
        if (place.crowdLevel === 'high' && place.nearbyAlternatives) {
          setActivePlace(place);
          setAlternatives(getNearbyAlternatives(place.id));
        } else {
          setActivePlace(null);
          setAlternatives([]);
        }
        setActiveTrail(null);
      });

      placeMarkersRef.current.set(place.id, marker);
    });

    // Add artisan markers
    if (showArtisans) {
      artisans.forEach((artisan) => {
        const marker = L.marker(artisan.coordinates, {
          icon: createCustomIcon(getCraftIcon(artisan.craft), colors.artisan),
        }).addTo(map);

        marker.bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold mb-1">${artisan.name}</h3>
            <p class="text-xs text-amber-600 mb-1 capitalize">${artisan.craft} Artisan</p>
            <p class="text-xs text-gray-600">${artisan.specialty}</p>
            <p class="text-xs text-gray-500 mt-1">📍 ${artisan.location}</p>
          </div>
        `);

        marker.on('click', () => {
          onPlaceSelect?.(artisan.id);
          setActiveTrail(null);
        });

        artisanMarkersRef.current.set(artisan.id, marker);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showArtisans, onPlaceSelect]);

  // Handle selected place/artisan/trail and draw connection lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing lines
    linesRef.current.forEach(line => line.remove());
    linesRef.current = [];

    // Reset all place markers to default style
    placeMarkersRef.current.forEach((marker, id) => {
      const place = places.find(p => p.id === id);
      if (place) {
        const isHighCrowd = place.crowdLevel === 'high';
        marker.setIcon(createCustomIcon(getCategoryIcon(place.category), colors[place.category], false, isHighCrowd));
      }
    });

    // Reset all artisan markers to default style
    artisanMarkersRef.current.forEach((marker, id) => {
      const artisan = artisans.find(a => a.id === id);
      if (artisan) {
        marker.setIcon(createCustomIcon(getCraftIcon(artisan.craft), colors.artisan, false, false));
      }
    });

    if (!selectedPlaceId) return;

    // Check if it's a trail selection
    if (selectedPlaceId.startsWith('trail:')) {
      const trailId = selectedPlaceId.replace('trail:', '');
      const trail = trails.find(t => t.id === trailId);
      
      if (trail) {
        setActiveTrail(trail);
        setActivePlace(null);
        setAlternatives([]);

        // Get all coordinates for the trail
        const trailCoords: [number, number][] = [];
        
        // Highlight related places
        trail.relatedPlaceIds.forEach(placeId => {
          const place = places.find(p => p.id === placeId);
          const marker = placeMarkersRef.current.get(placeId);
          if (place && marker) {
            marker.setIcon(createCustomIcon(getCategoryIcon(place.category), colors.trail, true, false));
            trailCoords.push(place.coordinates);
          }
        });

        // Highlight related artisans
        trail.relatedArtisanIds?.forEach(artisanId => {
          const artisan = artisans.find(a => a.id === artisanId);
          const marker = artisanMarkersRef.current.get(artisanId);
          if (artisan && marker) {
            marker.setIcon(createCustomIcon(getCraftIcon(artisan.craft), colors.trail, true, false));
            trailCoords.push(artisan.coordinates);
          }
        });

        // Draw trail route connecting all stops
        if (trailCoords.length > 1) {
          const line = L.polyline(trailCoords, {
            color: '#8b5cf6',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 6',
          }).addTo(map);
          linesRef.current.push(line);
        }

        // Fit bounds to show all trail stops
        if (trailCoords.length > 0) {
          const bounds = L.latLngBounds(trailCoords.map(c => L.latLng(c[0], c[1])));
          map.fitBounds(bounds, { padding: [60, 60] });
        }
        return;
      }
    }

    // Check if it's a place
    const selectedPlace = places.find(p => p.id === selectedPlaceId);
    if (selectedPlace) {
      setActiveTrail(null);
      
      // If it's a high-crowd place, show alternatives
      if (selectedPlace.crowdLevel === 'high' && selectedPlace.nearbyAlternatives) {
        setActivePlace(selectedPlace);
        const alts = getNearbyAlternatives(selectedPlaceId);
        setAlternatives(alts);

        // Highlight the selected high-crowd marker
        const mainMarker = placeMarkersRef.current.get(selectedPlaceId);
        if (mainMarker) {
          mainMarker.setIcon(createCustomIcon(getCategoryIcon(selectedPlace.category), '#ef4444', true, true));
        }

        // Draw lines to alternatives and highlight them
        alts.forEach(alt => {
          const line = L.polyline(
            [selectedPlace.coordinates, alt.coordinates],
            {
              color: '#22c55e',
              weight: 3,
              opacity: 0.8,
              dashArray: '8, 8',
            }
          ).addTo(map);
          linesRef.current.push(line);

          const altMarker = placeMarkersRef.current.get(alt.id);
          if (altMarker) {
            altMarker.setIcon(createCustomIcon(getCategoryIcon(alt.category), '#22c55e', true, false));
          }
        });

        // Fit bounds to show all connected places
        const allCoords = [selectedPlace.coordinates, ...alts.map(a => a.coordinates)];
        const bounds = L.latLngBounds(allCoords.map(c => L.latLng(c[0], c[1])));
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // Just pan to the selected place
        setActivePlace(null);
        setAlternatives([]);
        map.setView(selectedPlace.coordinates, 14);
        const marker = placeMarkersRef.current.get(selectedPlaceId);
        if (marker) {
          marker.openPopup();
        }
      }
      return;
    }

    // Check if it's an artisan
    const selectedArtisan = artisans.find(a => a.id === selectedPlaceId);
    if (selectedArtisan) {
      setActivePlace(null);
      setAlternatives([]);
      setActiveTrail(null);
      
      // Highlight the artisan marker
      const artisanMarker = artisanMarkersRef.current.get(selectedPlaceId);
      if (artisanMarker) {
        artisanMarker.setIcon(createCustomIcon(getCraftIcon(selectedArtisan.craft), '#22c55e', true, false));
        map.setView(selectedArtisan.coordinates, 15);
        artisanMarker.openPopup();
      }
    }
  }, [selectedPlaceId]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-border shadow-card bg-muted">
      <div ref={mapRef} className="w-full h-[500px] z-0" style={{ minHeight: '500px' }} />

      {/* Trail Info Panel */}
      {activeTrail && (
        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-elevated border border-border z-[1000] max-w-[300px] animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{getTrailIcon(activeTrail.id)}</span>
            <div>
              <h4 className="font-semibold text-sm text-foreground">{activeTrail.name}</h4>
              <p className="text-xs text-muted-foreground italic">{activeTrail.tagline}</p>
            </div>
          </div>
          
          <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-purple-700 dark:text-purple-300">
              <strong>Duration:</strong> {activeTrail.duration} • <strong>Distance:</strong> {activeTrail.distance}
            </p>
          </div>

          <p className="text-xs text-muted-foreground mb-2">Trail Stops:</p>
          
          <div className="space-y-1.5">
            {activeTrail.stops.map((stop, idx) => (
              <div
                key={stop}
                className="flex items-center gap-2 p-1.5 bg-muted rounded text-xs"
              >
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-foreground">{stop}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Recommendations Panel */}
      {activePlace && alternatives.length > 0 && (
        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-elevated border border-border z-[1000] max-w-[280px] animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <h4 className="font-semibold text-sm text-foreground">Smart Redirect</h4>
          </div>
          
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-700 dark:text-red-300 font-medium">{activePlace.name}</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{activePlace.redirectMessage}</p>
          </div>

          <p className="text-xs text-muted-foreground mb-2">Recommended alternatives:</p>
          
          <div className="space-y-2">
            {alternatives.map(alt => (
              <button
                key={alt.id}
                onClick={() => onPlaceSelect?.(alt.id)}
                className="w-full text-left p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getCategoryIcon(alt.category)}</span>
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">{alt.name}</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 line-clamp-1">{alt.bestTime}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-card border border-border z-[1000]">
        <p className="text-xs font-semibold text-foreground mb-2">Legend</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2"><span>🏛️</span> <span className="text-muted-foreground">Heritage</span></div>
          <div className="flex items-center gap-2"><span>🎨</span> <span className="text-muted-foreground">Art & Craft</span></div>
          <div className="flex items-center gap-2"><span>🌿</span> <span className="text-muted-foreground">Nature</span></div>
          <div className="flex items-center gap-2"><span>🍛</span> <span className="text-muted-foreground">Food</span></div>
          <div className="flex items-center gap-2"><span>🪔</span> <span className="text-muted-foreground">Culture</span></div>
          <div className="border-t border-border pt-1 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-300"></span>
              <span className="text-muted-foreground">High Crowd</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }}></span>
              <span className="text-muted-foreground">Redirect Path</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-purple-500" style={{ borderStyle: 'dashed' }}></span>
              <span className="text-muted-foreground">Trail Route</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
