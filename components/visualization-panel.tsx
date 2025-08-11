"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, BookOpen } from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import type { AnalysisResult, EmotionData } from "@/app/page"
import { DetailedGraphGuide } from "./detailed-graph-guide"

interface VisualizationPanelProps {
  analysis: AnalysisResult
  emotions: EmotionData
}

export function VisualizationPanel({ analysis, emotions }: VisualizationPanelProps) {
  const [showDetailedGuide, setShowDetailedGuide] = useState(false)

  // Prepare radar chart data - only show emotions with non-zero values
  const radarData = Object.entries(emotions)
    .filter(([_, value]) => value > 0) // Only include emotions with values > 0
    .map(([emotion, value]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      value,
      fullMark: 10,
    }))

  // Create emotion order mapping to correctly map curvatures
  const emotionKeys = Object.keys(emotions) // Original order: joy, sadness, anger, fear, surprise, disgust
  const curvatureData = Object.entries(emotions)
    .filter(([_, value]) => value > 0) // Only include emotions with values > 0
    .map(([emotion, value]) => {
      const originalIndex = emotionKeys.indexOf(emotion) // Get original position in emotions object
      return {
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        curvature: analysis.curvatures[originalIndex] || 0, // Use original index for correct curvature
        intensity: value,
      }
    })

  if (showDetailedGuide) {
    return <DetailedGraphGuide onClose={() => setShowDetailedGuide(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Emotional Visualizations</h3>
          <p className="text-slate-400 text-sm">Geometric representation of your emotional state</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowDetailedGuide(true)}
          className="border-slate-600 hover:bg-slate-800 transition-all duration-300"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Complete Reading Guide
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Radar Chart */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              Emotion Radar
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-auto text-slate-400 hover:text-slate-200"
                onClick={() => setShowDetailedGuide(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Vector magnitude representation of emotional intensity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis
                    dataKey="emotion"
                    tick={{ fill: "#cbd5e1", fontSize: 12 }}
                    className="text-slate-300"
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Radar
                    name="Emotions"
                    dataKey="value"
                    stroke="url(#radarGradient)"
                    fill="url(#radarGradient)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Curvature Chart */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              Emotional Curvature
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-auto text-slate-400 hover:text-slate-200"
                onClick={() => setShowDetailedGuide(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Rate of emotional change and volatility analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curvatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis
                    dataKey="emotion"
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[0, "dataMax"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#e2e8f0",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(3)}`,
                      name === "curvature" ? "Curvature" : "Intensity",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="curvature"
                    stroke="url(#curvatureGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="curvatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Guide */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Quick Reading Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">Radar Chart</h4>
              <ul className="space-y-1 text-slate-300">
                <li>
                  • <strong>Shape:</strong> Larger area = higher emotional intensity
                </li>
                <li>
                  • <strong>Balance:</strong> Circular shape = emotional stability
                </li>
                <li>
                  • <strong>Spikes:</strong> Sharp points = dominant emotions
                </li>
                <li>
                  • <strong>Size:</strong> Distance from center = emotion strength
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">Curvature Chart</h4>
              <ul className="space-y-1 text-slate-300">
                <li>
                  • <strong>Height:</strong> Higher values = more volatility
                </li>
                <li>
                  • <strong>Peaks:</strong> Sharp spikes = emotional instability
                </li>
                <li>
                  • <strong>Smoothness:</strong> Flat lines = emotional regulation
                </li>
                <li>
                  • <strong>Range:</strong> 0-0.3 stable, 0.6+ concerning
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-slate-300 text-sm">
              <strong>Pro Tip:</strong> Click "Complete Reading Guide" above for detailed mathematical explanations,
              interpretation techniques, and real-world examples with full analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
