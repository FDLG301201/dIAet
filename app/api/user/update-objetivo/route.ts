import { type NextRequest, NextResponse } from "next/server"
import { calculateCaloriesGoal, calculateMacros } from "@/lib/utils/calories"

export async function POST(request: NextRequest) {
  try {
    const { objetivo, tdee } = await request.json()

    if (!objetivo || !tdee) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const caloriasDiarias = calculateCaloriesGoal(tdee, objetivo)
    const macros = calculateMacros(caloriasDiarias, objetivo)

    return NextResponse.json({
      success: true,
      objetivo,
      caloriasDiarias,
      macros,
    })
  } catch (error) {
    console.error("[v0] Error updating objetivo:", error)
    return NextResponse.json({ error: "Failed to update objetivo" }, { status: 500 })
  }
}
