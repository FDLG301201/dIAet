"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Info } from "lucide-react"
import { MealDetailsModal } from "./meal-details-modal"
import type { FoodItem } from "@/lib/types"

interface MealCardProps {
  mealName: string
  foods: FoodItem[]
  totalCalories: number
  onToggleFood: (foodId: string) => void
  onAddFood: () => void
  index?: number
}

export function MealCard({ mealName, foods, totalCalories, onToggleFood, onAddFood, index = 0 }: MealCardProps) {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const allConsumed = foods.length > 0 && foods.every((f) => f.consumido)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + index * 0.05 }}
      >
        <Card className={`transition-all hover:shadow-md ${allConsumed ? "bg-primary/5" : ""}`}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{mealName}</h3>
              <span className="font-bold text-primary whitespace-nowrap">{totalCalories} kcal</span>
            </div>

            <div className="space-y-2">
              {foods.map((food) => (
                <div key={food.id} className="flex items-start gap-3 group">
                  <Checkbox checked={food.consumido} onCheckedChange={() => onToggleFood(food.id)} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${food.consumido ? "line-through text-muted-foreground" : ""}`}>
                      {food.nombre}
                      {food.porcion && <span className="text-muted-foreground ml-1">({food.porcion})</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      P: {food.proteinas}g • C: {food.carbohidratos}g • G: {food.grasas}g
                    </p>
                  </div>
                  {food.esRecomendacion && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedFood(food)}
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  )}
                  <span className="text-sm font-medium whitespace-nowrap">{food.calorias} kcal</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-dashed hover:bg-primary/5 hover:border-primary bg-transparent"
              onClick={onAddFood}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar alimento
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {selectedFood && (
        <MealDetailsModal
          food={selectedFood}
          isOpen={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          onMarkConsumed={() => {
            onToggleFood(selectedFood.id)
            setSelectedFood(null)
          }}
        />
      )}
    </>
  )
}
