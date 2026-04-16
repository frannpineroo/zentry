export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'
export type OperationType = 'venta' | 'alquiler'
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented'

export interface PropertyLocation {
    lat: number
    lng: number
    address: string
    neighborhood?: string
}

export interface NewPropertyFormData {
    title: string
    description: string
    price: string
    currency: 'ARS' | 'USD'
    operation: OperationType
    type: PropertyType
    bedrooms: string
    bathrooms: string
    area_m2: string
    location: PropertyLocation | null
    // images: File[]
}

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'local', label: 'Local' },
    { value: 'oficina', label: 'Oficina' },
]