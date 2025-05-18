"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Edit2, Trash2 } from "lucide-react"
import type { Habit } from "@/types/habit"
import HabitForm from "@/components/habit-form"
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

interface HabitListProps {
  habits: Habit[]
  onToggle: (id: string) => void
  onEdit: (id: string, habit: Omit<Habit, "id" | "completed">) => void
  onDelete: (id: string) => void
}

export default function HabitList({ habits, onToggle, onEdit, onDelete }: HabitListProps) {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  // Limit number of habits to render for better performance with large lists
  const MAX_VISIBLE_HABITS = 50

  const getStatColor = (type: string) => {
    const colors: Record<string, string> = {
      strength: "bg-red-500",
      intelligence: "bg-blue-500",
      wisdom: "bg-purple-500",
      charisma: "bg-yellow-500",
      agility: "bg-green-500",
    }
    return colors[type] || "bg-gray-500"
  }

  const handleEditClick = (habit: Habit) => {
    setEditingHabit(habit)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = (updatedHabit: Omit<Habit, "id" | "completed">) => {
    if (editingHabit) {
      onEdit(editingHabit.id, updatedHabit)
    }
  }

  const handleDeleteClick = (id: string) => {
    setHabitToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (habitToDelete) {
      onDelete(habitToDelete)
      setHabitToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  // Only process the habits we're going to display for better performance
  const visibleHabits = useMemo(() => {
    return habits.slice(0, MAX_VISIBLE_HABITS)
  }, [habits]);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold mb-4">Daily Quests</h2>
      {habits.length === 0 ? (
        <p className="text-gray-400">No habits added yet. Add your first habit to begin your journey!</p>
      ) : (
        <>
          {visibleHabits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <Card className={`border-l-4 ${getStatColor(habit.type)} bg-gray-800 border-gray-700`}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={habit.id}
                      checked={habit.completed}
                      onCheckedChange={() => onToggle(habit.id)}
                      className="border-gray-500 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600 flex-shrink-0"
                    />
                    <label
                      htmlFor={habit.id}
                      className={`text-lg font-medium truncate ${habit.completed ? "line-through text-gray-500" : "text-white"}`}
                    >
                      {habit.name}
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        +{habit.xpReward} XP
                      </Badge>
                      <Badge className={`${getStatColor(habit.type)} text-white`}>
                        {habit.type.charAt(0).toUpperCase() + habit.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(habit)}
                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(habit.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-gray-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {habits.length > MAX_VISIBLE_HABITS && (
            <p className="text-sm text-gray-400 text-center mt-2">
              Showing {MAX_VISIBLE_HABITS} of {habits.length} habits. Complete some habits to see more.
            </p>
          )}
        </>
      )}

      {/* Edit Habit Modal */}
      {editingHabit && (
        <HabitForm
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleEditSubmit}
          initialValues={{
            name: editingHabit.name,
            type: editingHabit.type,
            xpReward: editingHabit.xpReward,
          }}
          editMode={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Habit</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this habit? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
