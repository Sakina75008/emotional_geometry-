import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AnalysisResult, EmotionData } from "@/app/page"

interface EmotionalAnalysisProps {
  analysis: AnalysisResult
  emotions: EmotionData
}

export function EmotionalAnalysis({ analysis, emotions }: EmotionalAnalysisProps) {
  const emotionLabels = ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Disgust"]
  const k = 1.2 // Scaling factor

  if (!analysis || !emotions) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 dark:text-gray-300">
              Please complete the emotional analysis to view detailed results.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const emotionVectors = analysis.emotionVectors || []
  const curvatures = analysis.curvatures || []
  const biometricFlags = analysis.biometricFlags || []
  const emotionValues = Object.values(emotions || {})

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-indigo-100">Mathematical Formulations</CardTitle>
          <CardDescription className="text-indigo-200/80">
            The geometric equations used to model your emotional state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-indigo-800/60 p-4 rounded-lg font-mono text-sm border border-indigo-600/40 text-indigo-100">
            <div className="mb-2 font-semibold text-indigo-200">Emotion Vector Magnitude:</div>
            <div>|Eᵢ| = Iᵢ × k, where k = {k}</div>
          </div>

          <div className="bg-indigo-800/60 p-4 rounded-lg font-mono text-sm border border-indigo-600/40 text-indigo-100">
            <div className="mb-2 font-semibold text-indigo-200">Curvature Approximation:</div>
            <div>κᵢ ≈ |Eᵢ - Ē| / (Ē + ε), where ε = 0.01</div>
          </div>

          <div className="bg-indigo-800/60 p-4 rounded-lg font-mono text-sm border border-indigo-600/40 text-indigo-100">
            <div className="mb-2 font-semibold text-indigo-200">Emotional Energy:</div>
            <div>Energy = Σ |Eᵢ|²</div>
          </div>

          <div className="bg-indigo-800/60 p-4 rounded-lg font-mono text-sm border border-indigo-600/40 text-indigo-100">
            <div className="mb-2 font-semibold text-indigo-200">Stability Index:</div>
            <div>S = 1 / (max(κᵢ) + ε)</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-900/80 to-cyan-900/80 border-teal-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-teal-100">Detailed Vector Analysis</CardTitle>
          <CardDescription className="text-teal-200/80">
            Individual emotion vector calculations and properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-teal-100">
              <thead>
                <tr className="border-b border-teal-600/50">
                  <th className="text-left p-2 text-teal-200">Emotion</th>
                  <th className="text-right p-2 text-teal-200">Intensity (Iᵢ)</th>
                  <th className="text-right p-2 text-teal-200">Vector Magnitude |Eᵢ|</th>
                  <th className="text-right p-2 text-teal-200">Curvature κᵢ</th>
                  <th className="text-right p-2 text-teal-200">Energy |Eᵢ|²</th>
                </tr>
              </thead>
              <tbody>
                {emotionLabels.map((label, index) => (
                  <tr key={label} className="border-b border-teal-700/30">
                    <td className="p-2 font-medium">{label}</td>
                    <td className="p-2 text-right">{emotionValues[index] || 0}</td>
                    <td className="p-2 text-right">{(emotionVectors[index] || 0).toFixed(2)}</td>
                    <td className="p-2 text-right">{(curvatures[index] || 0).toFixed(4)}</td>
                    <td className="p-2 text-right">{Math.pow(emotionVectors[index] || 0, 2).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-900/80 to-green-900/80 border-emerald-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-emerald-100">Biometric Interpretation</CardTitle>
          <CardDescription className="text-emerald-200/80">
            Physiological markers and their emotional implications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {biometricFlags.length > 0 ? (
            <div className="space-y-2">
              {biometricFlags.map((flag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="mr-2 border-emerald-400/60 text-emerald-200 bg-emerald-800/40"
                >
                  {flag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-emerald-200/80">
              No significant biometric flags detected. All physiological markers are within normal ranges.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-violet-900/80 to-purple-900/80 border-violet-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-violet-100">Geometric Interpretation</CardTitle>
          <CardDescription className="text-violet-200/80">
            What your emotional geometry reveals about your current state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-violet-800/60 border border-violet-600/40 rounded-lg backdrop-blur-sm">
              <h4 className="font-semibold mb-2 text-violet-200">Vector Space Analysis</h4>
              <p className="text-sm text-violet-100/90">
                Your emotions exist in a 6-dimensional space. The total emotional vector magnitude is{" "}
                <span className="font-mono text-violet-200 bg-violet-700/50 px-1 rounded">
                  {Math.sqrt(emotionVectors.reduce((sum, v) => sum + v * v, 0)).toFixed(2)}
                </span>
                , indicating the overall intensity of your emotional state.
              </p>
            </div>

            <div className="p-4 bg-violet-800/60 border border-violet-600/40 rounded-lg backdrop-blur-sm">
              <h4 className="font-semibold mb-2 text-violet-200">Curvature Insights</h4>
              <p className="text-sm text-violet-100/90">
                The curvature measures emotional instability. Your highest curvature is in{" "}
                <span className="font-semibold text-violet-200 bg-violet-700/50 px-1 rounded">
                  {analysis.dominantCurvature || "Unknown"}
                </span>
                , suggesting this emotion shows the most deviation from your emotional baseline.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-violet-800/70 to-purple-800/70 rounded-lg border border-violet-600/40 backdrop-blur-sm">
            <h4 className="font-semibold mb-2 text-violet-200">Overall Assessment</h4>
            <p className="text-sm text-violet-100/90">
              Based on your emotional geometry, you are currently in a{" "}
              <span
                className={`font-semibold px-2 py-1 rounded ${
                  analysis.classification === "Stable"
                    ? "text-green-200 bg-green-800/50"
                    : analysis.classification === "Unstable"
                      ? "text-yellow-200 bg-yellow-800/50"
                      : "text-red-200 bg-red-800/50"
                }`}
              >
                {(analysis.classification || "unknown").toLowerCase()}
              </span>{" "}
              emotional state. Your stability index of {(analysis.stabilityIndex || 0).toFixed(3)} indicates{" "}
              {(analysis.stabilityIndex || 0) > 0.5
                ? "good emotional balance"
                : (analysis.stabilityIndex || 0) > 0.2
                  ? "moderate emotional fluctuation"
                  : "significant emotional volatility"}
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
