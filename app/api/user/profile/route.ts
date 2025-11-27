import { type NextRequest, NextResponse } from "next/server"
import { calculateBMR, calculateTDEE, calculateCaloriesGoal, calculateMacros } from "@/lib/utils/calories"

// Mock user profile - Replace with actual database
let mockUserProfile = {
  id: "user-123",
  nombre: "Juan Pérez",
  email: "juan@example.com",
  genero: "hombre" as const,
  fechaNacimiento: new Date("1990-05-15"),
  altura: 175,
  pesoActual: 75,
  nivelActividad: "moderada" as const,
  objetivo: "mantener" as const,
  caloriasDiarias: 2200,
  alergias: ["Gluten", "Mariscos"],
  preferencias: ["Vegetariano"],
  createdAt: new Date(),
}

export async function GET() {
  try {
    const edad = new Date().getFullYear() - mockUserProfile.fechaNacimiento.getFullYear()
    const bmr = calculateBMR(mockUserProfile.pesoActual, mockUserProfile.altura, edad, mockUserProfile.genero)
    const tdee = calculateTDEE(bmr, mockUserProfile.nivelActividad)
    const caloriasDiarias = calculateCaloriesGoal(tdee, mockUserProfile.objetivo)
    const macros = calculateMacros(caloriasDiarias, mockUserProfile.objetivo)

    return NextResponse.json({
      ...mockUserProfile,
      caloriasDiarias,
      macros,
    })
  } catch (error) {
    console.error("[v0] Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()

    mockUserProfile = { ...mockUserProfile, ...updates }

    return NextResponse.json({ success: true, profile: mockUserProfile })
  } catch (error) {
    console.error("[v0] Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
