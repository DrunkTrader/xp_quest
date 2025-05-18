"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dumbbell, Brain, BookOpen, Users, Zap } from "lucide-react"
import type { Habit } from "@/types/habit"
import { AlertCircle } from "lucide-react"

interface HabitFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (habit: Omit<Habit, "id" | "completed">) => void
  initialValues?: Omit<Habit, "id" | "completed">
  editMode?: boolean
}

export default function HabitForm({ open, onOpenChange, onSubmit, initialValues, editMode = false }: HabitFormProps) {
  const [name, setName] = useState(initialValues?.name || "")
  const [type, setType] = useState(initialValues?.type || "strength")
  const [xpReward, setXpReward] = useState(initialValues?.xpReward || 10)
  const [errors, setErrors] = useState<{name?: string; xpReward?: string}>({})
  
  // Update form when initialValues change (especially in edit mode)
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name)
      setType(initialValues.type)
      setXpReward(initialValues.xpReward)
    }
  }, [initialValues])

  const validateForm = (): boolean => {
    const newErrors: {name?: string; xpReward?: string} = {}
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = "Habit name is required"
    }
    
    // Validate XP reward
    if (!xpReward || xpReward < 1) {
      newErrors.xpReward = "XP reward must be at least 1"
    } else if (xpReward > 100) {
      newErrors.xpReward = "XP reward cannot exceed 100"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({ name, type, xpReward })
      if (!editMode) {
        setName("")
        setType("strength")
        setXpReward(10)
      }
      onOpenChange(false)
    }
  }

  const statTypes = [
    { value: "strength", label: "Strength", icon: Dumbbell, color: "bg-red-500" },
    { value: "intelligence", label: "Intelligence", icon: Brain, color: "bg-blue-500" },
    { value: "wisdom", label: "Wisdom", icon: BookOpen, color: "bg-purple-500" },
    { value: "charisma", label: "Charisma", icon: Users, color: "bg-yellow-500" },
    { value: "agility", label: "Agility", icon: Zap, color: "bg-green-500" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cyan-400">
            {editMode ? "Edit Habit" : "Add New Habit"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit name"
              className={`bg-gray-700 border-gray-600 text-white ${errors.name ? "border-red-500" : ""}`}
              required
            />
            {errors.name && (
              <div className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Habit Type</Label>
            <RadioGroup value={type} onValueChange={setType} className="grid grid-cols-1 gap-2">
              {statTypes.map((statType) => (
                <div
                  key={statType.value}
                  className={`flex items-center space-x-2 p-2 rounded-md border border-gray-700 ${
                    type === statType.value ? "bg-gray-700 border-cyan-500" : ""
                  }`}
                >
                  <RadioGroupItem value={statType.value} id={statType.value} className="border-gray-500" />
                  <div className={`p-1 rounded-md ${statType.color} mr-2`}>
                    <statType.icon className="h-4 w-4 text-white" />
                  </div>
                  <Label htmlFor={statType.value} className="cursor-pointer flex-grow">
                    {statType.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="xpReward">XP Reward</Label>
            <Input
              id="xpReward"
              type="number"
              min="1"
              max="100"
              value={xpReward}
              onChange={(e) => {
                const value = e.target.value ? Number.parseInt(e.target.value) : 0;
                setXpReward(value);
              }}
              className={`bg-gray-700 border-gray-600 text-white ${errors.xpReward ? "border-red-500" : ""}`}
            />
            {errors.xpReward && (
              <div className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.xpReward}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {editMode ? "Update Habit" : "Add Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
