import { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PublishFormWrapper from '@/components/publish/PublishFormWrapper'

export const metadata: Metadata = {
    title: 'Publicar propiedad · Zentry',
    description: 'Publicá tu propiedad en el marketplace inmobiliario de Córdoba',
}

export default async function PublishPage() {
    // Protect the route — redirect to login if not authenticated
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login?next=/publicar')
    }

    return <PublishFormWrapper userId={user.id} />
}