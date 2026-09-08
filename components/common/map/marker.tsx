import { useEffect, useRef } from "react"
import mapboxgl from 'mapbox-gl'
import type { Team } from '@/mock-data/teams';

interface MarkerProps {
  feature: Team
  map: mapboxgl.Map
  selectedStore: Team | null
  setSelectedStore: (store: Team | null) => void
}

const Marker = ({ map, feature, selectedStore, setSelectedStore }: MarkerProps) => {
    const { geometry } = feature
    const markerRef = useRef<mapboxgl.Marker | null>(null)
    const isSelected = feature.name === selectedStore?.name;

    useEffect(() => {
        if (!map || !geometry) return;

        // Create the marker element
        const el = document.createElement('div');
        el.className = 'marker-element cursor-pointer transition-all';
        el.style.width = '37px';
        el.style.height = '40px';
        el.style.backgroundImage = isSelected ? 'url("/marker-map/map-marker-selected.svg")' : 'url("/marker-map/map-marker-non-selected-1.svg")';
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.color = "#000000"
        el.style.justifyContent = 'center';
        
        el.onclick = (e) => {
            e.stopPropagation();
            setSelectedStore(feature);
        }

        markerRef.current = new mapboxgl.Marker(el, {
            anchor: 'bottom'
        })
            .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
            .addTo(map)

        return () => {
             markerRef.current?.remove()
        }
    }, [map, geometry, isSelected, feature, setSelectedStore])

    return null
}

export default Marker