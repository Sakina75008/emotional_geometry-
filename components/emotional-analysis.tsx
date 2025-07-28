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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mathematical Formulations</CardTitle>
          <CardDescription>The geometric equations used to model your emotional state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2 font-semibold">Emotion Vector Magnitude:</div>
            <div>|Eᵢ| = Iᵢ × k, where k = {k}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2 font-semibold">Curvature Approximation:</div>
            <div>κᵢ ≈ |Eᵢ - Ē| / (Ē + ε), where ε = 0.01</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2 font-semibold">Emotional Energy:</div>
            <div>Energy = Σ |Eᵢ|²</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2 font-semibold">Stability Index:</div>
            <div>S = 1 / (max(κᵢ) + ε)</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Vector Analysis</CardTitle>
          <CardDescription>Individual emotion vector calculations and properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Emotion</th>
                  <th className="text-right p-2">Intensity (Iᵢ)</th>
                  <th className="text-right p-2">Vector Magnitude |Eᵢ|</th>
                  <th className="text-right p-2">Curvature κᵢ</th>
                  <th className="text-right p-2">Energy |Eᵢ|²</th>
                </tr>
              </thead>
              <tbody>
                {emotionLabels.map((label, index) => (
                  <tr key={label} className="border-b">
                    <td className="p-2 font-medium">{label}</td>
                    <td className="p-2 text-right">{Object.values(emotions)[index]}</td>
                    <td className="p-2 text-right">{analysis.emotionVectors[index].toFixed(2)}</td>
                    <td className="p-2 text-right">{analysis.curvatures[index].toFixed(4)}</td>
                    <td className="p-2 text-right">{Math.pow(analysis.emotionVectors[index], 2).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biometric Interpretation</CardTitle>
          <CardDescription>Physiological markers and their emotional implications</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.biometricFlags.length > 0 ? (
            <div className="space-y-2">
              {analysis.biometricFlags.map((flag, index) => (
                <Badge key={index} variant="outline" className="mr-2">
                  {flag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No significant biometric flags detected. All physiological markers are within normal ranges.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geometric Interpretation</CardTitle>
          <CardDescription>What your emotional geometry reveals about your current state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Vector Space Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your emotions exist in a 6-dimensional space. The total emotional vector magnitude is{" "}
                <span className="font-mono">
                  {Math.sqrt(analysis.emotionVectors.reduce((sum, v) => sum + v * v, 0)).toFixed(2)}
                </span>
                , indicating the overall intensity of your emotional state.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Curvature Insights</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The curvature measures emotional instability. Your highest curvature is in{" "}
                <span className="font-semibold">{analysis.dominantCurvature}</span>, suggesting this emotion shows the
                most deviation from your emotional baseline.
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold mb-2">Overall Assessment</h4>
            <p className="text-sm">
              Based on your emotional geometry, you are currently in a{" "}
              <span
                className={`font-semibold ${
                  analysis.classification === "Stable"
                    ? "text-green-600"
                    : analysis.classification === "Unstable"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {analysis.classification.toLowerCase()}
              </span>{" "}
              emotional state. Your stability index of {analysis.stabilityIndex.toFixed(3)} indicates{" "}
              {analysis.stabilityIndex > 0.5
                ? "good emotional balance"
                : analysis.stabilityIndex > 0.2
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
