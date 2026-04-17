'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import PublishForm from './PublishForm'
import type { NewPropertyFormData } from '@/types/property'
import { useState } from 'react'

interface PublishFormWrapperProps {
    userId: string
}

export default function PublishFormWrapper({ userId }: PublishFormWrapperProps) {
    const router = useRouter()
    const [successId, setSuccessId] = useState<string | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSuccess = async (data: NewPropertyFormData) => {
        // 0. Garantizar que el perfil existe
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ id: userId }, { onConflict: 'id' })

        if (profileError) {
            console.error('Error ensuring profile:', profileError)
            return
        }

        // 1. Insert property
        const { data: property, error } = await supabase
            .from('properties')
            .insert({
                user_id: userId,
                title: data.title,
                description: data.description,
                price: Number(data.price),
                currency: data.currency,
                operation: data.operation,
                type: data.type,
                bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
                bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
                area_m2: Number(data.area_m2),
                lat: data.location!.lat,
                lng: data.location!.lng,
                address: data.location!.address,
                neighborhood: data.location!.neighborhood || null,
                status: 'active',
            })
            .select('id')
            .single()

        if (error) {
            console.error('Error publishing property:', error)
            return
        }

        // 2. Upload images y guardar en property_images
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                const file = data.images[i]
                const ext = file.name.split('.').pop()
                const path = `${userId}/${property.id}/${Date.now()}-${i}.${ext}`

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('property-images')
                    .upload(path, file, { upsert: false })

                if (uploadError) {
                    console.error('Error uploading image:', uploadError)
                    continue
                }

                const { data: urlData } = supabase.storage
                    .from('property-images')
                    .getPublicUrl(uploadData.path)

                await supabase.from('property_images').insert({
                    property_id: property.id,
                    url: urlData.publicUrl,
                    order_index: i,
                })
            }
        }

        setSuccessId(property.id)
        setTimeout(() => {
            router.push('/')
        }, 1500)
    }

    if (successId) {
        return (
            <div className="h-screen flex items-center justify-center" style={{ background: '#faf7f2' }}>
                <div className="text-center">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: '#BA7517' }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 28,
                            color: '#1a1208',
                        }}
                    >
                        ¡Publicado!
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: '#9a8060' }}>
                        Tu propiedad ya está visible en el mapa
                    </p>
                </div>
            </div>
        )
    }

    return (
        <PublishForm
            onSuccess={handleSuccess}
            onCancel={() => router.push('/')}
        />
    )
}