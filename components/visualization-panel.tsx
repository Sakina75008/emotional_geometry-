"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalysisResult, EmotionData } from "@/app/page"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { DetailedGraphGuide } from "@/components/detailed-graph-guide"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Info, BookOpen } from "lucide-react"

interface VisualizationPanelProps {
  analysis: AnalysisResult
  emotions: EmotionData
}

export function VisualizationPanel({ analysis, emotions }: VisualizationPanelProps) {
  const emotionLabels = ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Disgust"]
  const emotionColors = ["#fbbf24", "#3b82f6", "#ef4444", "#8b5cf6", "#f97316", "#10b981"]

  const radarData = emotionLabels
    .map((label, index) => ({
      emotion: label,
      magnitude: analysis.emotionVectors[index],
      intensity: Object.values(emotions)[index],
    }))
    .filter((item) => item.intensity > 0)

  const curvatureData = emotionLabels
    .map((label, index) => ({
      emotion: label,
      curvature: analysis.curvatures[index],
      intensity: Object.values(emotions)[index],
      color: emotionColors[index],
    }))
    .filter((item) => item.intensity > 0)

  const energyData = [
    { metric: "Emotional Energy", value: analysis.emotionalEnergy, color: "#8b5cf6" },
    { metric: "Stability Index", value: analysis.stabilityIndex * 10, color: "#10b981" },
  ]

  const [showDetailedGuide, setShowDetailedGuide] = useState(false)

  return (
    <div className="space-y-6">
      {/* Enhanced header with detailed guide button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-100">Emotional Visualizations</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetailedGuide(true)}
          className="border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-slate-100"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Complete Reading Guide
        </Button>
      </div>

      {/* Show detailed guide if active */}
      {showDetailedGuide && (
        <div className="relative">
          <DetailedGraphGuide onClose={() => setShowDetailedGuide(false)} />
        </div>
      )}

      {/* Rest of existing visualization content... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
              Emotion Vector Magnitudes
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedGuide(true)}
                className="ml-auto text-slate-400 hover:text-slate-100 p-1"
              >
                <Info className="h-3 w-3" />
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Radar chart showing the geometric representation of emotional vectors (only active emotions shown)
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 12, fill: "#cbd5e1" }} />
                <PolarRadiusAxis angle={90} domain={[0, 12]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickCount={4} />
                <Radar
                  name="Vector Magnitude"
                  dataKey="magnitude"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
                />
                <Radar
                  name="Raw Intensity"
                  dataKey="intensity"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
              Emotional Curvature (κ)
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedGuide(true)}
                className="ml-auto text-slate-400 hover:text-slate-100 p-1"
              >
                <Info className="h-3 w-3" />
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Instability measure for active emotions only (higher bars = more deviation from baseline)
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-gradient-to-br from-orange-500/5 to-red-600/5 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={curvatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="emotion" angle={-45} textAnchor="end" height={80} tick={{ fill: "#cbd5e1" }} />
                <YAxis tick={{ fill: "#cbd5e1" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                  formatter={(value: any) => [`${Number(value).toFixed(3)}`, "Curvature"]}
                />
                <Bar dataKey="curvature" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
              Energy & Stability Metrics
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedGuide(true)}
                className="ml-auto text-slate-400 hover:text-slate-100 p-1"
              >
                <Info className="h-3 w-3" />
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Overall emotional energy and stability measurements
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-gradient-to-br from-green-500/5 to-blue-600/5 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={energyData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis type="number" tick={{ fill: "#cbd5e1" }} />
                <YAxis dataKey="metric" type="category" width={120} tick={{ fill: "#cbd5e1" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                  formatter={(value: any, name: string) => [
                    name === "Stability Index" ? `${(Number(value) / 10).toFixed(3)}` : Number(value).toFixed(1),
                    name === "Stability Index" ? "Stability Index" : "Energy",
                  ]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
              Emotional Geometry Summary
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedGuide(true)}
                className="ml-auto text-slate-400 hover:text-slate-100 p-1"
              >
                <Info className="h-3 w-3" />
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Mathematical relationships in your emotional state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-blue-400 mb-1">{analysis.emotionalEnergy.toFixed(1)}</div>
                <div className="text-sm text-slate-300">Total Energy</div>
                <div className="text-xs text-slate-500 mt-1">
                  {analysis.emotionalEnergy > 200 ? "High" : analysis.emotionalEnergy > 50 ? "Moderate" : "Low"}
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-green-400 mb-1">{analysis.stabilityIndex.toFixed(3)}</div>
                <div className="text-sm text-slate-300">Stability Index</div>
                <div className="text-xs text-slate-500 mt-1">
                  {analysis.stabilityIndex > 2
                    ? "Very Stable"
                    : analysis.stabilityIndex > 0.5
                      ? "Stable"
                      : analysis.stabilityIndex > 0.2
                        ? "Unstable"
                        : "Volatile"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-sm text-slate-300">Dominant Emotion:</span>
                <span className="font-semibold text-slate-100 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full">
                  {analysis.dominantEmotion}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-sm text-slate-300">Highest Curvature:</span>
                <span className="font-semibold text-slate-100 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-full">
                  {analysis.dominantCurvature}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-sm text-slate-300">Classification:</span>
                <span
                  className={`font-semibold px-3 py-1 rounded-full ${
                    analysis.classification === "Stable"
                      ? "text-green-400 bg-green-500/20"
                      : analysis.classification === "Unstable"
                        ? "text-yellow-400 bg-yellow-500/20"
                        : "text-red-400 bg-red-500/20"
                  }`}
                >
                  {analysis.classification}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                <span className="text-sm text-slate-300">Mental State:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold px-3 py-1 rounded-full ${
                      analysis.mentalStability === "stable"
                        ? "text-green-400 bg-green-500/20"
                        : analysis.mentalStability === "unstable"
                          ? "text-yellow-400 bg-yellow-500/20"
                          : "text-red-400 bg-red-500/20"
                    }`}
                  >
                    {analysis.mentalStability.charAt(0).toUpperCase() + analysis.mentalStability.slice(1)}
                  </span>
                  {analysis.mentalStability === "critical" && (
                    <span className="text-xs text-red-300">(Negative emotion ≥8)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Quick Interpretation
              </h4>
              <p className="text-sm text-slate-300">
                {analysis.emotionalEnergy > 200 && analysis.stabilityIndex < 0.5
                  ? "High emotional intensity with instability - consider grounding techniques"
                  : analysis.emotionalEnergy < 50 && analysis.stabilityIndex > 1
                    ? "Low emotional activation but stable - possibly in a calm state"
                    : analysis.stabilityIndex < 0.2
                      ? "Significant emotional volatility detected - focus on stabilization"
                      : "Moderate emotional state - monitor for changes"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
