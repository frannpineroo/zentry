'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user))

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <header className="w-full bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between z-50">
            <Link href="/" className="text-lg font-medium tracking-tight text-gray-900 no-underline">
                Z<span style={{ color: '#BA7517' }}>entry</span>
            </Link>

            <nav className="flex items-center gap-3">
                {user ? (
                    <>
                        <Link
                            href="/publicar"
                            className="text-sm px-4 py-1.5 rounded-lg text-white transition-colors"
                            style={{ backgroundColor: '#BA7517' }}
                        >
                            Publicar
                        </Link>
                        <Link
                            href="/profile"
                            className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Mi perfil
                        </Link>

                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            href="/register"
                            className="text-sm px-4 py-1.5 rounded-lg text-white transition-colors"
                            style={{ backgroundColor: '#BA7517' }}
                        >
                            Publicar
                        </Link>
                    </>
                )}
            </nav>
        </header>
    )
}