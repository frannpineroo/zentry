'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleRegister = async () => {
        setLoading(true)
        setError(null)

        if (!fullName || !email || !password) {
            setError('Completá todos los campos obligatorios')
            setLoading(false)
            return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
            }
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        // Crear el perfil en la tabla profiles
        if (data.user) {
            await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: fullName,
                phone: phone || null,
            })
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
                    <p className="text-sm text-gray-500 mt-1">Creá tu cuenta</p>
                </div>

                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Nombre completo *</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Juan Pérez"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Teléfono (para WhatsApp)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+54 9 351 000 0000"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Contraseña *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-400 transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500">{error}</p>
                    )}

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60 mt-1"
                        style={{ backgroundColor: '#BA7517' }}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                    ¿Ya tenés cuenta?{' '}
                    <Link href="/login" className="text-amber-700 hover:underline">
                        Iniciá sesión
                    </Link>
                </p>
            </div>
        </div>
    )
}