'use client'

import { useState } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import MapWrapper from './components/Map/MapWrapper'
import type { PropertyFilters } from '@/types'

export default function Home() {
  const [filters, setFilters] = useState<PropertyFilters>({})

  return (
    <main className="w-screen h-screen flex flex-col">
      <Navbar />
      <SearchBar filters={filters} onFiltersChange={setFilters} />
      <div className="flex-1 relative">
        <MapWrapper filters={filters} />
      </div>
    </main>
  )
}