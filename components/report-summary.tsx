import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AnalysisResult, EmotionData } from "@/app/page"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ReportSummaryProps {
  analysis: AnalysisResult
  emotions: EmotionData
}

export function ReportSummary({ analysis, emotions }: ReportSummaryProps) {
  const getStabilityIcon = () => {
    if (analysis.stabilityIndex > 0.5) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (analysis.stabilityIndex > 0.2) return <Minus className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getClassificationColor = () => {
    switch (analysis.classification) {
      case "Stable":
        return "bg-emerald-800/80 text-emerald-100 border border-emerald-600/50"
      case "Unstable":
        return "bg-amber-800/80 text-amber-100 border border-amber-600/50"
      case "Volatile":
        return "bg-rose-800/80 text-rose-100 border border-rose-600/50"
      default:
        return "bg-slate-800/80 text-slate-100 border border-slate-600/50"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-indigo-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-100">
          Emotional State Analysis
          {getStabilityIcon()}
        </CardTitle>
        <CardDescription className="text-indigo-200/80">Generated at {new Date().toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-800/80 to-blue-900/80 rounded-lg border border-blue-600/50 transition-all duration-200 hover:scale-105 backdrop-blur-sm">
            <div className="text-xl font-bold text-blue-100 mb-1">{analysis.dominantEmotion}</div>
            <div className="text-sm text-blue-200/80">Dominant Emotion</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-800/80 to-purple-900/80 rounded-lg border border-purple-600/50 transition-all duration-200 hover:scale-105 backdrop-blur-sm">
            <div className="text-xl font-bold text-purple-100 mb-1">{analysis.emotionalEnergy.toFixed(1)}</div>
            <div className="text-sm text-purple-200/80">Emotional Energy</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-orange-800/80 to-orange-900/80 rounded-lg border border-orange-600/50 transition-all duration-200 hover:scale-105 backdrop-blur-sm">
            <div className="text-xl font-bold text-orange-100 mb-1">{analysis.dominantCurvature}</div>
            <div className="text-sm text-orange-200/80">Highest Curvature</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-800/80 to-green-900/80 rounded-lg border border-green-600/50 transition-all duration-200 hover:scale-105 backdrop-blur-sm">
            <div className="text-xl font-bold text-green-100 mb-1">{(analysis.stabilityIndex * 100).toFixed(1)}%</div>
            <div className="text-sm text-green-200/80">Stability Score</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-indigo-200">Overall Classification:</span>
          <Badge className={getClassificationColor()}>{analysis.classification}</Badge>
        </div>

        {analysis.biometricFlags.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-indigo-200">Biometric Flags:</span>
            <div className="flex flex-wrap gap-2">
              {analysis.biometricFlags.map((flag, index) => (
                <Badge
                  key={index}
                  className="bg-teal-800/80 text-teal-100 border border-teal-600/50 hover:bg-teal-700/80"
                >
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
