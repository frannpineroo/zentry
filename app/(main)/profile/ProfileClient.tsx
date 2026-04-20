'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Check, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Profile, Property } from '@/types'

interface Props {
    user: User
    profile: Profile | null
    properties: Property[]
}

export default function ProfileClient({ user, profile, properties }: Props) {
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const [editing, setEditing] = useState(false)
    const [fullName, setFullName] = useState(profile?.full_name ?? '')
    const [phone, setPhone] = useState(profile?.phone ?? '')
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        await supabase.from('profiles').upsert({
            id: user.id,
            full_name: fullName || null,
            phone: phone || null,
        }, { onConflict: 'id' })
        setSaving(false)
        setEditing(false)
        router.refresh()
    }

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
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: '#f0e8d8', color: '#854F0B' }}
                >
                    <ArrowLeft size={16} />
                </Link>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1a1208' }}>
                    Mi perfil
                </h1>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

                {/* Profile card */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ background: '#fff', border: '1px solid rgba(186,117,23,0.12)' }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#9a8060' }}>
                            Datos personales
                        </h2>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                                style={{ background: '#f0e8d8', color: '#854F0B' }}
                            >
                                <Pencil size={12} /> Editar
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setEditing(false); setFullName(profile?.full_name ?? ''); setPhone(profile?.phone ?? '') }}
                                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                                    style={{ background: '#f0e8d8', color: '#7a6040' }}
                                >
                                    <X size={12} /> Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                                    style={{ background: '#1a1208', color: '#fff' }}
                                >
                                    <Check size={12} /> {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Email (no editable) */}
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8060' }}>
                                Email
                            </label>
                            <p className="mt-1 text-sm" style={{ color: '#1a1208' }}>{user.email}</p>
                        </div>

                        {/* Nombre */}
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8060' }}>
                                Nombre completo
                            </label>
                            {editing ? (
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Tu nombre"
                                    className="mt-1 w-full px-3 py-2 rounded-xl text-sm outline-none"
                                    style={{ background: '#faf7f2', border: '1.5px solid rgba(186,117,23,0.25)', color: '#1a1208' }}
                                />
                            ) : (
                                <p className="mt-1 text-sm" style={{ color: fullName ? '#1a1208' : '#b0987a' }}>
                                    {fullName || 'Sin nombre'}
                                </p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9a8060' }}>
                                Teléfono (WhatsApp)
                            </label>
                            {editing ? (
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Ej: 5493515551234"
                                    className="mt-1 w-full px-3 py-2 rounded-xl text-sm outline-none"
                                    style={{ background: '#faf7f2', border: '1.5px solid rgba(186,117,23,0.25)', color: '#1a1208' }}
                                />
                            ) : (
                                <p className="mt-1 text-sm" style={{ color: phone ? '#1a1208' : '#b0987a' }}>
                                    {phone || 'Sin teléfono'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mis publicaciones */}
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#9a8060' }}>
                        Mis publicaciones ({properties.length})
                    </h2>

                    {properties.length === 0 ? (
                        <div
                            className="p-8 rounded-2xl text-center"
                            style={{ background: '#fff', border: '1px solid rgba(186,117,23,0.12)' }}
                        >
                            <p className="text-sm" style={{ color: '#9a8060' }}>
                                Todavía no publicaste ninguna propiedad
                            </p>
                            <Link
                                href="/publicar"
                                className="mt-3 inline-block text-xs px-4 py-2 rounded-xl"
                                style={{ background: '#BA7517', color: '#fff' }}
                            >
                                Publicar ahora
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {properties.map((p) => {
                                const image = p.property_images?.sort((a, b) => a.order_index - b.order_index)[0]
                                return (
                                    <Link
                                        key={p.id}
                                        href={`/properties/${p.id}`}
                                        className="flex items-center gap-4 p-4 rounded-2xl transition-colors"
                                        style={{ background: '#fff', border: '1px solid rgba(186,117,23,0.12)' }}
                                    >
                                        {/* Thumbnail */}
                                        <div
                                            className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                                            style={{ background: '#FAEEDA' }}
                                        >
                                            {image ? (
                                                <img src={image.url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span style={{ fontSize: 28 }}>🏠</span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate" style={{ color: '#1a1208' }}>
                                                {p.title}
                                            </p>
                                            <p className="text-xs mt-0.5 truncate" style={{ color: '#9a8060' }}>
                                                {p.address}
                                            </p>
                                            <p className="text-xs mt-1 font-semibold" style={{ color: '#BA7517' }}>
                                                {p.currency} {p.price.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <span
                                            className="text-xs px-2 py-1 rounded-full capitalize shrink-0"
                                            style={{
                                                background: p.status === 'active' ? '#dcfce7' : '#f3f4f6',
                                                color: p.status === 'active' ? '#16a34a' : '#6b7280',
                                            }}
                                        >
                                            {p.status === 'active' ? 'Activa' : p.status}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}