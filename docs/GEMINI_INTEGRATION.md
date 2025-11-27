# Integración con Google Gemini API

Este documento explica cómo integrar correctamente la API de Google Gemini en dAIet.

## 1. Configuración Inicial

### Obtener API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un nuevo proyecto o selecciona uno existente
3. Genera una nueva API key
4. Guarda la key de forma segura

### Configurar Variables de Entorno

\`\`\`env
GEMINI_API_KEY=tu_api_key_aqui
\`\`\`

### Instalar SDK

\`\`\`bash
npm install @google/generative-ai
\`\`\`

## 2. Implementación

### Analizar Alimento

\`\`\`typescript
// app/api/gemini/analyze-food/route.ts
import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { foodDescription } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

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

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Parse JSON response
    const foodData = JSON.parse(response)

    return NextResponse.json(foodData)
  } catch (error) {
    console.error("Error analyzing food:", error)
    return NextResponse.json({ error: "Failed to analyze food" }, { status: 500 })
  }
}
\`\`\`

### Generar Plan de Comidas

\`\`\`typescript
// app/api/gemini/generate-meals/route.ts
import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { userId, objetivo, caloriasDiarias, alergias, preferencias } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

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

Distribuye las calorías: 25% desayuno, 35% almuerzo, 15% merienda, 25% cena.
Responde ÚNICAMENTE con el JSON, sin explicaciones adicionales.`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Clean response (remove markdown code blocks if present)
    let cleanResponse = response.trim()
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/\n?```$/, '')
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/\n?```$/, '')
    }
    
    const mealPlan = JSON.parse(cleanResponse)

    return NextResponse.json(mealPlan)
  } catch (error) {
    console.error("Error generating meal plan:", error)
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 })
  }
}
\`\`\`

## 3. Manejo de Errores

### Errores Comunes

1. **API Key Inválida**
\`\`\`typescript
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY no está configurada")
}
\`\`\`

2. **Respuesta No JSON**
\`\`\`typescript
try {
  const data = JSON.parse(response)
  return data
} catch (parseError) {
  console.error("Error parsing Gemini response:", response)
  // Intentar limpiar la respuesta
  const cleanedResponse = cleanJsonResponse(response)
  return JSON.parse(cleanedResponse)
}
\`\`\`

3. **Límite de Tasa (Rate Limit)**
\`\`\`typescript
async function retryWithBackoff(fn: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      if (error.status === 429 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
        continue
      }
      throw error
    }
  }
}
\`\`\`

## 4. Optimización

### Cache de Respuestas

\`\`\`typescript
// Cachear respuestas comunes
const cache = new Map<string, any>()

async function analyzeWithCache(foodDescription: string) {
  const cacheKey = foodDescription.toLowerCase().trim()
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  
  const result = await analyzeFoodWithGemini(foodDescription)
  cache.set(cacheKey, result)
  
  return result
}
\`\`\`

### Validación de Respuestas

\`\`\`typescript
import { z } from "zod"

const FoodSchema = z.object({
  nombre: z.string(),
  porcion: z.string().optional(),
  calorias: z.number().int().positive(),
  proteinas: z.number().int().nonnegative(),
  carbohidratos: z.number().int().nonnegative(),
  grasas: z.number().int().nonnegative(),
})

function validateFoodResponse(data: unknown) {
  return FoodSchema.parse(data)
}
\`\`\`

## 5. Mejores Prácticas

1. **Siempre especifica el formato de respuesta en el prompt**
2. **Limpia las respuestas antes de parsear JSON**
3. **Implementa reintentos para errores temporales**
4. **Valida las respuestas con schemas**
5. **Usa caché para respuestas comunes**
6. **Maneja errores de forma elegante en el cliente**

## 6. Testing

\`\`\`typescript
// __tests__/gemini-integration.test.ts
import { analyzeFood } from "@/lib/gemini"

describe("Gemini Integration", () => {
  it("should analyze food correctly", async () => {
    const result = await analyzeFood("2 huevos revueltos")
    
    expect(result).toHaveProperty("nombre")
    expect(result).toHaveProperty("calorias")
    expect(result.calorias).toBeGreaterThan(0)
  })

  it("should handle invalid input", async () => {
    await expect(analyzeFood("")).rejects.toThrow()
  })
})
\`\`\`

## 7. Límites y Cuotas

- **Gratis**: 60 solicitudes por minuto
- **Pay-as-you-go**: Mayor límite según plan

Monitorea tu uso en [Google AI Studio](https://makersuite.google.com/)
