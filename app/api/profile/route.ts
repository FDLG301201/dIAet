import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()

        // Verificar autenticación
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Obtener datos del body
        const body = await request.json()
        const { gender, birthdate, height, weight, activityLevel, goal, preferences, dailyCalories } = body

        // Validar campos requeridos
        if (!gender || !birthdate || !height || !weight || !activityLevel || !goal) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
        }

        // Actualizar perfil en la base de datos
        const { data, error } = await supabase
            .from('profiles')
            .update({
                genero: gender,
                fecha_nacimiento: birthdate,
                altura: height,
                peso_actual: weight,
                nivel_actividad: activityLevel,
                objetivo: goal,
                preferencias: preferences || [],
                calorias_diarias: dailyCalories,
            })
            .eq('id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Error al actualizar perfil:', error)
            return NextResponse.json({ error: 'Error al actualizar perfil', details: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, profile: data }, { status: 200 })
    } catch (error: any) {
        console.error('Error en API de perfil:', error)
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()

        // Verificar autenticación
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Obtener perfil del usuario
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

        if (error) {
            console.error('Error al obtener perfil:', error)
            return NextResponse.json({ error: 'Error al obtener perfil', details: error.message }, { status: 500 })
        }

        return NextResponse.json({ profile: data }, { status: 200 })
    } catch (error: any) {
        console.error('Error en API de perfil:', error)
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 })
    }
}
