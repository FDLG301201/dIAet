// TypeScript interfaces for dAIet app

export interface UserProfile {
  id: string
  nombre: string
  email: string
  genero: "hombre" | "mujer"
  fechaNacimiento: Date
  altura: number // cm
  pesoActual: number // kg
  nivelActividad: "sedentario" | "ligera" | "moderada" | "alta"
  objetivo: "perder_grasa" | "mantener" | "ganar_musculo"
  caloriasDiarias: number // calculado
  alergias: string[]
  preferencias: string[]
  createdAt: Date
}

export interface FoodItem {
  id: string
  nombre: string
  porcion?: string
  calorias: number
  proteinas: number
  carbohidratos: number
  grasas: number
  esRecomendacion: boolean
  consumido: boolean
  horaConsumo?: Date
}

export interface DailyLog {
  id: string
  userId: string
  fecha: Date
  comidas: {
    desayuno: FoodItem[]
    almuerzo: FoodItem[]
    merienda: FoodItem[]
    cena: FoodItem[]
  }
  totales: {
    calorias: number
    proteinas: number
    carbohidratos: number
    grasas: number
  }
}

export interface RecommendedMeal {
  id: string
  userId: string
  fecha: Date
  tipoComida: "desayuno" | "almuerzo" | "merienda" | "cena"
  nombre: string
  ingredientes: { nombre: string; cantidad: string }[]
  valores: {
    calorias: number
    proteinas: number
    carbohidratos: number
    grasas: number
  }
}

export interface MacroData {
  name: string
  current: number
  target: number
  color: string
  unit: string
}
