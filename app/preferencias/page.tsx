"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Search, X } from "lucide-react"
import Link from "next/link"

const recentSearches = ["Pizza", "Helado", "Chocolate", "Bebidas azucaradas", "Comida rápida"]

const allergyItems = [
  { name: "Gluten", category: "Cereales" },
  { name: "Mariscos", category: "Proteínas" },
  { name: "Lácteos", category: "Lácteos" },
]

const eliminatedFoods = [
  { name: "Pan blanco", reason: "Contiene gluten" },
  { name: "Camarones", reason: "Contiene mariscos" },
  { name: "Leche entera", reason: "Contiene lácteos" },
]

export default function PreferenciasPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Alergias y Preferencias
          </h1>
          <p className="text-muted-foreground text-pretty">Personaliza tus recomendaciones alimentarias</p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar alimentos o dietas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent">Recientes</TabsTrigger>
                <TabsTrigger value="allergies">Alérgico/a</TabsTrigger>
                <TabsTrigger value="eliminated">Eliminados</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-3 mt-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Búsquedas Recientes
                </h3>
                {recentSearches.map((search, index) => (
                  <motion.div
                    key={search}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-all cursor-pointer hover:border-primary/50">
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="font-medium">{search}</span>
                        <Button variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="allergies" className="space-y-3 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Alergias Declaradas
                  </h3>
                  <Button size="sm" className="bg-primary hover:bg-secondary">
                    + Agregar
                  </Button>
                </div>
                {allergyItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-destructive/30 bg-destructive/5">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="eliminated" className="space-y-3 mt-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    No Recomendar
                  </h3>
                  <p className="text-sm text-muted-foreground">Estos alimentos no aparecerán en tus recomendaciones</p>
                </div>
                {eliminatedFoods.map((food, index) => (
                  <motion.div
                    key={food.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-all">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{food.name}</p>
                          <p className="text-sm text-muted-foreground">{food.reason}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
