"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Scale, Dumbbell } from "lucide-react"
import { useRouter } from "next/navigation"
import { saveGoalData } from "@/lib/onboarding"
import { useRegistration } from "@/context/RegistrationContext"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

const goals = [
  {
    id: "perder_grasa",
    title: "Perder Grasa",
    description: "Alcanza tu peso ideal con un déficit calórico saludable",
    icon: Flame,
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-900",
  },
  {
    id: "mantener",
    title: "Mantener Peso",
    description: "Equilibra tu nutrición y mantén tu forma actual",
    icon: Scale,
    color: "from-primary to-secondary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  {
    id: "ganar_musculo",
    title: "Ganar Músculo",
    description: "Aumenta masa muscular con un superávit calórico",
    icon: Dumbbell,
    color: "from-blue-400 to-purple-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900",
  },
]

export default function ObjetivosPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const router = useRouter()
  const { isRegistrationFlow } = useRegistration()
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

  const handleContinue = () => {
    if (selectedGoal) {
      saveGoalData({ goal: selectedGoal as any })
      router.push("/alimentos")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            ¿Cuál es tu objetivo?
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Selecciona tu meta para personalizar tu plan nutricional
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {goals.map((goal, index) => {
            const Icon = goal.icon
            const isSelected = selectedGoal === goal.id

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${isSelected ? `${goal.borderColor} border-2 shadow-lg` : "border"
                    } ${goal.bgColor}`}
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty">{goal.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleContinue}
            className="bg-primary hover:bg-secondary transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed px-12"
            disabled={!selectedGoal}
          >
            Continuar
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
