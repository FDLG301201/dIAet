import { type NextRequest, NextResponse } from "next/server"
import type { DailyLog } from "@/lib/types"

// Mock daily log - Replace with actual database
const mockDailyLog: DailyLog = {
  id: "log-123",
  userId: "user-123",
  fecha: new Date(),
  comidas: {
    desayuno: [
      {
        id: "1",
        nombre: "Avena con frutas y nueces",
        porcion: "1 tazón",
        calorias: 450,
        proteinas: 15,
        carbohidratos: 60,
        grasas: 12,
        esRecomendacion: true,
        consumido: true,
        horaConsumo: new Date(),
      },
    ],
    almuerzo: [
      {
        id: "2",
        nombre: "Pechuga de pollo con quinoa",
        porcion: "200g",
        calorias: 580,
        proteinas: 45,
        carbohidratos: 50,
        grasas: 15,
        esRecomendacion: true,
        consumido: true,
        horaConsumo: new Date(),
      },
    ],
    merienda: [
      {
        id: "3",
        nombre: "Yogurt griego con granola",
        calorias: 288,
        proteinas: 18,
        carbohidratos: 35,
        grasas: 8,
        esRecomendacion: true,
        consumido: false,
      },
    ],
    cena: [
      {
        id: "4",
        nombre: "Salmón con batata",
        calorias: 500,
        proteinas: 35,
        carbohidratos: 40,
        grasas: 18,
        esRecomendacion: true,
        consumido: false,
      },
    ],
  },
  totales: {
    calorias: 1030,
    proteinas: 60,
    carbohidratos: 110,
    grasas: 27,
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user-123"

    return NextResponse.json(mockDailyLog)
  } catch (error) {
    console.error("[v0] Error fetching daily log:", error)
    return NextResponse.json({ error: "Failed to fetch daily log" }, { status: 500 })
  }
}
