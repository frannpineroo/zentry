'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Property } from '@/types'
import { mockProperties } from '@/lib/mock-properties'
import PropertyPin from './PropertyPin'

const fixLeafletIcons = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
}

function MapController() {
    const map = useMap()
    useEffect(() => {
        fixLeafletIcons()
        map.invalidateSize()
    }, [map])
    return null
}

interface Props {
    selectedId: string | null
    onPinClick: (property: Property) => void
}

export default function MapComponent({ selectedId, onPinClick }: Props) {
    return (
        <MapContainer
            center={[-31.4167, -64.1833]}
            zoom={13}
            className="w-full h-full"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController />
            {mockProperties.map((property) => (
                <PropertyPin
                    key={property.id}
                    property={property}
                    isSelected={selectedId === property.id}
                    onClick={onPinClick}
                />
            ))}
        </MapContainer>
    )
}