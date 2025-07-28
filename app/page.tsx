"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun, Download, Brain } from "lucide-react"
import { EmotionInputs } from "@/components/emotion-inputs"
import { BiometricInputs } from "@/components/biometric-inputs"
import { EmotionalAnalysis } from "@/components/emotional-analysis"
import { VisualizationPanel } from "@/components/visualization-panel"
import { ReportSummary } from "@/components/report-summary"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { MentalHealthChatbot } from "@/components/mental-health-chatbot"
import {
  computeEmotionVectors,
  calculateCurvature,
  calculateEmotionalEnergy,
  calculateStabilityIndex,
  diagnoseState,
} from "@/lib/emotional-math"

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
  skinConductance: number
  voicePitchVariance: number
  breathRate: number
}

export interface AnalysisResult {
  emotionVectors: number[]
  curvatures: number[]
  emotionalEnergy: number
  stabilityIndex: number
  dominantEmotion: string
  dominantCurvature: string
  classification: string
  biometricFlags: string[]
  curvatureLevel: number
  mentalStability: "stable" | "unstable" | "critical"
}

export default function EmotionalGeometryAI() {
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode
  const [emotions, setEmotions] = useState<EmotionData>({
    joy: 5,
    sadness: 3,
    anger: 2,
    fear: 4,
    surprise: 6,
    disgust: 1,
  })

  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 75,
    skinConductance: 30,
    voicePitchVariance: 40,
    breathRate: 16,
  })

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeEmotions = async () => {
    setIsAnalyzing(true)

    // Simulate analysis delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const emotionVectors = computeEmotionVectors(emotions)
    const curvatures = calculateCurvature(emotionVectors)
    const emotionalEnergy = calculateEmotionalEnergy(emotionVectors)
    const stabilityIndex = calculateStabilityIndex(curvatures)
    const diagnosis = diagnoseState(emotions, biometrics, emotionVectors, curvatures, stabilityIndex)

    // Calculate curvature level (max curvature normalized)
    const curvatureLevel = Math.max(...curvatures)

    // Determine mental stability based on negative emotions (more accurate)
    let mentalStability: "stable" | "unstable" | "critical" = "stable"

    // Check negative emotions specifically
    const negativeEmotions = [emotions.sadness, emotions.fear, emotions.anger, emotions.disgust]
    const criticalEmotions = negativeEmotions.filter((emotion) => emotion >= 8)
    const highEmotions = negativeEmotions.filter((emotion) => emotion >= 6)

    if (criticalEmotions.length > 0) {
      mentalStability = "critical"
    } else if (highEmotions.length > 0 || stabilityIndex < 0.3) {
      mentalStability = "unstable"
    }

    setAnalysis({
      emotionVectors,
      curvatures,
      emotionalEnergy,
      stabilityIndex,
      curvatureLevel,
      mentalStability,
      ...diagnosis,
    })

    setIsAnalyzing(false)
  }

  const generateReport = () => {
    if (!analysis) return

    const reportData = {
      timestamp: new Date().toISOString(),
      emotions,
      biometrics,
      analysis,
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `emotional-analysis-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? "dark bg-slate-900" : "bg-slate-50"}`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Emotional Geometry AI
              </h1>
              <p className="text-slate-400 mt-1 font-medium">
                Mathematical modeling of emotional states through geometric analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="border-slate-600 hover:bg-slate-800 transition-all duration-300"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {analysis && (
              <Button
                onClick={generateReport}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  Emotional Input
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Rate the intensity of each emotion (0-10 scale)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmotionInputs emotions={emotions} setEmotions={setEmotions} />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Biometric Markers
                </CardTitle>
                <CardDescription className="text-slate-400">Optional physiological indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <BiometricInputs biometrics={biometrics} setBiometrics={setBiometrics} />
              </CardContent>
            </Card>

            <Button
              onClick={analyzeEmotions}
              disabled={isAnalyzing}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg text-lg font-semibold"
              size="lg"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : (
                "Analyze Emotional State"
              )}
            </Button>
          </div>

          {/* Analysis Panel */}
          <div className="lg:col-span-2 space-y-6">
            {isAnalyzing ? (
              <LoadingSkeleton />
            ) : analysis ? (
              <>
                <ReportSummary analysis={analysis} emotions={emotions} />

                <Tabs defaultValue="visualization" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-slate-700">
                    <TabsTrigger
                      value="visualization"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      Visualizations
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      Mathematical Analysis
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="visualization" className="space-y-6 mt-6">
                    <VisualizationPanel analysis={analysis} emotions={emotions} />
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-6 mt-6">
                    <EmotionalAnalysis analysis={analysis} emotions={emotions} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center bg-slate-800/30 border-slate-700 backdrop-blur-sm">
                <div className="text-center text-slate-400">
                  <Brain className="h-20 w-20 mx-auto mb-6 opacity-30" />
                  <p className="text-xl font-medium mb-2">Ready to analyze your emotional state</p>
                  <p className="text-sm opacity-75">Click "Analyze Emotional State" to begin your journey</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mental Health Chatbot */}
      <MentalHealthChatbot analysis={analysis} emotions={emotions} />
    </div>
  )
}
