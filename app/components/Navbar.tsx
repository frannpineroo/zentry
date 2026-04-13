import Link from 'next/link'

export default function Navbar() {
    return (
        <header className="w-full bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between z-50">
            <Link href="/" className="text-lg font-medium tracking-tight text-gray-900 no-underline">
                Z<span style={{ color: '#BA7517' }}>entry</span>
            </Link>

            <nav className="flex items-center gap-3">
                <button className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    Iniciar sesión
                </button>
                <button
                    className="text-sm px-4 py-1.5 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: '#BA7517' }}
                >
                    Publicar
                </button>
            </nav>
        </header>
    )
}