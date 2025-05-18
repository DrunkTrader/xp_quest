"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface LevelUpModalProps {
  level: number
  onClose: () => void
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  useEffect(() => {
    // Trigger confetti effect when modal opens
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="bg-gray-800 border-cyan-600 border-2 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-cyan-400">LEVEL UP!</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-7xl font-bold text-white mb-4"
          >
            {level}
          </motion.div>

          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
              <p className="text-lg text-gray-300">Congratulations! You've reached level {level}!</p>
              <p className="text-gray-400 mt-2">
                Your powers are growing stronger. Keep completing quests to unlock new abilities!
              </p>
            </motion.div>
          </AnimatePresence>

          <Button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-700 text-white px-8">
            Continue Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
