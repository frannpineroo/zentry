'use client'

import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { Property } from '@/types'

interface Props {
    property: Property
    isSelected: boolean
    onClick: (property: Property) => void
}

function createPinIcon(price: number, isSelected: boolean) {
    const formatted = price >= 1000
        ? `USD ${Math.round(price / 1000)}k`
        : `USD ${price}`

    const bg = isSelected ? '#412402' : '#ffffff'
    const text = isSelected ? '#FAEEDA' : '#1a1a1a'
    const border = isSelected ? '#412402' : '#d1d5db'

    const html = `
    <div style="
      background: ${bg};
      color: ${text};
      border: 1.5px solid ${border};
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      font-family: sans-serif;
      box-shadow: 0 1px 4px rgba(0,0,0,0.12);
      cursor: pointer;
      pointer-events: auto;
    ">${formatted}</div>
  `

    // Estimamos el ancho del texto para centrar el pin correctamente
    const charWidth = 7
    const width = formatted.length * charWidth + 20
    const height = 28

    return L.divIcon({
        html,
        className: 'zentry-pin',
        iconSize: [width, height],
        iconAnchor: [width / 2, height / 2],
    })
}

export default function PropertyPin({ property, isSelected, onClick }: Props) {
    const icon = createPinIcon(property.price, isSelected)

    return (
        <Marker
            position={[property.lat, property.lng]}
            icon={icon}
            eventHandlers={{
                click: (e) => {
                    e.originalEvent.stopPropagation()
                    onClick(property)
                }
            }}
        />
    )
}