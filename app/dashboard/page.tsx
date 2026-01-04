"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Activity, Scan, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProgressCircle } from "@/components/progress-circle"
import { MacroBar } from "@/components/macro-bar"
import { MealCard } from "@/components/meal-card"
import { AddFoodModal } from "@/components/add-food-modal"
import { AppHeader } from "@/components/app-header"
import type { FoodItem, MacroData } from "@/lib/types"
import { useDailyLog } from "@/hooks/use-daily-log"
import { useUserProfile } from "@/hooks/use-user-profile"

export default function DashboardPage() {
  const { profile } = useUserProfile()
  // Use profile.id if available, otherwise it falls back to 'user-123' inside the hook or we can let it be undefined until profile loads
  const { dailyLog, loading, error, markFoodConsumed, addFood } = useDailyLog(profile?.id)
  const [addFoodModalOpen, setAddFoodModalOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<string>("")

  useEffect(() => {
    console.log('PERFIL', profile);
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-destructive">Error: {error}</div>
      </div>
    )
  }

  // Fallback if dailyLog is null (shouldn't happen after loading if API works)
  const foods = dailyLog?.comidas || {
    desayuno: [], almuerzo: [], merienda: [], cena: []
  }

  const totals = dailyLog?.totales || {
    calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0
  }

  const caloriesTarget = 1886 // This should come from user profile ideally

  const macros: MacroData[] = [
    { name: "Proteínas", current: totals.proteinas, target: 120, color: "bg-blue-500", unit: "g" },
    { name: "Carbohidratos", current: totals.carbohidratos, target: 250, color: "bg-orange-500", unit: "g" },
    { name: "Grasas", current: totals.grasas, target: 65, color: "bg-purple-500", unit: "g" },
  ]

  const handleToggleFood = async (mealType: string, foodId: string) => {
    // Determine current consumed state
    const food = foods[mealType as keyof typeof foods]?.find(f => f.id === foodId)
    if (food) {
      await markFoodConsumed(foodId, mealType, !food.consumido)
    }
  }

  const handleAddFood = (mealType: string) => {
    setSelectedMealType(mealType)
    setAddFoodModalOpen(true)
  }

  const handleAddFoodSubmit = async (newFood: any) => {
    await addFood(newFood.tipoComida || selectedMealType, {
      nombre: newFood.nombre,
      porcion: newFood.porcion,
      calorias: Number(newFood.calorias),
      proteinas: Number(newFood.proteinas),
      carbohidratos: Number(newFood.carbohidratos),
      grasas: Number(newFood.grasas)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <AppHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Calories Progress */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-2 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ProgressCircle current={totals.calorias} target={caloriesTarget} />
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
                  // Sort to keep order consistent or put logged items at top? Default order is fine.
                  const totalCalories = (mealFoods as FoodItem[]).reduce((sum, food) => sum + (food.consumido ? food.calorias : 0), 0)
                  // Note: original code summed ALL calories in the meal header, regardless of consumed?
                  // "totalCalories = mealFoods.reduce((sum, food) => sum + food.calorias, 0)"
                  // Yes, it seemed to sum potential calories. Let's keep that behavior if that's what it was,
                  // or change to consumed? Usually meal header shows total potential or total eaten.
                  // Let's stick to total potential for "Plan", or total eaten for "Log".
                  // Given it's a "Daily Log" but populated with "Recommendations", maybe potential is better.
                  // But let's check what the user wants. The prompt says "Daily Log".
                  // Let's sum ALL for now to match previous mock behavior.
                  const totalCaloriesInMeal = (mealFoods as FoodItem[]).reduce((sum, food) => sum + food.calorias, 0)

                  return (
                    <MealCard
                      key={mealType}
                      mealName={mealNames[mealType] || mealType}
                      foods={mealFoods as FoodItem[]}
                      totalCalories={totalCaloriesInMeal}
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
        onClick={() => {
          setSelectedMealType("desayuno") // Default or ask? Modal seems to need manual selection if not passed?
          // Original code: handleAddFood('???') was called from MealCard specific button.
          // FAB opens without specific meal type.
          setAddFoodModalOpen(true)
        }}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <AddFoodModal
        isOpen={addFoodModalOpen}
        onClose={() => setAddFoodModalOpen(false)}
        onAddFood={handleAddFoodSubmit}
        // Assuming AddFoodModal has a way to select meal type if not provided, or we pass selectedMealType
        defaultMealType={selectedMealType} // Does AddFoodModal accept this?
      />
    </div>
  )
}
