'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

const OPERATIONS = ['Venta', 'Alquiler']
const TYPES = ['Casa', 'Departamento', 'Terreno', 'Local', 'Oficina']

export default function SearchBar() {
    const [operation, setOperation] = useState('Venta')

    return (
        <div className="w-full bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-2 flex-wrap z-40">
            <div className="flex items-center gap-2 flex-1 min-w-48 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Buscar por barrio, dirección o zona..."
                    className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
                />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
                {OPERATIONS.map((op) => (
                    <button
                        key={op}
                        onClick={() => setOperation(op)}
                        className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                        style={
                            operation === op
                                ? {
                                    background: '#FAEEDA',
                                    borderColor: '#FAC775',
                                    color: '#854F0B',
                                }
                                : {
                                    background: 'white',
                                    borderColor: '#e5e7eb',
                                    color: '#6b7280',
                                }
                        }
                    >
                        {op}
                    </button>
                ))}

                <FilterPill label="Tipo" options={TYPES} />
                <FilterPill label="Precio" options={[]} />
                <FilterPill label="Ambientes" options={['1', '2', '3', '4+']} />
            </div>
        </div>
    )
}

function FilterPill({ label, options }: { label: string; options: string[] }) {
    return (
        <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 bg-white hover:border-gray-300 transition-colors flex items-center gap-1">
            {label}
            <span className="text-gray-300 text-xs">▾</span>
        </button>
    )
}