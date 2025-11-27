"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scan, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function EscanearPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Escanear Alimento
          </h1>
          <p className="text-muted-foreground text-pretty">
            Escanea el código de barras para agregar el alimento a tu registro
          </p>
        </div>

        <Card className="border-2 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Camera Frame */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"
              />

              {/* Scanning Frame */}
              <div className="relative z-10 w-4/5 max-w-md aspect-[3/2]">
                <div className="absolute inset-0 border-4 border-primary rounded-2xl">
                  {/* Corner decorations */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                </div>

                {/* Scanning Line */}
                <motion.div
                  animate={{ y: [0, 150, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
                />

                {/* Barcode Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-card/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                    <Scan className="w-16 h-16 text-primary" />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-sm font-medium bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-lg">
                  Coloca el código de barras dentro del marco
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 space-y-4 bg-card">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-secondary transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Scan className="w-5 h-5 mr-2" />
                Escanear ahora
              </Button>

              <Button variant="ghost" size="lg" className="w-full" asChild>
                <Link href="/dashboard">Escanear alimentos en otro momento</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          También puedes buscar alimentos manualmente desde el dashboard
        </p>
      </motion.div>
    </div>
  )
}
