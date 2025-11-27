"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface WeeklyChartProps {
  type: "calories" | "weight"
}

// Mock data - Replace with actual data from API
const caloriesData = [
  { day: "Lun", calorias: 1886, objetivo: 1886 },
  { day: "Mar", calorias: 2100, objetivo: 1886 },
  { day: "Mié", calorias: 1750, objetivo: 1886 },
  { day: "Jue", calorias: 1900, objetivo: 1886 },
  { day: "Vie", calorias: 2050, objetivo: 1886 },
  { day: "Sáb", calorias: 1650, objetivo: 1886 },
  { day: "Dom", calorias: 1800, objetivo: 1886 },
]

const weightData = [
  { day: "Sem 1", peso: 75.5 },
  { day: "Sem 2", peso: 75.2 },
  { day: "Sem 3", peso: 74.8 },
  { day: "Sem 4", peso: 74.5 },
]

export function WeeklyChart({ type }: WeeklyChartProps) {
  if (type === "calories") {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle>Calorías Semanales</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={caloriesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="calorias" fill="hsl(var(--primary))" name="Consumidas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="objetivo" fill="hsl(var(--muted))" name="Objetivo" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle>Evolución de Peso</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-xs" />
            <YAxis domain={[73, 76]} className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 6 }}
              name="Peso (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
