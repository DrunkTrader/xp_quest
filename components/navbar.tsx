"use client"

import { useHabitStore } from "@/stores/habit-store"
import { Trophy, Home, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Navbar() {
  const { streak } = useHabitStore()

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-cyan-400 mr-2">XPQuest</span>
          </Link>
        </div>

        {/* Streak Bar */}
        <div className="hidden md:flex items-center bg-gray-800 rounded-full px-4 py-1.5 border border-gray-700">
          <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
          <span className="text-sm font-medium text-gray-300 mr-2">Streak:</span>
          <motion.span
            key={streak}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-bold text-white"
          >
            {streak} {streak === 1 ? "Day" : "Days"}
          </motion.span>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors">
            <Home className="h-5 w-5" />
            <span className="ml-1 hidden sm:inline">Home</span>
          </Link>
          <Link href="/settings" className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors">
            <Settings className="h-5 w-5" />
            <span className="ml-1 hidden sm:inline">Settings</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
