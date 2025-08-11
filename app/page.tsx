"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Brain,
  Heart,
  Download,
  BarChart3,
  Zap,
  Shield,
  AlertTriangle,
  TrendingUp,
  BookOpen,
} from "lucide-react"

import { EmotionInputs } from "@/components/emotion-inputs"
import { BiometricInputs } from "@/components/biometric-inputs"
import { EmotionalAnalysis } from "@/components/emotional-analysis"
import { VisualizationPanel } from "@/components/visualization-panel"
import { ReportSummary } from "@/components/report-summary"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { FloatingChatbot } from "@/components/floating-chatbot"
import { DetailedGraphGuide } from "@/components/detailed-graph-guide"
import { calculateEmotionalGeometry, calculateStabilityIndex, classifyMentalState } from "@/lib/emotional-math"
import { generateEmotionalAnalysisPDF } from "@/lib/pdf-generator"

export interface EmotionData {
  joy: number
  sadness: number
  anger: number
  fear: number
  surprise: number
  disgust: number
}

export interface BiometricData {
  heartRate: number
  bloodPressure: string
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
  stressLevel: number
}

export interface AnalysisResult {
  dominantEmotion: string
  emotionalEnergy: number
  curvatureLevel: number
  curvatures: number[]
  stabilityIndex: number
  classification: string
  mentalStability: string
  biometricFlags: string[]
  recommendations: string[]
}

export default function EmotionalGeometryAI() {
  const [emotions, setEmotions] = useState<EmotionData>({
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
  })

  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    stressLevel: 3,
  })

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const runAnalysis = async () => {
    setIsAnalyzing(true)

    // Simulate analysis delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const geometry = calculateEmotionalGeometry(emotions)
    const stabilityIndex = calculateStabilityIndex(emotions, biometrics)
    const mentalState = classifyMentalState(emotions, biometrics, geometry.curvature)

    const result: AnalysisResult = {
      dominantEmotion: geometry.dominantEmotion,
      emotionalEnergy: geometry.magnitude / 10, // Normalize to 0-1
      curvatureLevel: geometry.curvature,
      curvatures: geometry.curvatures,
      stabilityIndex: stabilityIndex,
      classification: geometry.classification,
      mentalStability: mentalState.stability,
      biometricFlags: mentalState.flags,
      recommendations: mentalState.recommendations,
    }

    setAnalysis(result)
    setIsAnalyzing(false)
  }

  const generateReport = () => {
    if (!analysis) return

    try {
      const pdf = generateEmotionalAnalysisPDF(analysis, emotions, biometrics)
      pdf.save(`emotional-analysis-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF report. Please try again.")
    }
  }

  const resetAnalysis = () => {
    setEmotions({
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0,
    })
    setBiometrics({
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      stressLevel: 3,
    })
    setAnalysis(null)
  }

  const getStabilityColor = (index: number) => {
    if (index >= 0.8) return "text-green-500"
    if (index >= 0.6) return "text-yellow-500"
    if (index >= 0.4) return "text-orange-500"
    return "text-red-500"
  }

  const getStabilityBadge = (stability: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      stable: "default",
      unstable: "secondary",
      volatile: "destructive",
      critical: "destructive",
    }
    return variants[stability] || "outline"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Emotional Geometry AI
                </h1>
                <p className="text-slate-400 text-sm mt-1">Advanced emotional state analysis and visualization</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowGuide(true)}
                className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 backdrop-blur-sm bg-slate-800/20"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Reading Guide
              </Button>

              {analysis && (
                <Button
                  onClick={generateReport}
                  className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4 space-y-8">
            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-100 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  Emotional State
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <EmotionInputs emotions={emotions} setEmotions={setEmotions} />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-100 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  Biometric Data
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <BiometricInputs biometrics={biometrics} setBiometrics={setBiometrics} />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="flex-1 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 h-12 text-base font-medium"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-3" />
                    Run Analysis
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={resetAnalysis}
                className="border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-slate-800/20 backdrop-blur-sm h-12 px-6"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="xl:col-span-5 space-y-8">
            {isAnalyzing ? (
              <LoadingSkeleton />
            ) : analysis ? (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm font-medium">Dominant Emotion</p>
                          <p className="text-2xl font-bold text-slate-100 mt-1">{analysis.dominantEmotion}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm font-medium">Mental Stability</p>
                          <Badge
                            variant={getStabilityBadge(analysis.mentalStability)}
                            className="mt-2 text-xs font-semibold"
                          >
                            {analysis.mentalStability.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm font-medium">Emotional Energy</p>
                          <p className="text-2xl font-bold text-slate-100 mt-1">
                            {Math.round(analysis.emotionalEnergy * 100)}%
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm font-medium">Stability Index</p>
                          <p className={`text-2xl font-bold mt-1 ${getStabilityColor(analysis.stabilityIndex)}`}>
                            {Math.round(analysis.stabilityIndex * 100)}%
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {analysis.biometricFlags.length > 0 && (
                  <Card className="bg-red-900/20 border-red-500/30 backdrop-blur-xl shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-red-400 text-lg">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        Crisis Indicators Detected
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {analysis.biometricFlags.map((flag, index) => (
                          <Badge key={index} variant="destructive" className="text-xs font-medium">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-red-300 text-sm leading-relaxed">
                        Please consider seeking professional support if these symptoms persist.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <EmotionalAnalysis analysis={analysis} emotions={emotions} />
              </>
            ) : (
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-300 mb-3">Ready for Analysis</h3>
                  <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
                    Set your emotional levels and biometric data, then click "Run Analysis" to begin your comprehensive
                    emotional assessment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="xl:col-span-3 space-y-8">
            {analysis ? (
              <VisualizationPanel analysis={analysis} emotions={emotions} />
            ) : (
              <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl shadow-xl">
                <CardContent className="p-10 text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-3">Visualizations</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Interactive charts and graphs will appear here after running your analysis.
                  </p>
                </CardContent>
              </Card>
            )}

            {analysis && <ReportSummary analysis={analysis} emotions={emotions} biometrics={biometrics} />}
          </div>
        </div>
      </div>

      {/* Floating Chatbot */}
      <FloatingChatbot analysis={analysis} emotions={emotions} />

      {/* Detailed Graph Guide Modal */}
      {showGuide && (
        <DetailedGraphGuide
          isOpen={showGuide}
          onClose={() => setShowGuide(false)}
          analysis={analysis}
          emotions={emotions}
        />
      )}
    </div>
  )
}
