// Harris-Benedict formula for calculating daily calorie needs

export function calculateBMR(peso: number, altura: number, edad: number, genero: "hombre" | "mujer"): number {
  if (genero === "hombre") {
    return 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * edad
  } else {
    return 447.593 + 9.247 * peso + 3.098 * altura - 4.33 * edad
  }
}

export function calculateTDEE(bmr: number, nivelActividad: "sedentario" | "ligera" | "moderada" | "alta"): number {
  const multipliers = {
    sedentario: 1.2,
    ligera: 1.375,
    moderada: 1.55,
    alta: 1.725,
  }
  return bmr * multipliers[nivelActividad]
}

export function calculateCaloriesGoal(tdee: number, objetivo: "perder_grasa" | "mantener" | "ganar_musculo"): number {
  switch (objetivo) {
    case "perder_grasa":
      return Math.round(tdee - 500) // Deficit of 500 kcal
    case "mantener":
      return Math.round(tdee)
    case "ganar_musculo":
      return Math.round(tdee + 300) // Surplus of 300 kcal
  }
}

export function calculateMacros(caloriasDiarias: number, objetivo: "perder_grasa" | "mantener" | "ganar_musculo") {
  let proteinas: number
  let grasas: number
  let carbohidratos: number

  if (objetivo === "perder_grasa") {
    proteinas = Math.round((caloriasDiarias * 0.35) / 4) // 35% protein
    grasas = Math.round((caloriasDiarias * 0.25) / 9) // 25% fat
    carbohidratos = Math.round((caloriasDiarias * 0.4) / 4) // 40% carbs
  } else if (objetivo === "ganar_musculo") {
    proteinas = Math.round((caloriasDiarias * 0.3) / 4) // 30% protein
    grasas = Math.round((caloriasDiarias * 0.25) / 9) // 25% fat
    carbohidratos = Math.round((caloriasDiarias * 0.45) / 4) // 45% carbs
  } else {
    proteinas = Math.round((caloriasDiarias * 0.3) / 4) // 30% protein
    grasas = Math.round((caloriasDiarias * 0.3) / 9) // 30% fat
    carbohidratos = Math.round((caloriasDiarias * 0.4) / 4) // 40% carbs
  }

  return { proteinas, grasas, carbohidratos }
}
