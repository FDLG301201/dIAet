"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, TrendingDown, Target } from "lucide-react"
import Link from "next/link"
import { WeeklyChart } from "@/components/weekly-chart"
import { AppHeader } from "@/components/app-header"

const weeklyCalories = [
  { day: "Lun", calories: 1800 },
  { day: "Mar", calories: 1950 },
  { day: "Mié", calories: 1750 },
  { day: "Jue", calories: 1900 },
  { day: "Vie", calories: 1850 },
  { day: "Sáb", calories: 2100 },
  { day: "Dom", calories: 1800 },
]

const weightProgress = [
  { week: "Sem 1", weight: 82 },
  { week: "Sem 2", weight: 81.5 },
  { week: "Sem 3", weight: 81 },
  { week: "Sem 4", weight: 80.5 },
  { week: "Sem 5", weight: 80 },
  { week: "Sem 6", weight: 79.5 },
]

export default function ProgresoPage() {
  const currentWeight = 79.5
  const targetWeight = 75
  const weightLost = 82 - currentWeight
  const weightToGo = currentWeight - targetWeight
  const progressPercent = ((82 - currentWeight) / (82 - targetWeight)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <AppHeader />
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link href="/dashboard">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Link>
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Tu Progreso
            </h1>
            <p className="text-muted-foreground text-pretty">Visualiza tu evolución y mantente motivado</p>
          </div>

          <div className="space-y-6">
            {/* Weight Goal Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Objetivo de Peso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-primary/10 rounded-xl">
                      <TrendingDown className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-3xl font-bold">{weightLost.toFixed(1)} kg</p>
                      <p className="text-sm text-muted-foreground">Perdidos</p>
                    </div>
                    <div className="text-center p-4 bg-accent/20 rounded-xl">
                      <p className="text-3xl font-bold">{currentWeight} kg</p>
                      <p className="text-sm text-muted-foreground">Peso Actual</p>
                    </div>
                    <div className="text-center p-4 bg-secondary/20 rounded-xl">
                      <p className="text-3xl font-bold">{targetWeight} kg</p>
                      <p className="text-sm text-muted-foreground">Meta</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progreso hacia la meta</span>
                      <span className="text-muted-foreground">{progressPercent.toFixed(0)}% completado</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Te faltan {weightToGo.toFixed(1)} kg para alcanzar tu objetivo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <WeeklyChart type="calories" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <WeeklyChart type="weight" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
