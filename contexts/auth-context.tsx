"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { signIn, signUp, signOut, signInWithGoogle } from '@/lib/auth'
import type { SignInData, SignUpData } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (data: SignInData) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Timeout de inactividad: 15 minutos
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutos en milisegundos
  let inactivityTimer: NodeJS.Timeout | null = null

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }

    if (user) {
      inactivityTimer = setTimeout(async () => {
        await handleSignOut()
      }, INACTIVITY_TIMEOUT)
    }
  }

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      resetInactivityTimer()
    })

    // Eventos de actividad del usuario
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer)
    })

    // Iniciar timer si hay usuario
    resetInactivityTimer()

    return () => {
      subscription.unsubscribe()
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer)
      })
    }
  }, [user])

  const handleSignIn = async (data: SignInData) => {
    setLoading(true)
    try {
      await signIn(data)
      // El estado se actualizará automáticamente por onAuthStateChange
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true)
    try {
      await signUp(data)
      // El estado se actualizará automáticamente por onAuthStateChange
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
