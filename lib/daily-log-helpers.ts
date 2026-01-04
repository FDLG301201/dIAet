import { createServerSupabaseClient } from "@/lib/supabase-server"
import { DailyLog, FoodItem, UserProfile } from "@/lib/types"
import { generateDailyMealPlan } from "./gemini"

export async function getOrCreateDailyLog(userId: string): Promise<DailyLog | null> {
  const supabase = await createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  console.log("=== getOrCreateDailyLog ===")
  console.log("User ID:", userId)
  console.log("Today:", today)
  console.log("===========================")

  // 1. Try to get existing log
  const { data: existingLog, error: fetchError } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("fecha", today)
    .single()

  if (existingLog) {
    console.log("=== Existing Daily Log Found ===")
    console.log("Log ID:", existingLog.id)
    console.log("Fecha:", existingLog.fecha)
    console.log("Skipping Gemini generation (log already exists)")
    console.log("================================")
    return {
      id: existingLog.id,
      userId: existingLog.user_id,
      fecha: new Date(existingLog.fecha),
      comidas: existingLog.comidas,
      totales: existingLog.totales,
    }
  }

  if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is "not found"
    console.error("Error fetching daily log:", fetchError)
    throw new Error("Failed to fetch daily log")
  }

  console.log("=== No Existing Log - Creating New ===")
  console.log("Will generate meal plan with Gemini AI")
  console.log("======================================")

  // 2. Create new log if not exists
  // First, get user profile for AI generation
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  // Default structure
  let initialMeals: DailyLog["comidas"] = {
    desayuno: [],
    almuerzo: [],
    merienda: [],
    cena: []
  }

  // Generate with AI if profile exists
  if (profile) {
    console.log("=== User Profile Found ===")
    console.log("Nombre:", profile.nombre)
    console.log("Objetivo:", profile.objetivo)
    console.log("Calorías diarias:", profile.calorias_diarias)
    console.log("==========================")

    const userProfile: UserProfile = {
      ...profile,
      fechaNacimiento: new Date(profile.fecha_nacimiento),
      pesoActual: profile.peso_actual,
      nivelActividad: profile.nivel_actividad,
      caloriasDiarias: profile.calorias_diarias,
      createdAt: new Date(profile.created_at)
    }

    console.log("=== Calling Gemini API ===")
    initialMeals = await generateDailyMealPlan(userProfile)
    console.log("=== Gemini API Call Complete ===")
  } else {
    console.warn("=== No Profile Found ===")
    console.warn("Using empty meal plan")
    console.warn("========================")
  }

  const initialTotals = calculateTotals(initialMeals)

  const { data: newLog, error: insertError } = await supabase
    .from("daily_logs")
    .insert({
      user_id: userId,
      fecha: today,
      comidas: initialMeals,
      totales: initialTotals
    })
    .select()
    .single()

  if (insertError) {
    console.error("Error creating daily log:", insertError)
    throw new Error("Failed to create daily log")
  }

  console.log("=== New Daily Log Created ===")
  console.log("Log ID:", newLog.id)
  console.log("=============================")

  return {
    id: newLog.id,
    userId: newLog.user_id,
    fecha: new Date(newLog.fecha),
    comidas: newLog.comidas,
    totales: newLog.totales,
  }
}

export function calculateTotals(comidas: DailyLog["comidas"]) {
  const totals = {
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  }

  Object.values(comidas).flat().forEach((food: FoodItem) => {
    if (food.consumido) {
      totals.calorias += food.calorias
      totals.proteinas += food.proteinas
      totals.carbohidratos += food.carbohidratos
      totals.grasas += food.grasas
    }
  })

  return totals
}

export async function updateDailyLog(logId: string, userId: string, comidas: DailyLog["comidas"]) {
  const supabase = await createServerSupabaseClient()
  const totals = calculateTotals(comidas)

  const { error } = await supabase
    .from("daily_logs")
    .update({
      comidas,
      totales: totals
    })
    .eq("id", logId)
    .eq("user_id", userId)

  if (error) {
    throw error
  }

  return { comidas, totals }
}
