"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { Menu, Home, TrendingUp, Settings } from "lucide-react"
import Link from "next/link"

export function AppHeader() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            {/* Header */}
            <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
                            <Menu className="w-6 h-6" />
                        </Button>
                        <Link href="/dashboard">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent cursor-pointer">
                                dAIet
                            </h1>
                        </Link>
                    </div>
                    <nav className="hidden lg:flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard">
                                <Home className="w-4 h-4 mr-2" />
                                Inicio
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/progreso">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Progreso
                            </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/preferencias">
                                <Settings className="w-4 h-4 mr-2" />
                                Preferencias
                            </Link>
                        </Button>
                    </nav>
                    <UserMenu />
                </div>
            </header>

            {/* Mobile Menu */}
            {menuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:hidden bg-card border-b shadow-lg sticky top-[73px] z-40"
                >
                    <nav className="container mx-auto px-4 py-4 space-y-2">
                        <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMenuOpen(false)}>
                            <Link href="/dashboard">
                                <Home className="w-4 h-4 mr-2" />
                                Inicio
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMenuOpen(false)}>
                            <Link href="/progreso">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Progreso
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMenuOpen(false)}>
                            <Link href="/preferencias">
                                <Settings className="w-4 h-4 mr-2" />
                                Preferencias
                            </Link>
                        </Button>
                    </nav>
                </motion.div>
            )}
        </>
    )
}
