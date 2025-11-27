"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import type { FoodItem } from "@/lib/types"

interface MealDetailsModalProps {
  food: FoodItem
  isOpen: boolean
  onClose: () => void
  onMarkConsumed: () => void
}

export function MealDetailsModal({ food, isOpen, onClose, onMarkConsumed }: MealDetailsModalProps) {
  // Mock ingredients for recommended meals
  const ingredients = [
    { nombre: "Pechuga de pollo", cantidad: "150g" },
    { nombre: "Arroz integral", cantidad: "100g" },
    { nombre: "Brócoli", cantidad: "80g" },
    { nombre: "Aceite de oliva", cantidad: "1 cucharada" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{food.nombre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Ingredientes:</h4>
            <ul className="space-y-1">
              {ingredients.map((ing, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {ing.nombre} - {ing.cantidad}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="font-semibold">Valores Nutricionales:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Calorías:</span>
                <span className="ml-2 font-medium">{food.calorias} kcal</span>
              </div>
              <div>
                <span className="text-muted-foreground">Proteínas:</span>
                <span className="ml-2 font-medium">{food.proteinas}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Carbohidratos:</span>
                <span className="ml-2 font-medium">{food.carbohidratos}g</span>
              </div>
              <div>
                <span className="text-muted-foreground">Grasas:</span>
                <span className="ml-2 font-medium">{food.grasas}g</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {!food.consumido && (
            <Button onClick={onMarkConsumed} className="bg-primary hover:bg-secondary">
              <Check className="w-4 h-4 mr-2" />
              Marcar como consumido
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
