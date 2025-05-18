"use client"

import { useState } from "react"
import { useHabitStore } from "@/stores/habit-store"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RefreshCw, Save } from "lucide-react"

export default function SettingsPage() {
  const { resetDailyHabits } = useHabitStore()
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isResetConfirmed, setIsResetConfirmed] = useState(false)

  const handleResetHabits = () => {
    resetDailyHabits()
    setIsResetDialogOpen(false)
    setIsResetConfirmed(true)

    // Hide confirmation message after 3 seconds
    setTimeout(() => {
      setIsResetConfirmed(false)
    }, 3000)
  }

  const handleExportData = () => {
    const data = localStorage.getItem("xpquest-storage")
    if (data) {
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "xpquest-backup.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex flex-col gap-6 mt-6">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-cyan-400">Settings</CardTitle>
              <CardDescription className="text-gray-400">Manage your XPQuest settings and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Habit Management</h3>
                <p className="text-sm text-gray-400">
                  Reset all habits to uncompleted state. This happens automatically each day.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Daily Habits
                </Button>

                {isResetConfirmed && (
                  <p className="text-sm text-green-500 mt-2">Habits have been reset successfully!</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Data Management</h3>
                <p className="text-sm text-gray-400">Export your XPQuest data as a JSON file for backup purposes.</p>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Reset Daily Habits</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will mark all habits as uncompleted. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetHabits} className="bg-cyan-600 hover:bg-cyan-700">
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
