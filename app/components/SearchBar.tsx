'use client'

import { Search } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { PropertyFilters, PropertyType, OperationType } from '@/types'

const OPERATIONS: { label: string; value: OperationType }[] = [
    { label: 'Venta', value: 'venta' },
    { label: 'Alquiler', value: 'alquiler' },
]

const TYPES: { label: string; value: PropertyType }[] = [
    { label: 'Casa', value: 'casa' },
    { label: 'Departamento', value: 'departamento' },
    { label: 'Terreno', value: 'terreno' },
    { label: 'Local', value: 'local' },
    { label: 'Oficina', value: 'oficina' },
]

const BEDROOMS = [
    { label: '1+', value: 1 },
    { label: '2+', value: 2 },
    { label: '3+', value: 3 },
    { label: '4+', value: 4 },
]

interface Props {
    filters: PropertyFilters
    onFiltersChange: (filters: PropertyFilters) => void
}

export default function SearchBar({ filters, onFiltersChange }: Props) {
    const set = (patch: Partial<PropertyFilters>) =>
        onFiltersChange({ ...filters, ...patch })

    const toggle = (key: keyof PropertyFilters, value: any) =>
        onFiltersChange({ ...filters, [key]: filters[key] === value ? undefined : value })

    return (
        <div className="w-full bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2 flex-wrap z-40">
            {/* Search input */}
            <div className="flex items-center gap-2 flex-1 min-w-48 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input
                    type="text"
                    value={filters.search ?? ''}
                    onChange={(e) => set({ search: e.target.value || undefined })}
                    placeholder="Buscar por barrio, dirección o zona..."
                    className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
                />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
                {/* Operación */}
                {OPERATIONS.map((op) => (
                    <button
                        key={op.value}
                        onClick={() => toggle('operation', op.value)}
                        className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                        style={
                            filters.operation === op.value
                                ? { background: '#FAEEDA', borderColor: '#FAC775', color: '#854F0B' }
                                : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }
                        }
                    >
                        {op.label}
                    </button>
                ))}

                {/* Tipo */}
                <FilterPill
                    label="Tipo"
                    active={!!filters.type}
                    options={TYPES.map((t) => ({
                        label: t.label,
                        selected: filters.type === t.value,
                        onClick: () => toggle('type', t.value),
                    }))}
                />

                {/* Ambientes */}
                <FilterPill
                    label="Ambientes"
                    active={!!filters.minBedrooms}
                    options={BEDROOMS.map((b) => ({
                        label: b.label,
                        selected: filters.minBedrooms === b.value,
                        onClick: () => toggle('minBedrooms', b.value),
                    }))}
                />
            </div>
        </div>
    )
}

function FilterPill({
    label,
    active,
    options,
}: {
    label: string
    active: boolean
    options: { label: string; selected: boolean; onClick: () => void }[]
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1"
                style={
                    active
                        ? { background: '#FAEEDA', borderColor: '#FAC775', color: '#854F0B' }
                        : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }
                }
            >
                {label}
                <span className="text-xs" style={{ color: active ? '#854F0B' : '#d1d5db' }}>▾</span>
            </button>

            {open && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-lg p-1.5 z-50 min-w-32">
                    {options.map((opt) => (
                        <button
                            key={opt.label}
                            onClick={() => { opt.onClick(); setOpen(false) }}
                            className="w-full text-left text-xs px-3 py-2 rounded-lg transition-colors"
                            style={
                                opt.selected
                                    ? { background: '#FAEEDA', color: '#854F0B' }
                                    : { color: '#374151' }
                            }
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}