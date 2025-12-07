// Tipos para datos de onboarding
export interface OnboardingActivityData {
    gender: 'male' | 'female'
    birthdate: string // YYYY-MM-DD
    height: number // cm
    weight: number // kg
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'high'
}

export interface OnboardingGoalData {
    goal: 'perder_grasa' | 'mantener' | 'ganar_musculo'
}

export interface OnboardingFoodData {
    selectedFoods: string[]
}

export interface CompleteOnboardingData {
    gender: string // 'hombre' | 'mujer' (DB format)
    birthdate: string
    height: number
    weight: number
    activityLevel: string // 'sedentario' | 'ligera' | 'moderada' | 'alta' (DB format)
    goal: string
    preferences: string[]
    dailyCalories: number
}

// Claves para sessionStorage
const STORAGE_KEYS = {
    ACTIVITY: 'onboarding_activity',
    GOAL: 'onboarding_goal',
    FOODS: 'onboarding_foods',
}

// Mapeo de valores frontend (inglés) a base de datos (español)
export function mapGenderToDb(gender: 'male' | 'female'): 'hombre' | 'mujer' {
    const mapping = {
        male: 'hombre' as const,
        female: 'mujer' as const,
    }
    return mapping[gender]
}

export function mapActivityLevelToDb(
    level: 'sedentary' | 'light' | 'moderate' | 'high'
): 'sedentario' | 'ligera' | 'moderada' | 'alta' {
    const mapping = {
        sedentary: 'sedentario' as const,
        light: 'ligera' as const,
        moderate: 'moderada' as const,
        high: 'alta' as const,
    }
    return mapping[level]
}

// Guardar datos de actividad
export function saveActivityData(data: OnboardingActivityData): void {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(data))
    }
}

// Recuperar datos de actividad
export function getActivityData(): OnboardingActivityData | null {
    if (typeof window !== 'undefined') {
        const data = sessionStorage.getItem(STORAGE_KEYS.ACTIVITY)
        return data ? JSON.parse(data) : null
    }
    return null
}

// Guardar objetivo
export function saveGoalData(data: OnboardingGoalData): void {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(data))
    }
}

// Recuperar objetivo
export function getGoalData(): OnboardingGoalData | null {
    if (typeof window !== 'undefined') {
        const data = sessionStorage.getItem(STORAGE_KEYS.GOAL)
        return data ? JSON.parse(data) : null
    }
    return null
}

// Guardar alimentos
export function saveFoodData(data: OnboardingFoodData): void {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(data))
    }
}

// Recuperar alimentos
export function getFoodData(): OnboardingFoodData | null {
    if (typeof window !== 'undefined') {
        const data = sessionStorage.getItem(STORAGE_KEYS.FOODS)
        return data ? JSON.parse(data) : null
    }
    return null
}

// Calcular calorías diarias usando fórmula Harris-Benedict revisada
export function calculateDailyCalories(
    gender: 'male' | 'female',
    weight: number, // kg
    height: number, // cm
    birthdate: string, // YYYY-MM-DD
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'high',
    goal: 'perder_grasa' | 'mantener' | 'ganar_musculo'
): number {
    // Calcular edad
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
    }

    // Tasa Metabólica Basal (TMB) - Harris-Benedict
    let bmr: number
    if (gender === 'male') {
        bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    } else {
        bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
    }

    // Multiplicador de actividad
    const activityMultipliers = {
        sedentary: 1.2, // Poco o ningún ejercicio
        light: 1.375, // Ejercicio ligero 1-3 días/semana
        moderate: 1.55, // Ejercicio moderado 3-5 días/semana
        high: 1.725, // Ejercicio intenso 6-7 días/semana
    }

    // Calorías de mantenimiento
    const maintenanceCalories = bmr * activityMultipliers[activityLevel]

    // Ajuste según objetivo
    let finalCalories: number
    if (goal === 'perder_grasa') {
        // Déficit del 20%
        finalCalories = maintenanceCalories * 0.8
    } else if (goal === 'ganar_musculo') {
        // Superávit del 10%
        finalCalories = maintenanceCalories * 1.1
    } else {
        // Mantener
        finalCalories = maintenanceCalories
    }

    return Math.round(finalCalories)
}

// Obtener todos los datos de onboarding y prepararlos para la BD
export function getCompleteOnboardingData(): CompleteOnboardingData | null {
    const activityData = getActivityData()
    const goalData = getGoalData()
    const foodData = getFoodData()

    if (!activityData || !goalData || !foodData) {
        return null
    }

    const dailyCalories = calculateDailyCalories(
        activityData.gender,
        activityData.weight,
        activityData.height,
        activityData.birthdate,
        activityData.activityLevel,
        goalData.goal
    )

    return {
        gender: mapGenderToDb(activityData.gender),
        birthdate: activityData.birthdate,
        height: activityData.height,
        weight: activityData.weight,
        activityLevel: mapActivityLevelToDb(activityData.activityLevel),
        goal: goalData.goal,
        preferences: foodData.selectedFoods,
        dailyCalories,
    }
}

// Limpiar datos de onboarding después de completar
export function clearOnboardingData(): void {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEYS.ACTIVITY)
        sessionStorage.removeItem(STORAGE_KEYS.GOAL)
        sessionStorage.removeItem(STORAGE_KEYS.FOODS)
    }
}
