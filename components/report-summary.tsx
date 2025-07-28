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
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Unstable":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Volatile":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Emotional State Analysis
          {getStabilityIcon()}
        </CardTitle>
        <CardDescription>Generated at {new Date().toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:scale-105">
            <div className="text-xl font-bold text-blue-600 mb-1">{analysis.dominantEmotion}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Dominant Emotion</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800 transition-all duration-200 hover:scale-105">
            <div className="text-xl font-bold text-purple-600 mb-1">{analysis.emotionalEnergy.toFixed(1)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Emotional Energy</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-800 transition-all duration-200 hover:scale-105">
            <div className="text-xl font-bold text-orange-600 mb-1">{analysis.dominantCurvature}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Highest Curvature</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 transition-all duration-200 hover:scale-105">
            <div className="text-xl font-bold text-green-600 mb-1">{(analysis.stabilityIndex * 100).toFixed(1)}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Stability Score</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Overall Classification:</span>
          <Badge className={getClassificationColor()}>{analysis.classification}</Badge>
        </div>

        {analysis.biometricFlags.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Biometric Flags:</span>
            <div className="flex flex-wrap gap-2">
              {analysis.biometricFlags.map((flag, index) => (
                <Badge key={index} variant="secondary">
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
