"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { saveFoodData, getCompleteOnboardingData, clearOnboardingData } from "@/lib/onboarding"
import { useRegistration } from "@/context/RegistrationContext"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

const foodCategories = [
  {
    category: "Proteínas",
    items: [
      { id: "chicken", name: "Pollo", emoji: "🍗" },
      { id: "egg", name: "Huevo", emoji: "🥚" },
      { id: "beef", name: "Carne", emoji: "🥩" },
      { id: "fish", name: "Pescado", emoji: "🐟" },
      { id: "pork", name: "Cerdo", emoji: "🥓" },
      { id: "tuna", name: "Atún", emoji: "🐟" },
    ],
  },
  {
    category: "Carbohidratos",
    items: [
      { id: "potato", name: "Papa", emoji: "🥔" },
      { id: "cheese", name: "Queso", emoji: "🧀" },
      { id: "popcorn", name: "Palomitas", emoji: "🍿" },
      { id: "bread", name: "Pan", emoji: "🍞" },
      { id: "carrot", name: "Zanahoria", emoji: "🥕" },
      { id: "pasta", name: "Pasta", emoji: "🍝" },
    ],
  },
  {
    category: "Grasas",
    items: [
      { id: "avocado", name: "Aguacate", emoji: "🥑" },
      { id: "nuts", name: "Nueces", emoji: "🥜" },
      { id: "oil", name: "Aceite", emoji: "🫒" },
      { id: "butter", name: "Mantequilla", emoji: "🧈" },
      { id: "olives", name: "Aceitunas", emoji: "🫒" },
    ],
  },
  {
    category: "Lácteos",
    items: [
      { id: "milk", name: "Leche", emoji: "🥛" },
      { id: "cheese2", name: "Queso", emoji: "🧀" },
      { id: "yogurt", name: "Yogurt", emoji: "🥛" },
    ],
  },
  {
    category: "Frutas",
    items: [
      { id: "apple", name: "Manzana", emoji: "🍎" },
      { id: "strawberry", name: "Fresa", emoji: "🍓" },
      { id: "banana", name: "Banano", emoji: "🍌" },
      { id: "pineapple", name: "Piña", emoji: "🍍" },
      { id: "lemon", name: "Limón", emoji: "🍋" },
      { id: "watermelon", name: "Sandía", emoji: "🍉" },
    ],
  },
]

export default function AlimentosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const { registrationData, isRegistrationFlow, clearRegistrationData } = useRegistration()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    } else if (!isRegistrationFlow) {
      router.replace("/")
    }
  }, [user, isRegistrationFlow, router])

  if (!isRegistrationFlow && !user) {
    return null
  }

  const allFoodIds = foodCategories.flatMap((cat) => cat.items.map((item) => item.id))

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedFoods(allFoodIds)
    } else {
      setSelectedFoods([])
    }
  }

  const handleFoodToggle = (foodId: string) => {
    setSelectedFoods((prev) => (prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]))
  }

  const handleComplete = async () => {
    setLoading(true)

    try {
      // Guardar preferencias de alimentos
      saveFoodData({ selectedFoods })

      // Obtener todos los datos de onboarding
      const onboardingData = getCompleteOnboardingData()

      if (!onboardingData || !registrationData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Faltan datos del registro. Por favor completa todos los pasos.",
        })
        if (!registrationData) router.push("/register")
        else router.push("/actividad")
        return
      }

      // Enviar datos al backend (crear usuario + perfil)
      const response = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...registrationData,
          ...onboardingData
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear cuenta")
      }

      // Limpiar datos
      clearOnboardingData()
      clearRegistrationData()

      toast({
        title: "¡Cuenta creada!",
        description: "Tu perfil ha sido configurado correctamente. Por favor verifica tu email.",
        duration: 5000,
      })

      // Wait a moment for the toast? Or just redirect. 
      // Ideally redirect to a "Verify your email" page or back to login with a message.
      // Since supabase usually requires email verification, they can't login yet.
      // Redirecting to login page with a success query param or state?
      // Or if the user is automatically logged in (if email confirmation is off), then dashboard.
      // Assuming email confirmation is ON based on previous conversation context.

      router.push("/?verified=pending")

    } catch (error: any) {
      console.error("Error al completar registro:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo crear la cuenta. Por favor intenta de nuevo.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Selecciona tus Alimentos
          </h1>
          <p className="text-muted-foreground text-pretty">
            Elige los alimentos que te gustan para personalizar tus recomendaciones
          </p>
        </div>

        <Card className="border-2 shadow-xl mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
              <label htmlFor="select-all" className="font-semibold cursor-pointer">
                Seleccionar Todo
              </label>
            </div>

            <div className="space-y-8">
              {foodCategories.map((category, catIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <h3 className="text-lg font-bold mb-4 text-primary">{category.category}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {category.items.map((food) => {
                      const isSelected = selectedFoods.includes(food.id)
                      return (
                        <motion.div key={food.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Card
                            className={`cursor-pointer transition-all ${isSelected
                              ? "border-primary border-2 bg-primary/10 shadow-md"
                              : "border hover:border-primary/50"
                              }`}
                            onClick={() => handleFoodToggle(food.id)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="text-4xl mb-2">{food.emoji}</div>
                              <p className="text-sm font-medium">{food.name}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 transition-all hover:scale-[1.02] bg-transparent"
            onClick={() => router.push("/objetivos")}
            disabled={loading}
          >
            Atrás
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-primary hover:bg-secondary transition-all hover:scale-[1.02]"
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Comenzar"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
