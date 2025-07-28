"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface JournalEntry {
  id: string
  content: string
  timestamp: Date
  stabilityScore: number
  emotionalState: string
  detectedFlags: string[]
}

interface EmotionalTrendChartProps {
  journalEntries: JournalEntry[]
  onClose: () => void
}

export function EmotionalTrendChart({ journalEntries, onClose }: EmotionalTrendChartProps) {
  const chartData = journalEntries
    .slice(-14) // Last 14 entries
    .map((entry, index) => ({
      day: index + 1,
      stability: entry.stabilityScore,
      date: entry.timestamp.toLocaleDateString(),
      emotion: entry.emotionalState,
      flags: entry.detectedFlags.length,
    }))

  const averageStability =
    chartData.length > 0 ? chartData.reduce((sum, entry) => sum + entry.stability, 0) / chartData.length : 0

  const trend = chartData.length > 1 ? chartData[chartData.length - 1].stability - chartData[0].stability : 0

  const recentFlags = journalEntries
    .slice(-7)
    .flatMap((entry) => entry.detectedFlags)
    .reduce(
      (acc, flag) => {
        acc[flag] = (acc[flag] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-10 overflow-y-auto">
      <Card className="m-4 bg-slate-800/90 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Calendar className="h-5 w-5" />
              Emotional Trends
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-slate-400">Your mental stability patterns over time</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-slate-300">Average Stability</span>
                {trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div
                className={`text-2xl font-bold ${
                  averageStability >= 70
                    ? "text-green-400"
                    : averageStability >= 50
                      ? "text-yellow-400"
                      : averageStability >= 35
                        ? "text-orange-400"
                        : "text-red-400"
                }`}
              >
                {averageStability.toFixed(1)}
              </div>
            </div>

            <div className="p-4 bg-slate-700/30 rounded-lg">
              <div className="text-sm text-slate-300 mb-2">Trend Direction</div>
              <div
                className={`text-2xl font-bold ${
                  trend > 5 ? "text-green-400" : trend < -5 ? "text-red-400" : "text-yellow-400"
                }`}
              >
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="day" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "#475569" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "#475569" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                    formatter={(value: any, name: string) => [
                      `${value}`,
                      name === "stability" ? "Stability Score" : name,
                    ]}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="stability"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Flags */}
          {Object.keys(recentFlags).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-slate-200 font-medium">Recent Patterns</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(recentFlags).map(([flag, count]) => (
                  <Badge
                    key={flag}
                    variant={
                      flag.includes("Crisis") ? "destructive" : flag.includes("Instability") ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {flag} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">Insights</h4>
            <div className="text-sm text-slate-300 space-y-1">
              {trend > 10 && <p>✨ Your stability has been improving significantly. Keep up the great work!</p>}
              {trend < -10 && (
                <p>
                  💙 I notice your stability has been declining. Would you like to explore what might be contributing to
                  this?
                </p>
              )}
              {averageStability < 35 && (
                <p>
                  🛡️ Your recent scores suggest you might benefit from additional support. Consider reaching out to a
                  mental health professional.
                </p>
              )}
              {Object.keys(recentFlags).includes("Emotional Numbness") && (
                <p>
                  🌸 I've noticed patterns of emotional numbness. This is a common protective response - you're not
                  alone in feeling this way.
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Close Trends
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
