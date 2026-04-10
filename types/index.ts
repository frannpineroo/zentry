export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'
export type OperationType = 'venta' | 'alquiler'
export type PropertyStatus = 'active' | 'paused' | 'sold'

export interface Profile {
    id: string
    full_name: string | null
    phone: string | null
    avatar_url: string | null
    created_at: string
}

export interface Neighborhood {
    id: string
    name: string
    polygon: number[][][] | null
}

export interface Property {
    id: string
    user_id: string
    title: string
    description: string | null
    price: number
    currency: string
    type: PropertyType
    operation: OperationType
    address: string
    neighborhood: string | null
    neighborhood_id: string | null
    lat: number
    lng: number
    bedrooms: number | null
    bathrooms: number | null
    area_m2: number | null
    status: PropertyStatus
    created_at: string
    profiles?: Profile
    property_images?: PropertyImage[]
}

export interface PropertyImage {
    id: string
    property_id: string
    url: string
    order_index: number
}

export interface Favorite {
    user_id: string
    property_id: string
    created_at: string
}