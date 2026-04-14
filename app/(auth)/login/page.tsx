'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async () => {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError('Email o contraseña incorrectos')
            setLoading(false)
            return
        }

        router.push('/')
        router.refresh()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="mb-8">
                    <h1 className="text-xl font-medium text-gray-900">
                        Z<span style={{ color: '#BA7517' }}>entry</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Ingresá a tu cuenta</p>
                </div>

                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500">{error}</p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60 mt-1"
                        style={{ backgroundColor: '#BA7517' }}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                    ¿No tenés cuenta?{' '}
                    <Link href="/register" className="text-amber-700 hover:underline">
                        Registrate
                    </Link>
                </p>
            </div>
        </div>
    )
}