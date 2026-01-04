import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/', '/auth/callback']
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route)

    // Rutas de onboarding que no requieren verificación de perfil
    const onboardingRoutes = ['/actividad', '/objetivos', '/alimentos']
    const isOnboardingRoute = onboardingRoutes.some(route => request.nextUrl.pathname === route)

    // Si el usuario no está autenticado y trata de acceder a una ruta protegida
    if (!user && !isPublicRoute && !isOnboardingRoute && !request.nextUrl.pathname.startsWith('/_next') && !request.nextUrl.pathname.startsWith('/api')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Si el usuario está autenticado
    if (user) {
        // Si trata de acceder a la página de auth, redirigir según estado del perfil
        if (request.nextUrl.pathname === '/') {
            // Verificar si el perfil está completo
            const { data: profile } = await supabase
                .from('profiles')
                .select('genero, fecha_nacimiento, altura, peso_actual, nivel_actividad, objetivo')
                .eq('id', user.id)
                .single()

            // Si el perfil está incompleto, redirigir a onboarding
            if (!profile || !profile.genero || !profile.fecha_nacimiento || !profile.altura ||
                !profile.peso_actual || !profile.nivel_actividad || !profile.objetivo) {
                const url = request.nextUrl.clone()
                url.pathname = '/actividad'
                return NextResponse.redirect(url)
            }

            // Si el perfil está completo, redirigir a dashboard
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        // Si no está en ruta de onboarding ni API, verificar que el perfil esté completo
        if (!isOnboardingRoute &&
            !request.nextUrl.pathname.startsWith('/api') &&
            request.nextUrl.pathname !== '/dashboard') {
            const { data: profile } = await supabase
                .from('profiles')
                .select('genero, fecha_nacimiento, altura, peso_actual, nivel_actividad, objetivo')
                .eq('id', user.id)
                .single()

            // Si el perfil está incompleto, redirigir a onboarding
            if (!profile || !profile.genero || !profile.fecha_nacimiento || !profile.altura ||
                !profile.peso_actual || !profile.nivel_actividad || !profile.objetivo) {
                const url = request.nextUrl.clone()
                url.pathname = '/actividad'
                return NextResponse.redirect(url)
            }
        }
    }

    return supabaseResponse
}

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
