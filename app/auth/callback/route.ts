import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    const supabase = await createServerSupabaseClient()

    // --- 1. Intercambiar el code de Google por la sesión ---
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Google OAuth error:', error)
            return NextResponse.json(
                { error: 'No se pudo autenticar con Google' },
                { status: 401 }
            )
        }
    }

    // --- 2. Obtener el usuario ---
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // --- 3. Redirigir donde quieras ---
    //return NextResponse.redirect(new URL('/objetivos', process.env.NEXT_PUBLIC_SUPABASE_URL))

    const redirectUrl = new URL('/objetivos', url.origin)
    return NextResponse.redirect(redirectUrl)
}
