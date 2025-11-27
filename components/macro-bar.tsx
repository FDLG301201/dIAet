"use client"

import { motion } from "framer-motion"
import type { MacroData } from "@/lib/types"

interface MacroBarProps {
  macro: MacroData
  index?: number
}

export function MacroBar({ macro, index = 0 }: MacroBarProps) {
  const percentage = Math.min((macro.current / macro.target) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{macro.name}</span>
        <span className="text-muted-foreground">
          {macro.current} / {macro.target} {macro.unit}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
          className={`h-full ${macro.color} rounded-full`}
        />
      </div>
    </div>
  )
}
