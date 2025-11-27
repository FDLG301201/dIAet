import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { foodDescription } = await request.json()

    if (!foodDescription) {
      return NextResponse.json({ error: "Food description is required" }, { status: 400 })
    }

    // const { GoogleGenerativeAI } = require("@google/generative-ai")
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Analiza el siguiente alimento y devuelve SOLO un objeto JSON válido (sin markdown, sin bloques de código) con esta estructura exacta:
{
  "nombre": "nombre descriptivo del alimento",
  "porcion": "tamaño de porción estimado",
  "calorias": número_entero,
  "proteinas": número_entero,
  "carbohidratos": número_entero,
  "grasas": número_entero
}

Alimento descrito por el usuario: "${foodDescription}"

Responde ÚNICAMENTE con el JSON, sin explicaciones adicionales.`

    // Mock response for development
    // In production, replace with: const result = await model.generateContent(prompt)
    // const response = result.response.text()
    // const foodData = JSON.parse(response)

    // Mock data based on common foods
    const mockData = {
      nombre: foodDescription,
      porcion: "1 porción estándar",
      calorias: 250,
      proteinas: 15,
      carbohidratos: 30,
      grasas: 8,
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("[v0] Error in analyze-food API:", error)
    return NextResponse.json({ error: "Failed to analyze food" }, { status: 500 })
  }
}
