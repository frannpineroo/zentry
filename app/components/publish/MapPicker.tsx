'use client'

import { useEffect, useRef, useState } from 'react'
import type { PropertyLocation } from '@/types/property'

interface MapPickerProps {
    value: PropertyLocation | null
    onChange: (location: PropertyLocation) => void
}

// Córdoba, Argentina center
const CORDOBA_CENTER: [number, number] = [-31.4167, -64.1833]
const DEFAULT_ZOOM = 13

export default function MapPicker({ value, onChange }: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const markerRef = useRef<any>(null)
    const [isReady, setIsReady] = useState(false)
    const [isGeocoding, setIsGeocoding] = useState(false)

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return

        // Dynamically import Leaflet (SSR-safe)
        import('leaflet').then((L) => {
            // Fix default icon paths for Next.js
            delete (L.Icon.Default.prototype as any)._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            })

            const map = L.map(mapRef.current!, {
                center: CORDOBA_CENTER,
                zoom: DEFAULT_ZOOM,
                zoomControl: true,
                attributionControl: false,
            })

            // Tile layer — CartoDB Positron (clean, light)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(map)

            // Custom amber pin icon
            const amberIcon = L.divIcon({
                className: '',
                html: `
          <div style="
            width: 32px; height: 32px;
            background: #BA7517;
            border: 3px solid #fff;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(186,117,23,0.5);
            cursor: pointer;
          "></div>
        `,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            })

            // If already has a value, place marker
            if (value) {
                markerRef.current = L.marker([value.lat, value.lng], { icon: amberIcon }).addTo(map)
                map.setView([value.lat, value.lng], DEFAULT_ZOOM)
            }

            // Click handler
            map.on('click', async (e: any) => {
                const { lat, lng } = e.latlng

                // Remove previous marker
                if (markerRef.current) {
                    markerRef.current.remove()
                }

                // Add new marker
                markerRef.current = L.marker([lat, lng], { icon: amberIcon }).addTo(map)

                // Reverse geocode with Nominatim
                setIsGeocoding(true)
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`
                    )
                    const data = await res.json()
                    const address = data.display_name
                        ? formatAddress(data.address)
                        : `${lat.toFixed(5)}, ${lng.toFixed(5)}`

                    onChange({
                        lat,
                        lng,
                        address,
                        neighborhood: data.address?.suburb || data.address?.neighbourhood || data.address?.quarter,
                    })
                } catch {
                    onChange({
                        lat,
                        lng,
                        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                    })
                } finally {
                    setIsGeocoding(false)
                }
            })

            mapInstanceRef.current = map
            setIsReady(true)
        })

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [])

    // Update marker if value changes externally
    useEffect(() => {
        if (!mapInstanceRef.current || !value) return
        import('leaflet').then((L) => {
            if (markerRef.current) markerRef.current.remove()
            const amberIcon = L.divIcon({
                className: '',
                html: `<div style="width:32px;height:32px;background:#BA7517;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(186,117,23,0.5)"></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            })
            markerRef.current = L.marker([value.lat, value.lng], { icon: amberIcon }).addTo(mapInstanceRef.current)
        })
    }, [value?.lat, value?.lng])

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden">
            {/* Leaflet CSS */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />

            {/* Map container */}
            <div ref={mapRef} className="w-full h-full" />

            {/* Overlay: hint when no location selected */}
            {!value && isReady && (
                <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-6">
                    <div
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                            background: 'rgba(0,0,0,0.65)',
                            color: '#fff',
                            backdropFilter: 'blur(6px)',
                        }}
                    >
                        Hacé click en el mapa para elegir la ubicación
                    </div>
                </div>
            )}

            {/* Geocoding spinner */}
            {isGeocoding && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000]">
                    <div
                        className="px-3 py-1.5 rounded-full text-xs flex items-center gap-2"
                        style={{ background: '#BA7517', color: '#fff' }}
                    >
                        <span
                            className="inline-block w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"
                        />
                        Obteniendo dirección…
                    </div>
                </div>
            )}

            {/* Location confirmed badge */}
            {value && !isGeocoding && (
                <div className="absolute top-3 left-3 right-3 z-[1000]">
                    <div
                        className="px-3 py-2 rounded-lg text-xs flex items-start gap-2"
                        style={{
                            background: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(186,117,23,0.25)',
                            color: '#3d3520',
                        }}
                    >
                        <span style={{ color: '#BA7517', fontSize: 14, lineHeight: 1 }}>📍</span>
                        <div className="min-w-0">
                            <p className="font-medium truncate" style={{ color: '#BA7517' }}>
                                {value.neighborhood || 'Ubicación seleccionada'}
                            </p>
                            <p className="truncate opacity-70 text-[11px] mt-0.5">{value.address}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function formatAddress(addr: any): string {
    const parts = [
        addr.road && addr.house_number ? `${addr.road} ${addr.house_number}` : addr.road,
        addr.suburb || addr.neighbourhood || addr.quarter,
        'Córdoba',
    ].filter(Boolean)
    return parts.join(', ')
}