import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateDailyLog, updateDailyLog } from "@/lib/daily-log-helpers"
import { FoodItem } from "@/lib/types"

export async function POST(request: NextRequest) {
    try {
        const { foodItem, tipoComida, userId } = await request.json()

        if (!userId || !foodItem || !tipoComida) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const log = await getOrCreateDailyLog(userId)

        if (!log) {
            return NextResponse.json({ error: "Daily log not found" }, { status: 404 })
        }

        // Add new food
        const currentMeals = log.comidas
        const mealCategory = currentMeals[tipoComida as keyof typeof currentMeals]

        if (!mealCategory) {
            return NextResponse.json({ error: "Invalid meal category" }, { status: 400 })
        }

        // Ensure foodItem has required fields
        const newFood: FoodItem = {
            id: crypto.randomUUID(),
            ...foodItem,
            consumido: false, // Default to not consumed when adding
        }

        const updatedMeals = {
            ...currentMeals,
            [tipoComida]: [...mealCategory, newFood]
        }

        // Save and calculate totals
        const result = await updateDailyLog(log.id, userId, updatedMeals)

        return NextResponse.json(result)
    } catch (error) {
        console.error("[add-food] Error adding food:", error)
        return NextResponse.json({ error: "Failed to add food" }, { status: 500 })
    }
}
