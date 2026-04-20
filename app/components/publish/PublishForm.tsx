'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { NewPropertyFormData, PropertyType, OperationType } from '@/types/property'
import { PROPERTY_TYPES } from '@/types/property'

// SSR-safe: Leaflet needs window
const MapPicker = dynamic(() => import('./MapPicker'), {
    ssr: false,
    loading: () => (
        <div
            className="w-full h-full rounded-xl flex items-center justify-center"
            style={{ background: '#f5f0e8' }}
        >
            <div className="text-center">
                <div
                    className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
                    style={{ borderColor: '#BA7517', borderTopColor: 'transparent' }}
                />
                <p className="text-sm" style={{ color: '#9a8060' }}>Cargando mapa…</p>
            </div>
        </div>
    ),
})

const EMPTY_FORM: NewPropertyFormData = {
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    operation: 'venta',
    type: 'departamento',
    bedrooms: '',
    bathrooms: '',
    area_m2: '',
    location: null,
    images: [],
}

interface PublishFormProps {
    onSuccess?: (data: NewPropertyFormData) => void
    onCancel?: () => void
}

export default function PublishForm({ onSuccess, onCancel }: PublishFormProps) {
    const [form, setForm] = useState<NewPropertyFormData>(EMPTY_FORM)
    const [step, setStep] = useState<1 | 2>(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Partial<Record<keyof NewPropertyFormData, string>>>({})

    const set = <K extends keyof NewPropertyFormData>(key: K, val: NewPropertyFormData[K]) => {
        setForm((f) => ({ ...f, [key]: val }))
        setErrors((e) => ({ ...e, [key]: undefined }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        set('images', [...form.images, ...files].slice(0, 8))
    }

    const removeImage = (idx: number) => {
        set('images', form.images.filter((_, i) => i !== idx))
    }

    const validate = (): boolean => {
        const errs: typeof errors = {}
        if (!form.title.trim()) errs.title = 'Requerido'
        if (!form.price || isNaN(Number(form.price))) errs.price = 'Ingresá un precio válido'
        if (!form.area_m2 || isNaN(Number(form.area_m2))) errs.area_m2 = 'Ingresá los m²'
        if (!form.location) errs.location = 'Elegí la ubicación en el mapa'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setIsSubmitting(true)
        try {
            // TODO: replace with Supabase insert + storage upload
            await new Promise((r) => setTimeout(r, 1200))
            onSuccess?.(form)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            className="flex h-screen max-h-screen overflow-hidden"
            style={{ fontFamily: "'DM Sans', sans-serif", background: '#faf7f2' }}
        >
            {/* Google font */}
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap"
                rel="stylesheet"
            />

            {/* ── LEFT PANEL: Form ── */}
            <div className="w-full md:w-[480px] flex flex-col h-full overflow-y-auto shrink-0">
                {/* Header */}
                <div
                    className="px-8 pt-8 pb-6 shrink-0"
                    style={{ borderBottom: '1px solid rgba(186,117,23,0.12)' }}
                >
                    <div className="flex items-center justify-between mb-1">
                        <h1
                            style={{
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: 26,
                                color: '#1a1208',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Publicar propiedad
                        </h1>
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors"
                                style={{ color: '#9a8060', background: 'transparent' }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0e8d8')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <p style={{ fontSize: 13, color: '#9a8060' }}>
                        Completá los datos y elegí la ubicación en el mapa
                    </p>

                    {/* Step pills */}
                    <div className="flex gap-2 mt-4">
                        {(['Detalles', 'Fotos y precio'] as const).map((label, i) => (
                            <button
                                key={i}
                                onClick={() => setStep((i + 1) as 1 | 2)}
                                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                                style={
                                    step === i + 1
                                        ? { background: '#BA7517', color: '#fff' }
                                        : { background: '#f0e8d8', color: '#9a8060' }
                                }
                            >
                                {i + 1}. {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form body */}
                <div className="flex-1 px-8 py-6 space-y-5">
                    {step === 1 ? (
                        <>
                            {/* Título */}
                            <Field label="Título del anuncio" error={errors.title}>
                                <input
                                    value={form.title}
                                    onChange={(e) => set('title', e.target.value)}
                                    placeholder="Ej: Dpto 3 amb con balcón en Nueva Córdoba"
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={inputStyle(!!errors.title)}
                                />
                            </Field>

                            {/* Tipo de propiedad */}
                            <Field label="Tipo">
                                <div className="grid grid-cols-5 gap-2">
                                    {PROPERTY_TYPES.map((t) => (
                                        <button
                                            key={t.value}
                                            onClick={() => set('type', t.value)}
                                            className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all"
                                            style={
                                                form.type === t.value
                                                    ? { background: '#BA7517', color: '#fff' }
                                                    : { background: '#f0e8d8', color: '#7a6040' }
                                            }
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            {/* Operación */}
                            <Field label="Operación">
                                <div className="flex gap-3">
                                    {(['venta', 'alquiler'] as OperationType[]).map((op) => (
                                        <button
                                            key={op}
                                            onClick={() => set('operation', op)}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
                                            style={
                                                form.operation === op
                                                    ? { background: '#1a1208', color: '#fff' }
                                                    : { background: '#f0e8d8', color: '#7a6040' }
                                            }
                                        >
                                            {op}
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            {/* Área + ambientes */}
                            <div className="grid grid-cols-3 gap-3">
                                <Field label="Superficie (m²)" error={errors.area_m2}>
                                    <input
                                        value={form.area_m2}
                                        onChange={(e) => set('area_m2', e.target.value)}
                                        placeholder="65"
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                        style={inputStyle(!!errors.area_m2)}
                                    />
                                </Field>
                                <Field label="Dormitorios">
                                    <input
                                        value={form.bedrooms}
                                        onChange={(e) => set('bedrooms', e.target.value)}
                                        placeholder="2"
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                        style={inputStyle(false)}
                                    />
                                </Field>
                                <Field label="Baños">
                                    <input
                                        value={form.bathrooms}
                                        onChange={(e) => set('bathrooms', e.target.value)}
                                        placeholder="1"
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                        style={inputStyle(false)}
                                    />
                                </Field>
                            </div>

                            {/* Descripción */}
                            <Field label="Descripción">
                                <textarea
                                    value={form.description}
                                    onChange={(e) => set('description', e.target.value)}
                                    placeholder="Descripción de la propiedad, características destacadas..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                                    style={inputStyle(false)}
                                />
                            </Field>

                            {/* Location error */}
                            {errors.location && (
                                <p className="text-xs font-medium" style={{ color: '#c0392b' }}>
                                    ⚠ {errors.location}
                                </p>
                            )}

                            {/* Location confirmed */}
                            {form.location && (
                                <div
                                    className="flex items-start gap-3 p-3 rounded-xl"
                                    style={{ background: 'rgba(186,117,23,0.08)', border: '1px solid rgba(186,117,23,0.2)' }}
                                >
                                    <span style={{ color: '#BA7517', fontSize: 18 }}>📍</span>
                                    <div>
                                        <p className="text-xs font-semibold" style={{ color: '#BA7517' }}>
                                            {form.location.neighborhood || 'Ubicación confirmada'}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: '#9a8060' }}>
                                            {form.location.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Precio */}
                            <Field label="Precio" error={errors.price}>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => set('currency', form.currency === 'USD' ? 'ARS' : 'USD')}
                                        className="px-4 py-3 rounded-xl text-sm font-bold shrink-0 transition-all"
                                        style={{ background: '#1a1208', color: '#BA7517', minWidth: 60 }}
                                    >
                                        {form.currency}
                                    </button>
                                    <input
                                        value={form.price}
                                        onChange={(e) => set('price', e.target.value)}
                                        placeholder={form.currency === 'USD' ? '85.000' : '50.000.000'}
                                        type="number"
                                        min="0"
                                        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                                        style={inputStyle(!!errors.price)}
                                    />
                                </div>
                            </Field>

                            Fotos
                            <Field label={`Fotos (${form.images.length}/8)`}>
                                <div className="grid grid-cols-4 gap-2">
                                    {form.images.map((file, i) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {form.images.length < 8 && (
                                        <label
                                            className="aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors text-center"
                                            style={{
                                                background: '#f0e8d8',
                                                border: '2px dashed rgba(186,117,23,0.3)',
                                                color: '#BA7517',
                                            }}
                                        >
                                            <span style={{ fontSize: 22 }}>+</span>
                                            <span className="text-[10px] mt-1 font-medium">Agregar</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                            </Field>
                        </>
                    )}
                </div>

                {/* Footer actions */}
                <div
                    className="px-8 py-5 shrink-0 flex gap-3"
                    style={{ borderTop: '1px solid rgba(186,117,23,0.12)' }}
                >
                    {step === 1 ? (
                        <button
                            onClick={() => {
                                if (!form.title.trim()) {
                                    setErrors({ title: 'Requerido' })
                                    return
                                }
                                setStep(2)
                            }}
                            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                            style={{ background: '#BA7517', color: '#fff' }}
                        >
                            Continuar →
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep(1)}
                                className="px-5 py-3 rounded-xl font-medium text-sm transition-all"
                                style={{ background: '#f0e8d8', color: '#7a6040' }}
                            >
                                ← Atrás
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                style={{ background: '#1a1208', color: '#fff', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-4 h-4 rounded-full border-2 border-amber-300 border-t-transparent animate-spin" />
                                        Publicando…
                                    </>
                                ) : (
                                    'Publicar propiedad'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ── RIGHT PANEL: Map ── */}
            <div className="hidden md:flex flex-1 flex-col p-4 gap-3">
                <div
                    className="flex-1 rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                >
                    <MapPicker
                        value={form.location}
                        onChange={(loc) => set('location', loc)}
                    />
                </div>
                <p className="text-center text-xs" style={{ color: '#b0987a' }}>
                    Córdoba, Argentina · Hacé click en el mapa para fijar la ubicación exacta
                </p>
            </div>
        </div>
    )
}

// ── Helper components ──

function Field({
    label,
    error,
    children,
}: {
    label: string
    error?: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9a8060' }}>
                {label}
            </label>
            {children}
            {error && (
                <p className="text-xs" style={{ color: '#c0392b' }}>
                    {error}
                </p>
            )}
        </div>
    )
}

function inputStyle(hasError: boolean): React.CSSProperties {
    return {
        background: '#fff',
        border: `1.5px solid ${hasError ? '#e74c3c' : 'rgba(186,117,23,0.15)'}`,
        color: '#1a1208',
        fontFamily: "'DM Sans', sans-serif",
        transition: 'border-color 0.15s',
    }
}