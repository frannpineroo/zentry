'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
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
    const [properties, setProperties] = useState<Property[]>([])

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        const fetchProperties = async () => {
            const { data, error } = await supabase
                .from('properties')
                .select(`
        *,
        profiles!properties_user_id_fkey (id, full_name, phone, avatar_url, created_at),
        property_images (id, property_id, url, order_index)
    `)
                .eq('status', 'active')

            if (error) {
                console.error('Error fetching properties:', error)
                return
            }

            setProperties(data as Property[])
        }

        fetchProperties()
    }, [])

    return (
        <div className="w-full h-full relative">
            <MapComponent
                properties={properties}
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