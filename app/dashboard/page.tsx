"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Menu, Home, Target, Activity, Scan, TrendingUp, Settings, Plus } from "lucide-react"
import Link from "next/link"
import { ProgressCircle } from "@/components/progress-circle"
import { MacroBar } from "@/components/macro-bar"
import { MealCard } from "@/components/meal-card"
import { AddFoodModal } from "@/components/add-food-modal"
import type { FoodItem, MacroData } from "@/lib/types"

const mockFoods = {
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
} as Record<string, FoodItem[]>

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [foods, setFoods] = useState(mockFoods)
  const [addFoodModalOpen, setAddFoodModalOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<string>("")

  const calculateTotals = () => {
    let totalCalories = 0
    let totalProteinas = 0
    let totalCarbohidratos = 0
    let totalGrasas = 0

    Object.values(foods).forEach((mealFoods) => {
      mealFoods.forEach((food) => {
        if (food.consumido) {
          totalCalories += food.calorias
          totalProteinas += food.proteinas
          totalCarbohidratos += food.carbohidratos
          totalGrasas += food.grasas
        }
      })
    })

    return { totalCalories, totalProteinas, totalCarbohidratos, totalGrasas }
  }

  const totals = calculateTotals()
  const caloriesTarget = 1886

  const macros: MacroData[] = [
    { name: "Proteínas", current: totals.totalProteinas, target: 120, color: "bg-blue-500", unit: "g" },
    { name: "Carbohidratos", current: totals.totalCarbohidratos, target: 250, color: "bg-orange-500", unit: "g" },
    { name: "Grasas", current: totals.totalGrasas, target: 65, color: "bg-purple-500", unit: "g" },
  ]

  const handleToggleFood = (mealType: string, foodId: string) => {
    setFoods((prev) => ({
      ...prev,
      [mealType]: prev[mealType].map((food) =>
        food.id === foodId ? { ...food, consumido: !food.consumido, horaConsumo: new Date() } : food,
      ),
    }))
  }

  const handleAddFood = (mealType: string) => {
    setSelectedMealType(mealType)
    setAddFoodModalOpen(true)
  }

  const handleAddFoodSubmit = (newFood: any) => {
    const foodItem: FoodItem = {
      id: Date.now().toString(),
      nombre: newFood.nombre,
      porcion: newFood.porcion,
      calorias: newFood.calorias,
      proteinas: newFood.proteinas,
      carbohidratos: newFood.carbohidratos,
      grasas: newFood.grasas,
      esRecomendacion: false,
      consumido: false,
    }

    setFoods((prev) => ({
      ...prev,
      [newFood.tipoComida]: [...prev[newFood.tipoComida], foodItem],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              dAIet
            </h1>
          </div>
          <nav className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="bg-primary/10">
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/progreso">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progreso
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/preferencias">
                <Settings className="w-4 h-4 mr-2" />
                Preferencias
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-card border-b shadow-lg"
        >
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-primary/10" asChild>
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Inicio
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/progreso">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progreso
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/preferencias">
                <Settings className="w-4 h-4 mr-2" />
                Preferencias
              </Link>
            </Button>
          </nav>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Calories Progress */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-2 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ProgressCircle current={totals.totalCalories} target={caloriesTarget} />
                  <div className="flex-1 space-y-4 w-full">
                    <h2 className="text-2xl font-bold">Progreso Diario</h2>
                    {macros.map((macro, index) => (
                      <MacroBar key={macro.name} macro={macro} index={index} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meals */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Comidas del Día</span>
                  <Button size="sm" asChild className="bg-primary hover:bg-secondary">
                    <Link href="/escanear">
                      <Scan className="w-4 h-4 mr-2" />
                      Escanear
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(foods).map(([mealType, mealFoods], index) => {
                  const mealNames: Record<string, string> = {
                    desayuno: "Desayuno",
                    almuerzo: "Almuerzo",
                    merienda: "Merienda",
                    cena: "Cena",
                  }
                  const totalCalories = mealFoods.reduce((sum, food) => sum + food.calorias, 0)

                  return (
                    <MealCard
                      key={mealType}
                      mealName={mealNames[mealType]}
                      foods={mealFoods}
                      totalCalories={totalCalories}
                      onToggleFood={(foodId) => handleToggleFood(mealType, foodId)}
                      onAddFood={() => handleAddFood(mealType)}
                      index={index}
                    />
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
                  <Link href="/objetivos">
                    <Target className="w-6 h-6 text-primary" />
                    <span className="text-sm">Cambiar Objetivo</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
                  <Link href="/actividad">
                    <Activity className="w-6 h-6 text-primary" />
                    <span className="text-sm">Mi Perfil</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-xl bg-primary hover:bg-secondary"
        onClick={() => setAddFoodModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddFoodModal
        isOpen={addFoodModalOpen}
        onClose={() => setAddFoodModalOpen(false)}
        onAddFood={handleAddFoodSubmit}
      />
    </div>
  )
}
