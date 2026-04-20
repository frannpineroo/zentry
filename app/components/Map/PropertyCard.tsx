'use client'

import { X, BedDouble, Bath, Maximize2 } from 'lucide-react'
import { Property } from '@/types'
import Link from 'next/link'

interface Props {
    property: Property
    onClose: () => void
}

export default function PropertyCard({ property, onClose }: Props) {
    const whatsappUrl = `https://wa.me/?text=Hola, vi la propiedad "${property.title}" en Zentry`

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden w-80">
            <div className="relative h-24 flex items-center justify-center" style={{ background: '#FAEEDA' }}>
                <span className="text-3xl">🏠</span>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-100 hover:bg-gray-50"
                >
                    <X size={12} className="text-gray-500" />
                </button>
                <div
                    className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                    style={{ background: '#fff', color: '#854F0B', border: '1px solid #FAC775' }}
                >
                    {property.type}
                </div>
            </div>

            <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-900 text-sm">
                        USD {property.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{property.address}</p>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {property.bedrooms && (
                        <span className="flex items-center gap-1">
                            <BedDouble size={12} /> {property.bedrooms} amb
                        </span>
                    )}
                    {property.bathrooms && (
                        <span className="flex items-center gap-1">
                            <Bath size={12} /> {property.bathrooms} baños
                        </span>
                    )}
                    {property.area_m2 && (
                        <span className="flex items-center gap-1">
                            <Maximize2 size={12} /> {property.area_m2} m²
                        </span>
                    )}
                </div>

                <Link
                    href={`/properties/${property.id}`}
                    className="mt-2.5 w-full flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-medium transition-colors"
                    style={{ background: '#1a1208', color: '#fff' }}
                >
                    Ver detalle
                </Link>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 w-full flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-medium transition-colors"
                    style={{ background: '#FAEEDA', color: '#854F0B' }}
                >
                    Contactar por WhatsApp
                </a>
            </div>
        </div>
    )
}