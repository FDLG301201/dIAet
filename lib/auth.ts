import { createClient } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface SignUpData {
    email: string
    password: string
    nombre: string
}

export interface SignInData {
    email: string
    password: string
}

/**
 * Registrar un nuevo usuario con email y contraseña
 */
export async function signUp({ email, password, nombre }: SignUpData) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nombre,
            },
        },
    })

    if (error) {
        throw error
    }

    return data
}

/**
 * Iniciar sesión con email y contraseña
 */
export async function signIn({ email, password }: SignInData) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw error
    }

    return data
}

/**
 * Iniciar sesión con Google OAuth
 */
export async function signInWithGoogle() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    })

    if (error) {
        throw error
    }

    return data
}

/**
 * Cerrar sesión
 */
export async function signOut() {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        throw error
    }
}

/**
 * Obtener el usuario actual
 */
export async function getCurrentUser(): Promise<User | null> {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user
}

/**
 * Recuperar contraseña
 */
export async function resetPassword(email: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
        throw error
    }
}

/**
 * Actualizar contraseña
 */
export async function updatePassword(newPassword: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) {
        throw error
    }
}
