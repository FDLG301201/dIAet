"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

interface OnboardingStep {
  id: number
  title: string
  description: string
  component: React.ReactNode
}

interface OnboardingWizardProps {
  steps: OnboardingStep[]
  onComplete: () => void
}

export function OnboardingWizard({ steps, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h2>
                  <p className="text-muted-foreground text-pretty">{steps[currentStep].description}</p>
                </div>

                {steps[currentStep].component}

                <div className="flex gap-4 mt-8">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                      className="flex-1 transition-all hover:scale-[1.02] bg-transparent"
                    >
                      Atrás
                    </Button>
                  )}
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="flex-1 bg-primary hover:bg-secondary transition-all hover:scale-[1.02]"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Finalizar
                      </>
                    ) : (
                      "Continuar"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`h-2 rounded-full transition-all ${
                index === currentStep ? "w-8 bg-primary" : index < currentStep ? "w-2 bg-primary/50" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
