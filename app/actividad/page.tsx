"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User, UserRound, Calendar, Ruler, Weight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveActivityData, type OnboardingActivityData } from "@/lib/onboarding"

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
  const router = useRouter()
  const { toast } = useToast()

  const [gender, setGender] = useState<"male" | "female">("male")
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "high">("moderate")
  const [birthdate, setBirthdate] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")

  const handleContinue = () => {
    // Validar campos requeridos
    if (!birthdate || !height || !weight) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor completa todos los campos antes de continuar.",
      })
      return
    }

    // Validar valores numéricos
    const heightNum = parseFloat(height)
    const weightNum = parseFloat(weight)

    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
      toast({
        variant: "destructive",
        title: "Altura inválida",
        description: "Por favor ingresa una altura válida (1-300 cm).",
      })
      return
    }

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      toast({
        variant: "destructive",
        title: "Peso inválido",
        description: "Por favor ingresa un peso válido (1-500 kg).",
      })
      return
    }

    // Validar edad (debe tener al menos 13 años)
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    if (age < 13) {
      toast({
        variant: "destructive",
        title: "Edad inválida",
        description: "Debes tener al menos 13 años para usar esta aplicación.",
      })
      return
    }

    // Guardar datos en sessionStorage
    const activityData: OnboardingActivityData = {
      gender,
      birthdate,
      height: heightNum,
      weight: weightNum,
      activityLevel,
    }

    saveActivityData(activityData)

    toast({
      title: "Datos guardados",
      description: "Continuemos con tus objetivos.",
    })

    router.push("/objetivos")
  }

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
                    className={`cursor-pointer transition-all ${gender === "male" ? "border-primary border-2 bg-primary/10" : "border hover:border-primary/50"
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
                    className={`cursor-pointer transition-all ${gender === "female" ? "border-primary border-2 bg-primary/10" : "border hover:border-primary/50"
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
                <Input
                  id="birthdate"
                  type="date"
                  className="transition-all focus:scale-[1.01]"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-semibold">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  Altura (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  className="transition-all focus:scale-[1.01]"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="1"
                  max="300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-semibold">
                  <Weight className="w-4 h-4 inline mr-1" />
                  Peso (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  className="transition-all focus:scale-[1.01]"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="1"
                  max="500"
                  step="0.1"
                  required
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Nivel de Actividad Física</Label>
              <RadioGroup value={activityLevel} onValueChange={(value: any) => setActivityLevel(value)}>
                <div className="space-y-3">
                  {activityLevels.map((level) => (
                    <motion.div key={level.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Card
                        className={`cursor-pointer transition-all ${activityLevel === level.id
                            ? "border-primary border-2 bg-primary/10"
                            : "border hover:border-primary/50"
                          }`}
                        onClick={() => setActivityLevel(level.id as any)}
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
            variant="outline"
            size="lg"
            className="flex-1 transition-all hover:scale-[1.02] bg-transparent"
            onClick={() => router.push("/")}
          >
            Atrás
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-primary hover:bg-secondary transition-all hover:scale-[1.02]"
            onClick={handleContinue}
          >
            Continuar
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
