"use client"

import { useState, useEffect, useCallback } from "react"
import type { DailyLog, FoodItem } from "@/lib/types"

export function useDailyLog(userId?: string) {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null)
  const [loading, setLoading] = useState(true) // Start true, but if no userId, maybe set false immediately or keep true until userId arrives? 
  // Better: if no userId, loading is false because we aren't fetching, but also no data. 
  // However, usually we want to show loading spinner while waiting for auth to resolve.
  // Let's set loading to true initially, and inside useEffect if no userId, set loading false.

  const [error, setError] = useState<string | null>(null)

  const fetchDailyLog = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/daily-log/today?userId=${userId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch daily log")
      }

      const data = await response.json()
      setDailyLog(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("[useDailyLog] Error fetching daily log:", err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchDailyLog()
  }, [fetchDailyLog])

  const markFoodConsumed = async (foodId: string, tipoComida: string, consumido: boolean) => {
    if (!userId) return

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
        body: JSON.stringify({ userId, foodId, tipoComida, consumido }),
      })

      if (!response.ok) {
        throw new Error("Failed to update food status")
      }

      // Update with server response to get correct totals
      const data = await response.json()
      setDailyLog((prev) => prev ? ({ ...prev, totales: data.totals }) : null)

    } catch (err) {
      console.error("[useDailyLog] Error marking food consumed:", err)
      // Revert optimistic update is complex here without deep clone or history, 
      // simple revert: refetch
      fetchDailyLog()
    }
  }

  const addFood = async (tipoComida: string, foodItem: Omit<FoodItem, "id" | "consumido" | "esRecomendacion">) => {
    if (!userId) return

    try {
      const response = await fetch("/api/daily-log/add-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          tipoComida,
          foodItem: { ...foodItem, esRecomendacion: false }
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add food")
      }

      const data = await response.json()
      // Full update from server response as it contains the new food ID and updated totals
      setDailyLog((prev) => prev ? ({
        ...prev,
        comidas: data.comidas,
        totales: data.totals
      }) : null)

    } catch (err) {
      console.error("[useDailyLog] Error adding food:", err)
      throw err
    }
  }

  return { dailyLog, loading, error, markFoodConsumed, addFood, refetch: fetchDailyLog }
}
