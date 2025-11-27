import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, objetivo, caloriasDiarias, alergias, preferencias } = await request.json()

    const prompt = `Genera un plan de comidas personalizado para un día completo en formato JSON.

Usuario con perfil:
- Objetivo: ${objetivo}
- Calorías diarias: ${caloriasDiarias}
- Alergias: ${alergias?.join(", ") || "ninguna"}
- Preferencias: ${preferencias?.join(", ") || "ninguna"}

Devuelve SOLO un objeto JSON válido con esta estructura:
{
  "desayuno": {
    "nombre": "nombre de la comida",
    "ingredientes": [{"nombre": "ingrediente", "cantidad": "100g"}],
    "calorias": número,
    "proteinas": número,
    "carbohidratos": número,
    "grasas": número
  },
  "almuerzo": {...},
  "merienda": {...},
  "cena": {...}
}

Distribuye las calorías: 25% desayuno, 35% almuerzo, 15% merienda, 25% cena
Responde ÚNICAMENTE con el JSON.`

    // Mock meal plan for development
    const mockMealPlan = {
      desayuno: {
        nombre: "Avena con frutas y nueces",
        ingredientes: [
          { nombre: "Avena", cantidad: "60g" },
          { nombre: "Plátano", cantidad: "1 unidad" },
          { nombre: "Fresas", cantidad: "100g" },
          { nombre: "Almendras", cantidad: "20g" },
        ],
        calorias: Math.round(caloriasDiarias * 0.25),
        proteinas: 15,
        carbohidratos: 60,
        grasas: 12,
      },
      almuerzo: {
        nombre: "Pechuga de pollo con quinoa y vegetales",
        ingredientes: [
          { nombre: "Pechuga de pollo", cantidad: "150g" },
          { nombre: "Quinoa", cantidad: "80g" },
          { nombre: "Brócoli", cantidad: "100g" },
          { nombre: "Zanahoria", cantidad: "80g" },
        ],
        calorias: Math.round(caloriasDiarias * 0.35),
        proteinas: 45,
        carbohidratos: 50,
        grasas: 15,
      },
      merienda: {
        nombre: "Yogurt griego con granola",
        ingredientes: [
          { nombre: "Yogurt griego", cantidad: "150g" },
          { nombre: "Granola", cantidad: "30g" },
          { nombre: "Miel", cantidad: "1 cucharada" },
        ],
        calorias: Math.round(caloriasDiarias * 0.15),
        proteinas: 18,
        carbohidratos: 35,
        grasas: 8,
      },
      cena: {
        nombre: "Salmón con batata y espárragos",
        ingredientes: [
          { nombre: "Filete de salmón", cantidad: "140g" },
          { nombre: "Batata", cantidad: "150g" },
          { nombre: "Espárragos", cantidad: "100g" },
          { nombre: "Aceite de oliva", cantidad: "1 cucharada" },
        ],
        calorias: Math.round(caloriasDiarias * 0.25),
        proteinas: 35,
        carbohidratos: 40,
        grasas: 18,
      },
    }

    return NextResponse.json(mockMealPlan)
  } catch (error) {
    console.error("[v0] Error in generate-meals API:", error)
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 })
  }
}
