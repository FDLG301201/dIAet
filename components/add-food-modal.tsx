"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles } from "lucide-react"

interface AddFoodModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFood: (food: {
    nombre: string
    tipoComida: string
    calorias: number
    proteinas: number
    carbohidratos: number
    grasas: number
    porcion?: string
  }) => void
  defaultMealType?: string
}

export function AddFoodModal({ isOpen, onClose, onAddFood, defaultMealType = "desayuno" }: AddFoodModalProps) {
  const [foodText, setFoodText] = useState("")
  const [tipoComida, setTipoComida] = useState<string>(defaultMealType)
  const [loading, setLoading] = useState(false)
  const [analyzedFood, setAnalyzedFood] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!foodText.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/gemini/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodDescription: foodText }),
      })

      if (!response.ok) throw new Error("Error analyzing food")

      const data = await response.json()
      setAnalyzedFood(data)
    } catch (error) {
      console.error("[v0] Error analyzing food:", error)
      alert("Error al analizar el alimento. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (analyzedFood) {
      onAddFood({
        ...analyzedFood,
        tipoComida,
      })
      setFoodText("")
      setAnalyzedFood(null)
      onClose()
    }
  }

  const handleCancel = () => {
    setFoodText("")
    setAnalyzedFood(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Alimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food-input">¿Qué comiste?</Label>
            <Input
              id="food-input"
              placeholder="Ej: 2 huevos revueltos con pan tostado"
              value={foodText}
              onChange={(e) => setFoodText(e.target.value)}
              disabled={loading || !!analyzedFood}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Tipo de comida</Label>
            <Select value={tipoComida} onValueChange={setTipoComida} disabled={loading}>
              <SelectTrigger id="meal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desayuno">Desayuno</SelectItem>
                <SelectItem value="almuerzo">Almuerzo</SelectItem>
                <SelectItem value="merienda">Merienda</SelectItem>
                <SelectItem value="cena">Cena</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!analyzedFood && (
            <Button
              onClick={handleAnalyze}
              disabled={loading || !foodText.trim()}
              className="w-full bg-primary hover:bg-secondary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analizando con IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analizar con IA
                </>
              )}
            </Button>
          )}

          {analyzedFood && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Resultado del análisis:</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Alimento:</span>
                  <span className="ml-2 font-medium">{analyzedFood.nombre}</span>
                </p>
                {analyzedFood.porcion && (
                  <p>
                    <span className="text-muted-foreground">Porción:</span>
                    <span className="ml-2 font-medium">{analyzedFood.porcion}</span>
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <p>
                    <span className="text-muted-foreground">Calorías:</span>
                    <span className="ml-2 font-medium">{analyzedFood.calorias} kcal</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Proteínas:</span>
                    <span className="ml-2 font-medium">{analyzedFood.proteinas}g</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Carbohidratos:</span>
                    <span className="ml-2 font-medium">{analyzedFood.carbohidratos}g</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Grasas:</span>
                    <span className="ml-2 font-medium">{analyzedFood.grasas}g</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          {analyzedFood && (
            <Button onClick={handleConfirm} className="bg-primary hover:bg-secondary">
              Confirmar y Agregar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
