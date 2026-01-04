import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateDailyLog, updateDailyLog } from "@/lib/daily-log-helpers"

export async function POST(request: NextRequest) {
  try {
    const { foodId, tipoComida, consumido, userId } = await request.json()

    if (!userId || !foodId || !tipoComida) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const log = await getOrCreateDailyLog(userId)

    if (!log) {
      return NextResponse.json({ error: "Daily log not found" }, { status: 404 })
    }

    // Update food status
    const currentMeals = log.comidas
    const mealCategory = currentMeals[tipoComida as keyof typeof currentMeals]

    if (!mealCategory) {
      return NextResponse.json({ error: "Invalid meal category" }, { status: 400 })
    }

    const updatedMealCategory = mealCategory.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          consumido,
          horaConsumo: consumido ? new Date() : undefined
        }
      }
      return food
    })

    const updatedMeals = {
      ...currentMeals,
      [tipoComida]: updatedMealCategory
    }

    // Save and calculate totals
    const result = await updateDailyLog(log.id, userId, updatedMeals)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[consumed] Error updating food status:", error)
    return NextResponse.json({ error: "Failed to update food status" }, { status: 500 })
  }
}
