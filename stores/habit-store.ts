"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Habit } from "@/types/habit"
import type { Stats, DailyCompletion } from "@/types/stats"
import { calculateXpForNextLevel } from "@/utils/xp-utils"

interface HabitState {
  habits: Habit[]
  level: number
  xp: number
  streak: number
  lastCompletedDate: string | null
  showLevelUpModal: boolean
  stats: Stats
  completionHistory: DailyCompletion[]
  avatarUrl: string | null

  addHabit: (habit: Habit) => void
  removeHabit: (id: string) => void
  checkHabit: (id: string) => void
  resetDailyHabits: () => void
  closeLevelUpModal: () => void
  updateHabit: (id: string, updatedHabit: Omit<Habit, "id" | "completed">) => void
  updateCompletionHistory: () => void
  setAvatarUrl: (url: string | null) => void
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      level: 1,
      xp: 0,
      streak: 0,
      lastCompletedDate: null,
      showLevelUpModal: false,
      completionHistory: [],
      avatarUrl: null,
      stats: {
        strength: 1,
        intelligence: 1,
        wisdom: 1,
        charisma: 1,
        agility: 1,
      },

      addHabit: (habit) =>
        set((state) => {
          // Add habit first
          const updatedHabits = [...state.habits, habit];
          
          // Calculate new history based on updated habits
          const today = new Date().toDateString();
          const completedCount = updatedHabits.filter((h) => h.completed).length;
          const totalCount = updatedHabits.length;
          
          // Update completion history
          const existingEntryIndex = state.completionHistory.findIndex(
            (entry) => entry.date === today
          );
          
          let newHistory = [...state.completionHistory];
          
          if (existingEntryIndex >= 0) {
            // Update existing entry
            newHistory[existingEntryIndex] = {
              date: today,
              scheduled: totalCount,
              completed: completedCount,
            };
          } else {
            // Add new entry
            newHistory.push({
              date: today,
              scheduled: totalCount,
              completed: completedCount,
            });
            
            // Keep only the last 7 days
            if (newHistory.length > 7) {
              newHistory = newHistory.slice(newHistory.length - 7);
            }
          }
          
          return {
            habits: updatedHabits,
            completionHistory: newHistory,
          };
        }),

      removeHabit: (id) =>
        set((state) => {
          // Remove habit first
          const updatedHabits = state.habits.filter((habit) => habit.id !== id);
          
          // Calculate new history based on updated habits
          const today = new Date().toDateString();
          const completedCount = updatedHabits.filter((h) => h.completed).length;
          const totalCount = updatedHabits.length;
          
          // Update completion history
          const existingEntryIndex = state.completionHistory.findIndex(
            (entry) => entry.date === today
          );
          
          let newHistory = [...state.completionHistory];
          
          if (existingEntryIndex >= 0) {
            // Update existing entry
            newHistory[existingEntryIndex] = {
              date: today,
              scheduled: totalCount,
              completed: completedCount,
            };
          } else {
            // Add new entry
            newHistory.push({
              date: today,
              scheduled: totalCount,
              completed: completedCount,
            });
            
            // Keep only the last 7 days
            if (newHistory.length > 7) {
              newHistory = newHistory.slice(newHistory.length - 7);
            }
          }
          
          return {
            habits: updatedHabits,
            completionHistory: newHistory,
          };
        }),

