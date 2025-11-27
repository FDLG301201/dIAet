"use client"

import { useState, useEffect } from "react"
import type { DailyLog, FoodItem } from "@/lib/types"

export function useDailyLog(userId?: string) {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDailyLog = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/daily-log/today?userId=${userId || "user-123"}`)

        if (!response.ok) {
          throw new Error("Failed to fetch daily log")
        }

        const data = await response.json()
        setDailyLog(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("[v0] Error fetching daily log:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDailyLog()
  }, [userId])

  const markFoodConsumed = async (foodId: string, tipoComida: string, consumido: boolean) => {
    try {
      // Optimistic update
      setDailyLog((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          comidas: {
            ...prev.comidas,
            [tipoComida]: prev.comidas[tipoComida as keyof typeof prev.comidas].map((food: FoodItem) =>
              food.id === foodId ? { ...food, consumido, horaConsumo: consumido ? new Date() : undefined } : food,
            ),
          },
        }
      })

      const response = await fetch("/api/daily-log/mark-consumed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId, tipoComida, consumido }),
      })

      if (!response.ok) {
        throw new Error("Failed to update food status")
      }
    } catch (err) {
      console.error("[v0] Error marking food consumed:", err)
      // Revert optimistic update on error
      setDailyLog((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          comidas: {
            ...prev.comidas,
            [tipoComida]: prev.comidas[tipoComida as keyof typeof prev.comidas].map((food: FoodItem) =>
              food.id === foodId ? { ...food, consumido: !consumido } : food,
            ),
          },
        }
      })
    }
  }

  return { dailyLog, loading, error, markFoodConsumed }
}
