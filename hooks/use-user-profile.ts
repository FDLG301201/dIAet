"use client"

import { useState, useEffect } from "react"
import type { UserProfile } from "@/lib/types"

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/user/profile")

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("[v0] Error fetching profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()
      setProfile(data.profile)
      return data
    } catch (err) {
      console.error("[v0] Error updating profile:", err)
      throw err
    }
  }

  const updateObjetivo = async (objetivo: "perder_grasa" | "mantener" | "ganar_musculo", tdee: number) => {
    try {
      const response = await fetch("/api/user/update-objetivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objetivo, tdee }),
      })

      if (!response.ok) {
        throw new Error("Failed to update objetivo")
      }

      const data = await response.json()

      // Update local profile
      if (profile) {
        setProfile({
          ...profile,
          objetivo: data.objetivo,
          caloriasDiarias: data.caloriasDiarias,
        })
      }

      return data
    } catch (err) {
      console.error("[v0] Error updating objetivo:", err)
      throw err
    }
  }

  return { profile, loading, error, updateProfile, updateObjetivo }
}
