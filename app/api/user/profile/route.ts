import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { calculateBMR, calculateTDEE, calculateCaloriesGoal, calculateMacros } from "@/lib/utils/calories"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Calculate dynamic values based on profile
    const edad = new Date().getFullYear() - new Date(profile.fecha_nacimiento).getFullYear()
    const bmr = calculateBMR(Number(profile.peso_actual), Number(profile.altura), edad, profile.genero)
    const tdee = calculateTDEE(bmr, profile.nivel_actividad)
    const caloriasDiarias = calculateCaloriesGoal(tdee, profile.objetivo)
    const macros = calculateMacros(caloriasDiarias, profile.objetivo)

    // Transform snake_case DB fields to camelCase for frontend if necessary, 
    // or keep consistency. The mock used camelCase. 
    // Let's adapt to what the frontend expects based on the mock.
    const mappedProfile = {
      id: profile.id,
      nombre: profile.nombre,
      email: profile.email,
      genero: profile.genero,
      fechaNacimiento: profile.fecha_nacimiento, // Date string from DB is fine, or new Date()
      altura: profile.altura,
      pesoActual: profile.peso_actual,
      nivelActividad: profile.nivel_actividad,
      objetivo: profile.objetivo,
      caloriasDiarias: caloriasDiarias, // Calculated
      alergias: profile.alergias || [],
      preferencias: profile.preferencias || [],
      createdAt: profile.created_at
    }

    return NextResponse.json({
      ...mappedProfile,
      macros,
    })
  } catch (error) {
    console.error("[profile] Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    // Map camelCase updates to snake_case for DB
    const dbUpdates: any = {}
    if (updates.nombre) dbUpdates.nombre = updates.nombre
    if (updates.genero) dbUpdates.genero = updates.genero
    if (updates.fechaNacimiento) dbUpdates.fecha_nacimiento = updates.fechaNacimiento
    if (updates.altura) dbUpdates.altura = updates.altura
    if (updates.pesoActual) dbUpdates.peso_actual = updates.pesoActual
    if (updates.nivelActividad) dbUpdates.nivel_actividad = updates.nivelActividad
    if (updates.objetivo) dbUpdates.objetivo = updates.objetivo
    if (updates.alergias) dbUpdates.alergias = updates.alergias
    if (updates.preferencias) dbUpdates.preferencias = updates.preferencias

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating profile in DB:", error)
      throw error
    }

    // Map back to camelCase for response
    const mappedProfile = {
      id: updatedProfile.id,
      nombre: updatedProfile.nombre,
      email: updatedProfile.email,
      genero: updatedProfile.genero,
      fechaNacimiento: updatedProfile.fecha_nacimiento,
      altura: updatedProfile.altura,
      pesoActual: updatedProfile.peso_actual,
      nivelActividad: updatedProfile.nivel_actividad,
      objetivo: updatedProfile.objetivo,
      // Recalculate calories if needed, or let next GET handle it. Frontend might update local state.
      alergias: updatedProfile.alergias,
      preferencias: updatedProfile.preferencias,
      createdAt: updatedProfile.created_at
    }

    return NextResponse.json({ success: true, profile: mappedProfile })
  } catch (error) {
    console.error("[profile] Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
