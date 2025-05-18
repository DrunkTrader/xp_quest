"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Stats } from "@/types/stats"
import { motion } from "framer-motion"
import { Dumbbell, Brain, BookOpen, Users, Zap } from "lucide-react"

interface StatPanelProps {
  stats: Stats
}

export default function StatPanel({ stats }: StatPanelProps) {
  const statConfig = [
    { name: "Strength", value: stats.strength, icon: Dumbbell, color: "bg-red-500" },
    { name: "Intelligence", value: stats.intelligence, icon: Brain, color: "bg-blue-500" },
    { name: "Wisdom", value: stats.wisdom, icon: BookOpen, color: "bg-purple-500" },
    { name: "Charisma", value: stats.charisma, icon: Users, color: "bg-yellow-500" },
    { name: "Agility", value: stats.agility, icon: Zap, color: "bg-green-500" },
  ]

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-cyan-400">Character Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statConfig.map((stat) => (
            <motion.div
              key={stat.name}
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <div className={`p-2 rounded-md ${stat.color} mr-2`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{stat.name}</span>
                <span className="ml-auto font-bold">{stat.value}</span>
              </div>
              <Progress value={Math.min(100, (stat.value / 100) * 100)} className={`h-2 ${stat.color}`} />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
