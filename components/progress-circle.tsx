"use client"

import { motion } from "framer-motion"

interface ProgressCircleProps {
  current: number
  target: number
  size?: number
  strokeWidth?: number
}

export function ProgressCircle({ current, target, size = 192, strokeWidth = 12 }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min((current / target) * 100, 100)
  const offset = circumference * (1 - progress / 100)

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-primary transition-all"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {current}
        </motion.span>
        <span className="text-sm text-muted-foreground">/ {target}</span>
        <span className="text-xs text-muted-foreground mt-1">kcal</span>
      </div>
    </div>
  )
}
