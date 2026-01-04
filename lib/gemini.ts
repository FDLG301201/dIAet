import { UserProfile, DailyLog, FoodItem } from "@/lib/types"

// Gemini API Configuration from environment variables
const apiKey = process.env.GEMINI_API_KEY || ""
const baseUrl = process.env.GEMINI_API_BASE_URL
const apiVersion = process.env.GEMINI_API_VERSION
const modelName = process.env.GEMINI_MODEL_NAME

// Construct full API URL
const GEMINI_API_URL = `${baseUrl}/${apiVersion}/models/${modelName}:generateContent`

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export async function generateDailyMealPlan(profile: UserProfile): Promise<DailyLog["comidas"]> {
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set")
    return getFallbackMealPlan()
  }

  const prompt = `
    Genera un plan de comidas diario personalizado para una persona con el siguiente perfil:
    - Género: ${profile.genero}
    - Objetivo: ${profile.objetivo}
    - Calorías diarias: ${profile.caloriasDiarias}
    - Preferencias: ${profile.preferencias.join(", ")}
    - Alergias: ${profile.alergias.join(", ")}

    El plan debe incluir 4 comidas: desayuno, almuerzo, merienda y cena.
    
    Devuelve SOLAMENTE un JSON con la siguiente estructura, sin markdown ni explicaciones adicionales:
    {
      "desayuno": [ { "nombre": "...", "calorias": 123, "proteinas": 10, "carbohidratos": 20, "grasas": 5, "porcion": "..." } ],
      "almuerzo": [ ... ],
      "merienda": [ ... ],
      "cena": [ ... ]
    }
    
    Asegúrate de que la suma total de calorías esté cerca de ${profile.caloriasDiarias}.
    Los campos deben ser numéricos salvo nombre y porcion.
  `

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  }

  try {
    // Generate curl command for debugging
    const curlCommand = `curl --location '${GEMINI_API_URL}' \\
  --header 'x-goog-api-key: ${apiKey}' \\
  --header 'Content-Type: application/json' \\
  --data '${JSON.stringify(requestBody, null, 2)}'`

    console.log("=== Gemini API Curl Command ===")
    console.log(curlCommand)
    console.log("================================")

    // Make HTTP request to Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("=== Gemini API Error ===")
      console.error("Status:", response.status, response.statusText)
      console.error("Error Response:", errorText)
      console.error("========================")
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data: GeminiResponse = await response.json()

    console.log("=== Gemini API Response ===")
    console.log("Status:", response.status, response.statusText)
    console.log("Headers:", Object.fromEntries(response.headers.entries()))
    console.log("Full Response Data:", JSON.stringify(data, null, 2))
    console.log("===========================")

    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error("=== No Text Content Found ===")
      console.error("Response structure:", JSON.stringify(data, null, 2))
      console.error("=============================")
      throw new Error("No text content in Gemini response")
    }

    console.log("=== Extracted Text ===")
    console.log(text)
    console.log("======================")

    // Clean markdown code blocks if present
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim()

    console.log("=== Cleaned JSON String ===")
    console.log(jsonString)
    console.log("===========================")

    const parsedData = JSON.parse(jsonString)

    // Add IDs and default fields to match FoodItem interface
    const processedData: DailyLog["comidas"] = {
      desayuno: processMeals(parsedData.desayuno),
      almuerzo: processMeals(parsedData.almuerzo),
      merienda: processMeals(parsedData.merienda),
      cena: processMeals(parsedData.cena),
    }

    return processedData
  } catch (error) {
    console.error("Error generating meal plan with Gemini:", error)
    return getFallbackMealPlan()
  }
}

function processMeals(meals: any[]): FoodItem[] {
  if (!Array.isArray(meals)) return []

  return meals.map((meal) => ({
    id: crypto.randomUUID(),
    nombre: meal.nombre || "Comida",
    porcion: meal.porcion || "1 porción",
    calorias: Number(meal.calorias) || 0,
    proteinas: Number(meal.proteinas) || 0,
    carbohidratos: Number(meal.carbohidratos) || 0,
    grasas: Number(meal.grasas) || 0,
    esRecomendacion: true,
    consumido: false,
  }))
}

function getFallbackMealPlan(): DailyLog["comidas"] {
  console.warn("Using fallback meal plan")
  // Return empty structure or basic fallback
  return {
    desayuno: [],
    almuerzo: [],
    merienda: [],
    cena: [],
  }
}
