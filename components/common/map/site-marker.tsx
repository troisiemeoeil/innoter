import { useEffect, useRef } from "react"
import mapboxgl from 'mapbox-gl'
import type { Team } from '@/mock-data/teams';

interface SiteMarkerProps {
  map: mapboxgl.Map
  lat: number
  long: number
}

const SiteMarker = ({ map, lat, long }: SiteMarkerProps) => {
    const markerRef = useRef<mapboxgl.Marker | null>(null)

    useEffect(() => {
        if (!map) return;

        // Create the marker element
        const el = document.createElement('div');
        el.className = 'marker-element cursor-pointer transition-all';
        el.style.width = '37px';
        el.style.height = '40px';
        el.style.backgroundImage = 'url("/marker-map/site-marker.svg")' ;
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.color = "#000000"
        el.style.justifyContent = 'center';
        
        el.onclick = (e) => {
            e.stopPropagation();
        }

        markerRef.current = new mapboxgl.Marker(el, {
            anchor: 'center'
        })
            .setLngLat([lat, long])
           
            .addTo(map)

        return () => {
             markerRef.current?.remove()
        }
    }, [map])

    return null
}

export default SiteMarker