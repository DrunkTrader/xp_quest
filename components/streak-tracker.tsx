"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import ProgressChart from "@/components/progress-chart"
import type { DailyCompletion } from "@/types/stats"

interface StreakTrackerProps {
  streak: number
  completionHistory: DailyCompletion[]
}

export default function StreakTracker({ streak, completionHistory }: StreakTrackerProps) {
  // Determine streak milestone
  const getMilestone = () => {
    if (streak >= 30) return { name: "Diamond", color: "text-cyan-400" }
    if (streak >= 14) return { name: "Gold", color: "text-yellow-400" }
    if (streak >= 7) return { name: "Silver", color: "text-gray-300" }
    if (streak >= 3) return { name: "Bronze", color: "text-amber-600" }
    return { name: "Novice", color: "text-gray-400" }
  }

  const milestone = getMilestone()

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2 text-cyan-400">Dungeon Progress</h2>

            <div className="flex items-center justify-center w-full mb-2">
              <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="font-medium">Current Streak:</span>
            </div>

            <motion.div
              className="text-4xl font-bold mb-2"
              key={streak}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {streak} {streak === 1 ? "Day" : "Days"}
            </motion.div>

            <div className="text-center">
              <span className="text-sm text-gray-400">Current Rank:</span>
              <div className={`font-bold ${milestone.color}`}>{milestone.name}</div>
            </div>

            <div className="w-full mt-4 bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="w-full flex justify-between mt-1 text-xs text-gray-400">
              <span>0</span>
              <span>7</span>
              <span>14</span>
              <span>30</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProgressChart data={completionHistory} />
    </div>
  )
}
