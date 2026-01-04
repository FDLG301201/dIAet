"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface RegistrationData {
    name: string
    email: string
    password: string
}

interface RegistrationContextType {
    registrationData: RegistrationData | null
    setRegistrationData: (data: RegistrationData) => void
    clearRegistrationData: () => void
    isRegistrationFlow: boolean
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

const STORAGE_KEY = 'registration_data'

export function RegistrationProvider({ children }: { children: ReactNode }) {
    const [registrationData, setRegistrationDataState] = useState<RegistrationData | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from session storage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(STORAGE_KEY)
            if (stored) {
                try {
                    setRegistrationDataState(JSON.parse(stored))
                } catch (e) {
                    console.error("Failed to parse registration data", e)
                }
            }
            setIsLoaded(true)
        }
    }, [])

    // Save to session storage whenever it changes (if loaded)
    useEffect(() => {
        if (isLoaded) {
            if (registrationData) {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(registrationData))
            } else {
                sessionStorage.removeItem(STORAGE_KEY)
            }
        }
    }, [registrationData, isLoaded])

    const setRegistrationData = (data: RegistrationData) => {
        setRegistrationDataState(data)
    }

    const clearRegistrationData = () => {
        setRegistrationDataState(null)
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(STORAGE_KEY)
        }
    }

    const value = {
        registrationData,
        setRegistrationData,
        clearRegistrationData,
        isRegistrationFlow: !!registrationData,
    }

    return (
        <RegistrationContext.Provider value={value}>
            {children}
        </RegistrationContext.Provider>
    )
}

export function useRegistration() {
    const context = useContext(RegistrationContext)
    if (context === undefined) {
        throw new Error('useRegistration must be used within a RegistrationProvider')
    }
    return context
}
