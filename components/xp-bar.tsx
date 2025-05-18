"use client"

import { motion, AnimatePresence } from "framer-motion"
import { calculateXpForNextLevel } from "@/utils/xp-utils"
import { Progress } from "@/components/ui/progress"

interface XPBarProps {
  level: number
  xp: number
}

export default function XPBar({ level, xp }: XPBarProps) {
  const xpForNextLevel = calculateXpForNextLevel(level)
  const progress = Math.min(100, (xp / xpForNextLevel) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-lg font-bold text-cyan-400">Level {level}</span>
          <AnimatePresence>
            <motion.div
              key={level}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-2 text-sm text-gray-400"
            >
              {xp} / {xpForNextLevel} XP
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative">
        <Progress value={progress} className="h-4 bg-gray-700" />
        <motion.div
          className="absolute top-0 left-0 h-4 bg-cyan-500 opacity-30 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
