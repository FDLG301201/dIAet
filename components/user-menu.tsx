"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings, Sun, Moon, Monitor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UserMenu() {
    const { user, signOut } = useAuth()
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const { toast } = useToast()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleSignOut = async () => {
        setIsLoggingOut(true)
        try {
            await signOut()
            toast({
                title: "Sesión cerrada",
                description: "Has cerrado sesión exitosamente.",
            })
            router.push("/")
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "No se pudo cerrar sesión.",
            })
        } finally {
            setIsLoggingOut(false)
        }
    }

    const getInitials = (email: string) => {
        return email.substring(0, 2).toUpperCase()
    }

    const getUserName = () => {
        if (user?.user_metadata?.nombre) {
            return user.user_metadata.nombre
        }
        return user?.email?.split("@")[0] || "Usuario"
    }

    const themeIcons = {
        light: Sun,
        dark: Moon,
        // system: Monitor,
    }

    const ThemeIcon = themeIcons[theme as keyof typeof themeIcons] || Monitor

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserName()} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.email ? getInitials(user.email) : "U"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getUserName()}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Theme Submenu */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">Tema</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Claro</span>
                    {theme === "light" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Oscuro</span>
                    {theme === "dark" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>Sistema</span>
                    {theme === "system" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem> */}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/preferencias")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Preferencias</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
