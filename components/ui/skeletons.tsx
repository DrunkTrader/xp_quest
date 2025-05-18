"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HabitListSkeleton() {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold mb-4">Daily Quests</h2>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className="border-l-4 bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded-sm bg-gray-700" />
                <Skeleton className="h-6 w-40 bg-gray-700" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-16 bg-gray-700 rounded-full" />
                <Skeleton className="h-6 w-20 bg-gray-700 rounded-full" />
                <div className="flex space-x-1">
                  <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                  <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

export function StatPanelSkeleton() {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-cyan-400">Character Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-700" />
                <Skeleton className="h-2 w-full bg-gray-700 rounded-full" />
              </div>
              <Skeleton className="h-6 w-8 bg-gray-700 rounded" />
            </div>
          ))}
      </CardContent>
    </Card>
  )
}

export function XPBarSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24 bg-gray-700" />
        <Skeleton className="h-4 w-16 bg-gray-700" />
      </div>
      <Skeleton className="h-4 w-full bg-gray-700 rounded-full" />
    </div>
  )
}

export function AvatarPanelSkeleton() {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardContent className="flex flex-col items-center p-6">
        <Skeleton className="h-24 w-24 rounded-full bg-gray-700 mb-4" />
        <Skeleton className="h-6 w-32 bg-gray-700 mb-2" />
        <Skeleton className="h-4 w-24 bg-gray-700" />
      </CardContent>
    </Card>
  )
}

export function StreakTrackerSkeleton() {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-cyan-400">Streak</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-4">
        <Skeleton className="h-16 w-16 rounded-full bg-gray-700 mb-4" />
        <Skeleton className="h-6 w-32 bg-gray-700 mb-2" />
        <div className="grid grid-cols-7 gap-1 w-full mt-4">
          {Array(7)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-8 w-full bg-gray-700 rounded" />
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
