"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailyCompletion } from "@/types/stats"

interface ProgressChartProps {
  data: DailyCompletion[]
}

export default function ProgressChart({ data }: ProgressChartProps) {
  // Format dates to be more readable
  const formattedData = data
    .map((entry) => {
      const date = new Date(entry.date)
      return {
        ...entry,
        formattedDate: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      }
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate completion rate
  const completionRates = formattedData.map((entry) => {
    const rate = entry.scheduled > 0 ? Math.round((entry.completed / entry.scheduled) * 100) : 0
    return {
      ...entry,
      completionRate: rate,
    }
  })

  return (
    <Card className="bg-gray-800 border-gray-700 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-cyan-400">Task Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionRates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="formattedDate"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#4B5563" }}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={{ stroke: "#4B5563" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "0.375rem",
                  color: "#E5E7EB",
                }}
                itemStyle={{ color: "#E5E7EB" }}
                labelStyle={{ color: "#E5E7EB", fontWeight: "bold", marginBottom: "0.5rem" }}
              />
              <Legend wrapperStyle={{ color: "#E5E7EB", fontSize: 12 }} />
              <Bar name="Scheduled" dataKey="scheduled" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar name="Completed" dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-2 bg-gray-700 rounded-md">
            <span className="text-sm text-gray-400">Average Completion</span>
            <span className="text-xl font-bold text-green-500">
              {completionRates.length > 0
                ? `${Math.round(completionRates.reduce((acc, curr) => acc + curr.completionRate, 0) / completionRates.length)}%`
                : "0%"}
            </span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-700 rounded-md">
            <span className="text-sm text-gray-400">Today's Progress</span>
            <span className="text-xl font-bold text-cyan-400">
              {completionRates.length > 0 && completionRates[completionRates.length - 1].scheduled > 0
                ? `${completionRates[completionRates.length - 1].completed}/${completionRates[completionRates.length - 1].scheduled}`
                : "0/0"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
