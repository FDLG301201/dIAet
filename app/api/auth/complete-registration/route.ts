import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            email,
            password,
            name,
            gender,
            birthdate,
            height,
            weight,
            activityLevel,
            goal,
            preferences,
            dailyCalories
        } = body

        // Validar datos mínimos
        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Faltan datos de registro' }, { status: 400 })
        }

        // Crear cliente de Supabase con permisos de admin para poder escribir en profiles sin sesión
        // El cliente normal no tendría sesión todavía tras el signUp si hay confirmación de email
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // 1. Crear el usuario en Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre: name,  // Cambiado de full_name para consistencia
                    role: 'user'
                }
            }
        })

        if (authError) {
            console.error("Error creating user:", authError)
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'No se pudo crear el usuario' }, { status: 500 })
        }

        const userId = authData.user.id

        // 2. Crear el perfil (INSERT en lugar de UPSERT ya que el trigger está deshabilitado)
        // IMPORTANTE: Ahora incluimos el campo 'email' para evitar violación de constraint NOT NULL
        try {
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .insert({
                    id: userId,
                    email: email,  // ✅ CRÍTICO: Incluir email para evitar constraint violation
                    nombre: name,
                    genero: gender,
                    fecha_nacimiento: birthdate,
                    altura: height,
                    peso_actual: weight,
                    nivel_actividad: activityLevel,
                    objetivo: goal,
                    preferencias: preferences || [],
                    calorias_diarias: dailyCalories
                })

            if (profileError) {
                throw profileError
            }

            return NextResponse.json({
                success: true,
                userId: userId,
                message: 'Usuario registrado y perfil configurado correctamente'
            })

        } catch (profileError: any) {
            console.error("Error creating profile:", profileError)

            // ROLLBACK: Eliminar el usuario de Auth si falla la creación del perfil
            // Esto garantiza que no tengamos usuarios huérfanos sin perfil
            try {
                await supabaseAdmin.auth.admin.deleteUser(userId)
                console.log(`Usuario ${userId} eliminado debido a fallo en creación de perfil`)
            } catch (deleteError: any) {
                console.error("Error al eliminar usuario durante rollback:", deleteError)
            }

            return NextResponse.json({
                error: 'Error al crear el perfil de usuario',
                details: profileError.message,
                hint: 'El registro fue revertido. Por favor, intenta nuevamente.'
            }, { status: 500 })
        }

    } catch (error: any) {
        console.error('Error en API de registro completo:', error)
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 })
    }
}
