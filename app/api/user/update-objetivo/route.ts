import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { calculateCaloriesGoal, calculateMacros } from "@/lib/utils/calories"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { objetivo, tdee } = await request.json()

    if (!objetivo || !tdee) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const caloriasDiarias = calculateCaloriesGoal(tdee, objetivo)
    const macros = calculateMacros(caloriasDiarias, objetivo)

    // Update profile in DB
    const { error } = await supabase
      .from("profiles")
      .update({
        objetivo,
        calorias_diarias: caloriasDiarias,
      })
      .eq("id", user.id)

    if (error) {
      console.error("Error updating profile objective:", error)
      return NextResponse.json({ error: "Failed to update objective" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      objetivo,
      caloriasDiarias,
      macros,
    })
  } catch (error) {
    console.error("[update-objetivo] Error updating objetivo:", error)
    return NextResponse.json({ error: "Failed to update objetivo" }, { status: 500 })
  }
}
