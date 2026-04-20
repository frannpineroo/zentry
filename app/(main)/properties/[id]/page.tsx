import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { BedDouble, Bath, Maximize2, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value ?? null
                },
            },
        }
    )

    const { data: property } = await supabase
        .from('properties')
        .select(`
            *,
            profiles!properties_user_id_fkey (id, full_name, phone, avatar_url),
            property_images (id, url, order_index)
        `)
        .eq('id', id)
        .single()

    if (!property) notFound()

    const images = property.property_images?.sort(
        (a: any, b: any) => a.order_index - b.order_index
    ) ?? []

    const profile = property.profiles as any

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#faf7f2', minHeight: '100vh' }}>
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap"
                rel="stylesheet"
            />

            {/* Header */}
            <div
                className="sticky top-0 z-10 px-6 py-4 flex items-center gap-3"
                style={{ background: '#faf7f2', borderBottom: '1px solid rgba(186,117,23,0.12)' }}
            >
                <Link
                    href="/"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: '#f0e8d8', color: '#854F0B' }}
                >
                    <ArrowLeft size={16} />
                </Link>
                <h1
                    style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: 20,
                        color: '#1a1208',
                    }}
                >
                    Detalle de propiedad
                </h1>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

                {/* Images */}
                {images.length > 0 ? (
                    <div className="rounded-2xl overflow-hidden" style={{ height: 280 }}>
                        <img
                            src={images[0].url}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div
                        className="rounded-2xl flex items-center justify-center"
                        style={{ height: 280, background: '#FAEEDA' }}
                    >
                        <span style={{ fontSize: 64 }}>🏠</span>
                    </div>
                )}

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.slice(1).map((img: any) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt=""
                                className="w-20 h-16 rounded-xl object-cover shrink-0"
                            />
                        ))}
                    </div>
                )}

                {/* Title + badges */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                            style={{ background: '#FAEEDA', color: '#854F0B', border: '1px solid #FAC775' }}
                        >
                            {property.type}
                        </span>
                        <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                            style={{ background: '#f0e8d8', color: '#7a6040' }}
                        >
                            {property.operation}
                        </span>
                    </div>
                    <h2
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 26,
                            color: '#1a1208',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {property.title}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1.5" style={{ color: '#9a8060' }}>
                        <MapPin size={13} />
                        <span className="text-sm">{property.address}</span>
                    </div>
                </div>

                {/* Price */}
                <div
                    className="px-5 py-4 rounded-2xl"
                    style={{ background: '#1a1208' }}
                >
                    <p className="text-xs font-medium mb-1" style={{ color: '#BA7517' }}>
                        Precio
                    </p>
                    <p
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 32,
                            color: '#fff',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {property.currency} {property.price.toLocaleString()}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {property.bedrooms != null && (
                        <div
                            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl"
                            style={{ background: '#fff', border: '1px solid rgba(186,117,23,0.12)' }}
                        >
                            <BedDouble size={20} style={{ color: '#BA7517' }} />
                            <span className="text-lg font-semibold" style={{ color: '#1a1208' }}>
                                {property.bedrooms}
                            </span>
                            <span className="text-xs" style={{ color: '#9a8060' }}>Dormitorios</span>
                        </div>
                    )}
                    {property.bathrooms != null && (
                        <div
                            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl"
                            style={{ background: '#fff', border: '1px solid rgba(186,117,23,0.12)' }}
                        >
                            <Bath size={20} style={{ color: '#BA7517' }} />
                            <span className="text-lg font-semibold" style={{ color: '#1a1208' }}>
                                {property.bathrooms}
                            </span>
                            <span className="text-xs" style={{ color: '#9a8060' }}>Baños</span>
                        </div>
                    )}
                    {property.area_m2 != null && (
                        <div
                            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl"
                            style={{ background: '#fff', border: '1px solid rgba(186,117,23,0.12)' }}
                        >
                            <Maximize2 size={20} style={{ color: '#BA7517' }} />
                            <span className="text-lg font-semibold" style={{ color: '#1a1208' }}>
                                {property.area_m2}
                            </span>
                            <span className="text-xs" style={{ color: '#9a8060' }}>m²</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {property.description && (
                    <div>
                        <h3
                            className="text-sm font-semibold uppercase tracking-wider mb-2"
                            style={{ color: '#9a8060' }}
                        >
                            Descripción
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#3a2e1e' }}>
                            {property.description}
                        </p>
                    </div>
                )}

                {/* Contact */}
                <div
                    className="p-5 rounded-2xl"
                    style={{ background: '#fff', border: '1px solid rgba(186,117,23,0.12)' }}
                >
                    <h3
                        className="text-sm font-semibold uppercase tracking-wider mb-3"
                        style={{ color: '#9a8060' }}
                    >
                        Contacto
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-sm" style={{ color: '#1a1208' }}>
                                {profile?.full_name ?? 'Propietario'}
                            </p>
                            {profile?.phone && (
                                <p className="text-xs mt-0.5" style={{ color: '#9a8060' }}>
                                    {profile.phone}
                                </p>
                            )}
                        </div>

                        <a
                            href={`https://wa.me/${profile?.phone ?? ''}?text=Hola, vi la propiedad "${property.title}" en Zentry`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                            style={{ background: '#FAEEDA', color: '#854F0B' }}
                        >
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div >
    )
}