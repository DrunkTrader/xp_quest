"use client"

import { useEffect, useState } from "react"
import { useHabitStore } from "@/stores/habit-store"
import HabitList from "@/components/habit-list"
import ErrorBoundary from "@/components/error-boundary"
import XPBar from "@/components/xp-bar"
import AvatarPanel from "@/components/avatar-panel"
import StatPanel from "@/components/stat-panel"
import StreakTracker from "@/components/streak-tracker"
import HabitListSkeleton, { 
  StatPanelSkeleton, 
  XPBarSkeleton, 
  AvatarPanelSkeleton,
  StreakTrackerSkeleton 
} from "@/components/ui/skeletons"
import LevelUpModal from "@/components/level-up-modal"
import Navbar from "@/components/navbar"
import HabitForm from "@/components/habit-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Habit } from "@/types/habit"

export default function Dashboard() {
  const {
    level,
    xp,
    streak,
    showLevelUpModal,
    stats,
    habits,
    completionHistory,
    checkHabit,
    addHabit,
    updateHabit,
    removeHabit,
    resetDailyHabits,
    closeLevelUpModal,
    updateCompletionHistory,
  } = useHabitStore()

  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if we need to reset habits for a new day
  useEffect(() => {
    setIsLoading(true)
    
    const lastResetDate = localStorage.getItem("lastResetDate")
    const today = new Date().toDateString()

    if (lastResetDate !== today) {
      resetDailyHabits()
      localStorage.setItem("lastResetDate", today)
    }

    // Update completion history when component mounts
    updateCompletionHistory()
    
    // Simulate loading time for data fetching
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [resetDailyHabits, updateCompletionHistory])

  const handleAddHabit = (habitData: Omit<Habit, "id" | "completed">) => {
    addHabit({
      id: Date.now().toString(),
      name: habitData.name,
      type: habitData.type,
      completed: false,
      xpReward: habitData.xpReward,
    })
  }

  const handleEditHabit = (id: string, habitData: Omit<Habit, "id" | "completed">) => {
    updateHabit(id, habitData)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <Card className="w-full md:w-2/3 bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-cyan-400">XPQuest Dashboard</CardTitle>
                  <Button onClick={() => setIsHabitFormOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Habit
                  </Button>
                </div>
              </CardHeader>              <CardContent>
                <div className="mb-4">
                  {isLoading ? (
                    <XPBarSkeleton />
                  ) : (
                    <XPBar level={level} xp={xp} />
                  )}
                </div>
                <ErrorBoundary>
                  {isLoading ? (
                    <HabitListSkeleton />
                  ) : (
                    <HabitList habits={habits} onToggle={checkHabit} onEdit={handleEditHabit} onDelete={removeHabit} />
                  )}
                </ErrorBoundary>
              </CardContent>
            </Card>

            <div className="w-full md:w-1/3 flex flex-col gap-6">
              {isLoading ? (
                <>
                  <AvatarPanelSkeleton />
                  <StreakTrackerSkeleton />
                </>
              ) : (
                <>
                  <AvatarPanel level={level} />
                  <StreakTracker streak={streak} completionHistory={completionHistory} />
                </>
              )}
            </div>
          </div>

          {isLoading ? <StatPanelSkeleton /> : <StatPanel stats={stats} />}
        </div>

        {/* Habit Form Modal */}
        <HabitForm open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen} onSubmit={handleAddHabit} />

        {showLevelUpModal && <LevelUpModal level={level} onClose={closeLevelUpModal} />}
      </div>
    </div>
  )
}
