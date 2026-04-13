'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Property } from '@/types'
import PropertyCard from './PropertyCard'

const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#BA7517', borderTopColor: 'transparent' }} />
                <p className="text-gray-500 text-sm">Cargando mapa...</p>
            </div>
        </div>
    )
})

export default function MapWrapper() {
    const [selected, setSelected] = useState<Property | null>(null)

    return (
        <div className="w-full h-full relative">
            <MapComponent
                selectedId={selected?.id ?? null}
                onPinClick={setSelected}
            />

            {selected && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-80">
                    <PropertyCard
                        property={selected}
                        onClose={() => setSelected(null)}
                    />
                </div>
            )}
        </div>
    )
}