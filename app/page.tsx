import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import MapWrapper from './components/Map/MapWrapper'

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col">
      <Navbar />
      <SearchBar />
      <div className="flex-1 relative">
        <MapWrapper />
      </div>
    </main>
  )
}