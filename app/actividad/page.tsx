"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, UserRound, Calendar, Ruler, Weight } from "lucide-react"
import Link from "next/link"

const activityLevels = [
  {
    id: "sedentary",
    title: "Sedentario",
    description: "Poco o ningún ejercicio",
  },
  {
    id: "light",
    title: "Ligera",
    description: "Ejercicio 2-3 días/semana",
  },
  {
    id: "moderate",
    title: "Moderada",
    description: "Ejercicio 3-5 días/semana",
  },
  {
    id: "high",
    title: "Alta",
    description: "Ejercicio 6-7 días/semana",
  },
]

export default function ActividadPage() {
  const [gender, setGender] = useState("male")
  const [activityLevel, setActivityLevel] = useState("moderate")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Configuración de Actividad
          </h1>
          <p className="text-muted-foreground text-pretty">
            Completa tu perfil para calcular tus necesidades calóricas
          </p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardContent className="p-6 space-y-6">
            {/* Gender Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Género</Label>
              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all ${
                      gender === "male" ? "border-primary border-2 bg-primary/10" : "border hover:border-primary/50"
                    }`}
                    onClick={() => setGender("male")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold">Hombre</span>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all ${
                      gender === "female" ? "border-primary border-2 bg-primary/10" : "border hover:border-primary/50"
                    }`}
                    onClick={() => setGender("female")}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                        <UserRound className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold">Mujer</span>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Personal Data */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthdate" className="text-sm font-semibold">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha de nacimiento
                </Label>
                <Input id="birthdate" type="date" className="transition-all focus:scale-[1.01]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-semibold">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  Altura (cm)
                </Label>
                <Input id="height" type="number" placeholder="175" className="transition-all focus:scale-[1.01]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-semibold">
                  <Weight className="w-4 h-4 inline mr-1" />
                  Peso (kg)
                </Label>
                <Input id="weight" type="number" placeholder="70" className="transition-all focus:scale-[1.01]" />
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Nivel de Actividad Física</Label>
              <RadioGroup value={activityLevel} onValueChange={setActivityLevel}>
                <div className="space-y-3">
                  {activityLevels.map((level) => (
                    <motion.div key={level.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Card
                        className={`cursor-pointer transition-all ${
                          activityLevel === level.id
                            ? "border-primary border-2 bg-primary/10"
                            : "border hover:border-primary/50"
                        }`}
                        onClick={() => setActivityLevel(level.id)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <RadioGroupItem value={level.id} id={level.id} />
                          <div className="flex-1">
                            <Label htmlFor={level.id} className="font-semibold cursor-pointer">
                              {level.title}
                            </Label>
                            <p className="text-sm text-muted-foreground">{level.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 transition-all hover:scale-[1.02] bg-transparent"
          >
            <Link href="/objetivos">Atrás</Link>
          </Button>
          <Button asChild size="lg" className="flex-1 bg-primary hover:bg-secondary transition-all hover:scale-[1.02]">
            <Link href="/alimentos">Continuar</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