      checkHabit: (id) => {
        const { habits, level, xp, stats } = get()
        const habit = habits.find((h) => h.id === id)

        if (!habit || habit.completed) return

        // Mark habit as completed
        const updatedHabits = habits.map((h) => (h.id === id ? { ...h, completed: true } : h))

        // Add XP
        let totalXp = xp + habit.xpReward
        
        // Process level ups
        let newLevel = level
        let shouldShowLevelUp = false
        let remainingXp = totalXp
        
        // Handle multiple level-ups if needed
        while (true) {
          const xpForNextLevel = calculateXpForNextLevel(newLevel)
          if (remainingXp >= xpForNextLevel) {
            newLevel++
            remainingXp -= xpForNextLevel
            shouldShowLevelUp = true
          } else {
            break
          }
        }

        // Update stats based on habit type
        const newStats = { ...stats }
        // Type-safe way to update stats
        const validStatTypes = ['strength', 'intelligence', 'wisdom', 'charisma', 'agility'] as const;
        if (validStatTypes.includes(habit.type as any)) {
          newStats[habit.type as keyof typeof newStats] += 1;
        }

        // Update streak if this is the first completion today
        const now = new Date()
        const today = now.toDateString()
        const { lastCompletedDate, streak } = get()
        let newStreak = streak

        if (lastCompletedDate !== today) {
          // Check if we missed a day
          if (lastCompletedDate) {
            const lastDate = new Date(lastCompletedDate)
            
            // Calculate the gap in days, accounting for time zone issues
            const oneDayMs = 24 * 60 * 60 * 1000
            const daysDifference = Math.round(
              (now.getTime() - lastDate.getTime()) / oneDayMs
            )
            
            if (daysDifference <= 1) {
              // Consecutive day (completed yesterday or earlier today but in different timezone)
              newStreak = streak + 1
            } else {
              // Missed a day, reset streak
              newStreak = 1
            }
          } else {
            // First time completing a habit
            newStreak = 1
          }
        }

        const newState = {
          habits: updatedHabits,
          xp: remainingXp, // Use the remaining XP after level calculations
          level: newLevel,
          showLevelUpModal: shouldShowLevelUp,
          stats: newStats,
          streak: newStreak,
          lastCompletedDate: today,
        }

        // Calculate new completion history
        const completedCount = updatedHabits.filter((h) => h.completed).length;
        const totalCount = updatedHabits.length;
        
        // Update completion history
        const existingEntryIndex = get().completionHistory.findIndex(
          (entry) => entry.date === today
        );
        
        let newHistory = [...get().completionHistory];
        
        if (existingEntryIndex >= 0) {
          // Update existing entry
          newHistory[existingEntryIndex] = {
            date: today,
            scheduled: totalCount,
            completed: completedCount,
          };
        } else {
          // Add new entry
          newHistory.push({
            date: today,
            scheduled: totalCount,
            completed: completedCount,
          });
          
          // Keep only the last 7 days
          if (newHistory.length > 7) {
            newHistory = newHistory.slice(newHistory.length - 7);
          }
        }
        
        // Update state with all changes at once
        set({
          ...newState,
          completionHistory: newHistory
        });
      },

      resetDailyHabits: () =>
        set((state) => {
          // Before resetting, record the current day's completion in history
          const today = new Date().toDateString()
          const completedCount = state.habits.filter((h) => h.completed).length
          const totalCount = state.habits.length

          // Update completion history
          const existingEntryIndex = state.completionHistory.findIndex((entry) => entry.date === today)

          let newHistory = [...state.completionHistory]

          if (existingEntryIndex >= 0) {
            // Update existing entry
            newHistory[existingEntryIndex] = {
              date: today,
              scheduled: totalCount,
              completed: completedCount,
            }
          } else {
            // Add new entry
            newHistory.push({
              date: today,
              scheduled: totalCount,
              completed: completedCount,
            })

            // Keep only the last 7 days
            if (newHistory.length > 7) {
              newHistory = newHistory.slice(newHistory.length - 7)
            }
          }

          return {
            habits: state.habits.map((habit) => ({ ...habit, completed: false })),
            completionHistory: newHistory,
          }
        }),

      closeLevelUpModal: () => set({ showLevelUpModal: false }),

      updateHabit: (id, updatedHabit) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  name: updatedHabit.name,
                  type: updatedHabit.type,
                  xpReward: updatedHabit.xpReward,
                }
              : habit,
          ),
        })),

      updateCompletionHistory: () => {
        const { habits, completionHistory } = get()
        const today = new Date().toDateString()

        const completedCount = habits.filter((h) => h.completed).length
        const totalCount = habits.length

        // Check if we already have an entry for today
        const existingEntryIndex = completionHistory.findIndex((entry) => entry.date === today)

        let newHistory = [...completionHistory]

        if (existingEntryIndex >= 0) {
          // Update existing entry
          newHistory[existingEntryIndex] = {
            date: today,
            scheduled: totalCount,
            completed: completedCount,
          }
        } else {
          // Add new entry
          newHistory.push({
            date: today,
            scheduled: totalCount,
            completed: completedCount,
          })

          // Keep only the last 7 days
          if (newHistory.length > 7) {
            newHistory = newHistory.slice(newHistory.length - 7)
          }
        }

        set({ completionHistory: newHistory })
      },

      setAvatarUrl: (url) => {
        set({ avatarUrl: url })
      },
    }),
    {
      name: "xpquest-storage",
    },
  ),
)
