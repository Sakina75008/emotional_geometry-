"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Info, BarChart3, Activity, Zap, Eye, BookOpen } from "lucide-react"

interface DetailedGraphGuideProps {
  onClose: () => void
}

export function DetailedGraphGuide({ onClose }: DetailedGraphGuideProps) {
  const [activeExample, setActiveExample] = useState("balanced")

  const exampleScenarios = {
    balanced: {
      name: "Balanced State",
      emotions: { joy: 6, sadness: 2, anger: 1, fear: 3, surprise: 4, disgust: 1 },
      description: "A healthy, balanced emotional state with moderate positive emotions",
      insights: [
        "Joy is dominant but not overwhelming",
        "Negative emotions are present but manageable",
        "Good emotional variety and balance",
      ],
    },
    stressed: {
      name: "High Stress",
      emotions: { joy: 2, sadness: 6, anger: 7, fear: 8, surprise: 1, disgust: 4 },
      description: "High stress state with elevated negative emotions",
      insights: [
        "Fear is dominant, indicating anxiety",
        "Multiple negative emotions are elevated",
        "Low joy suggests difficulty finding positivity",
      ],
    },
    excited: {
      name: "High Energy",
      emotions: { joy: 9, sadness: 1, anger: 0, fear: 2, surprise: 8, disgust: 0 },
      description: "High positive energy with excitement and joy",
      insights: [
        "Very high joy and surprise",
        "Minimal negative emotions",
        "High energy but potentially unstable due to intensity",
      ],
    },
    depressed: {
      name: "Low Mood",
      emotions: { joy: 1, sadness: 8, anger: 2, fear: 5, surprise: 0, disgust: 3 },
      description: "Depressive state with high sadness and low positive emotions",
      insights: [
        "Sadness is overwhelmingly dominant",
        "Very low joy and surprise",
        "Fear is also elevated, suggesting anxiety with depression",
      ],
    },
  }

  const calculateExampleMetrics = (emotions: any) => {
    const k = 1.2
    const vectors = Object.values(emotions).map((v: any) => v * k)
    const activeVectors = vectors.filter((v) => v > 0)
    const mean = activeVectors.length > 0 ? activeVectors.reduce((a, b) => a + b, 0) / activeVectors.length : 0
    const curvatures = vectors.map((v) => (v === 0 ? 0 : Math.abs(v - mean) / (mean + 0.01)))
    const energy = vectors.reduce((sum, v) => sum + v * v, 0)
    const stability = 1 / (Math.max(...curvatures) + 0.01)

    return { vectors, curvatures, energy, stability, mean }
  }

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-10 overflow-y-auto">
      <Card className="m-4 bg-slate-800/90 border-slate-700 max-w-6xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <BookOpen className="h-5 w-5" />
              Complete Graph Reading Guide
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-slate-400">
            Master the art of interpreting your emotional geometry visualizations with detailed examples
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-700/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                <Info className="h-4 w-4 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="radar" className="data-[state=active]:bg-purple-600">
                <Activity className="h-4 w-4 mr-1" />
                Radar Chart
              </TabsTrigger>
              <TabsTrigger value="curvature" className="data-[state=active]:bg-orange-600">
                <BarChart3 className="h-4 w-4 mr-1" />
                Curvature
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-green-600">
                <Zap className="h-4 w-4 mr-1" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="examples" className="data-[state=active]:bg-pink-600">
                <Eye className="h-4 w-4 mr-1" />
                Examples
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-slate-100">Understanding Emotional Geometry</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-400">Mathematical Foundation</h4>
                    <div className="bg-slate-700/30 p-4 rounded-lg space-y-3">
                      <p className="text-slate-300 text-sm">
                        Your emotions are modeled as vectors in 6-dimensional space using differential geometry
                        principles:
                      </p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <span>
                            <strong>Vector Space:</strong> Each emotion exists as a point in mathematical space
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <span>
                            <strong>Magnitude:</strong> Represents the intensity of each emotion
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                          <span>
                            <strong>Curvature:</strong> Measures deviation from your emotional baseline
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <span>
                            <strong>Topology:</strong> How emotions relate to each other in space
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-400">Key Formulas</h4>
                    <div className="bg-slate-700/30 p-4 rounded-lg space-y-3">
                      <div className="space-y-2">
                        <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                          <p className="text-blue-400 font-mono text-sm">|Eᵢ| = Iᵢ × k</p>
                          <p className="text-xs text-slate-400 mt-1">Vector magnitude (k = 1.2)</p>
                        </div>
                        <div className="bg-orange-500/10 p-3 rounded border border-orange-500/20">
                          <p className="text-orange-400 font-mono text-sm">κᵢ = |Eᵢ - Ē| / (Ē + ε)</p>
                          <p className="text-xs text-slate-400 mt-1">Curvature (ε = 0.01)</p>
                        </div>
                        <div className="bg-purple-500/10 p-3 rounded border border-purple-500/20">
                          <p className="text-purple-400 font-mono text-sm">Energy = Σ |Eᵢ|²</p>
                          <p className="text-xs text-slate-400 mt-1">Total emotional energy</p>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                          <p className="text-green-400 font-mono text-sm">S = 1 / (max(κᵢ) + ε)</p>
                          <p className="text-xs text-slate-400 mt-1">Stability index</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">Why This Matters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                    <div>
                      <h5 className="font-semibold text-slate-200 mb-2">Objective Measurement</h5>
                      <p>Transforms subjective feelings into measurable, comparable data points</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-200 mb-2">Pattern Recognition</h5>
                      <p>Identifies emotional patterns and instabilities you might not notice</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-200 mb-2">Predictive Insights</h5>
                      <p>Helps predict emotional volatility and suggests interventions</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="radar" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-slate-100">Radar Chart Deep Dive</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-purple-400">Chart Components</h4>
                    <div className="space-y-3">
                      <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-400 mb-2">Purple Line (Vector Magnitude)</h5>
                        <ul className="space-y-1 text-sm text-slate-300">
                          <li>• Shows your raw emotion × 1.2 scaling factor</li>
                          <li>• Represents the mathematical "strength" of each emotion</li>
                          <li>• Larger values = more intense emotional experience</li>
                          <li>• Range: 0 to 12 (0-10 input × 1.2)</li>
                        </ul>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-400 mb-2">Green Line (Raw Intensity)</h5>
                        <ul className="space-y-1 text-sm text-slate-300">
                          <li>• Your original 0-10 emotion ratings</li>
                          <li>• Baseline for comparison with scaled values</li>
                          <li>• Helps validate the mathematical transformation</li>
                          <li>• Should always be inside or equal to purple line</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-400">Reading Patterns</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h5 className="font-semibold text-slate-200 mb-2">Shape Analysis</h5>
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>
                              <strong>Circular/Balanced:</strong> Emotional equilibrium
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>
                              <strong>Spiky:</strong> Intense, focused emotions
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>
                              <strong>Lopsided:</strong> Emotional imbalance
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>
                              <strong>Large Area:</strong> High emotional energy
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h5 className="font-semibold text-slate-200 mb-2">Important Notes</h5>
                        <ul className="space-y-1 text-sm text-slate-300">
                          <li>• Only emotions with intensity &gt; 0 are shown</li>
                          <li>• Empty areas don't mean "bad" - just not active</li>
                          <li>• Compare purple vs green to see scaling effect</li>
                          <li>• Focus on overall shape, not individual points</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-400 mb-3">Pro Reading Tips</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                    <div>
                      <h5 className="font-semibold text-slate-200 mb-2">What to Look For:</h5>
                      <ul className="space-y-1">
                        <li>• Which emotions dominate the shape?</li>
                        <li>• Are positive and negative emotions balanced?</li>
                        <li>• How large is the overall area?</li>
                        <li>• Are there any surprising absences?</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-200 mb-2">Common Patterns:</h5>
                      <ul className="space-y-1">
                        <li>
                          • <strong>Stress:</strong> High fear, anger, low joy
                        </li>
                        <li>
                          • <strong>Depression:</strong> High sadness, very low joy
                        </li>
                        <li>
                          • <strong>Anxiety:</strong> High fear, moderate other emotions
                        </li>
                        <li>
                          • <strong>Excitement:</strong> High joy, surprise, low negatives
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curvature" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-slate-100">Curvature Analysis Mastery</h3>

                <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-400 mb-4">What Is Curvature?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-slate-300">
                        Curvature (κ) measures how much each emotion deviates from your personal emotional baseline.
                        It's calculated by comparing each emotion's intensity to the average of all your active
                        emotions.
                      </p>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <h5 className="font-semibold text-slate-200 mb-2">Step-by-Step Calculation:</h5>
                        <ol className="space-y-1 text-sm text-slate-300">
                          <li>1. Calculate vector magnitudes (intensity × 1.2)</li>
                          <li>2. Find average of all active emotions</li>
                          <li>3. For each emotion: |emotion - average| / (average + 0.01)</li>
                          <li>4. Higher values = more deviation = more instability</li>
                        </ol>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-semibold text-slate-200 mb-2">Curvature Ranges:</h5>
                      <div className="space-y-2">
                        <div className="bg-green-500/20 border border-green-500/30 p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-green-400">0.0 - 0.3</span>
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              Stable
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">Close to baseline, well-regulated</p>
                        </div>
                        <div className="bg-yellow-500/20 border border-yellow-500/30 p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-yellow-400">0.3 - 0.8</span>
                            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                              Moderate
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">Some deviation, manageable turbulence</p>
                        </div>
                        <div className="bg-red-500/20 border border-red-500/30 p-3 rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-red-400">0.8+</span>
                            <Badge variant="outline" className="border-red-500 text-red-400">
                              High
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">Significant deviation, emotional instability</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-400">Reading the Bar Chart</h4>
                    <div className="bg-slate-700/30 p-4 rounded-lg space-y-3">
                      <h5 className="font-semibold text-slate-200">Chart Features:</h5>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                          <span>
                            <strong>Orange Bars:</strong> Height shows curvature value
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full mt-2"></div>
                          <span>
                            <strong>X-Axis:</strong> Only shows emotions with intensity &gt; 0
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <span>
                            <strong>Y-Axis:</strong> Curvature values (0 to ~2.0 typical)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                          <span>
                            <strong>Tooltip:</strong> Hover for exact curvature values
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                      <h5 className="font-semibold text-red-400 mb-2">Critical Insight</h5>
                      <p className="text-sm text-slate-300">
                        Zero-intensity emotions don't appear because they have zero curvature by definition. The chart
                        only shows emotions that are actively contributing to your emotional state.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-400">Interpretation Guide</h4>
                    <div className="space-y-3">
                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h5 className="font-semibold text-slate-200 mb-2">What High Curvature Means:</h5>
                        <ul className="space-y-1 text-sm text-slate-300">
                          <li>• That emotion is much stronger/weaker than your average</li>
                          <li>• Indicates emotional imbalance or intensity</li>
                          <li>• May suggest need for attention or regulation</li>
                          <li>• Not necessarily "bad" - just notable deviation</li>
                        </ul>
                      </div>

                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h5 className="font-semibold text-slate-200 mb-2">Common Patterns:</h5>
                        <ul className="space-y-1 text-sm text-slate-300">
                          <li>
                            • <strong>All Low:</strong> Balanced emotional state
                          </li>
                          <li>
                            • <strong>One High:</strong> Single emotion dominates
                          </li>
                          <li>
                            • <strong>Multiple High:</strong> Emotional chaos/volatility
                          </li>
                          <li>
                            • <strong>Negative High:</strong> Distress pattern
                          </li>
                        </ul>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-400 mb-2">Action Items:</h5>
                        <ul className="space-y-1 text-sm text-slate-300">
                          <li>• Focus on emotions with highest curvature</li>
                          <li>• Consider why that emotion is so different</li>
                          <li>• Use targeted coping strategies</li>
                          <li>• Monitor changes over time</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-slate-100">Energy & Stability Metrics</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-purple-400">Emotional Energy</h4>
                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg space-y-3">
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="font-mono text-purple-400 mb-2">Energy = Σ |Eᵢ|²</p>
                        <p className="text-sm text-slate-300">Sum of squared emotion vector magnitudes</p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-semibold text-slate-200">Energy Ranges:</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-300">0 - 50</span>
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              Low
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-300">50 - 200</span>
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              Moderate
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-300">200 - 500</span>
                            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                              High
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-300">500+</span>
                            <Badge variant="outline" className="border-red-500 text-red-400">
                              Very High
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-500/10 p-3 rounded">
                        <h5 className="font-semibold text-blue-400 mb-1">What It Means:</h5>
                        <ul className="text-sm text-slate-300 space-y-1">
                          <li>• Higher energy = more intense emotional experience</li>
                          <li>• Can be positive (excitement) or negative (distress)</li>
                          <li>• Very high energy may indicate need for regulation</li>
                          <li>• Very low energy might suggest emotional numbness</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-400">Stability Index</h4>
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg space-y-3">
                      <div className="bg-slate-700/50 p-3 rounded">
                        <p className="font-mono text-green-400 mb-2">S = 1 / (max(κᵢ) + ε)</p>
                        <p className="text-sm text-slate-300">Inverse of maximum curvature</p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-semibold text-slate-200">Stability Ranges:</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-300">0.1 - 0.2</span>
                            <Badge variant="destructive">Volatile</Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-300">0.2 - 0.5</span>
                            <Badge variant="secondary">Unstable</Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-300">0.5 - 2.0</span>
                            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                              Moderate
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                            <span className="text-slate-300">2.0+</span>
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              Stable
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-500/10 p-3 rounded">
                        <h5 className="font-semibold text-amber-400 mb-1">Key Insight:</h5>
                        <p className="text-sm text-slate-300">
                          Stability is inversely related to your highest curvature. If one emotion has very high
                          curvature, your overall stability will be low, even if other emotions are balanced.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">Combined Interpretation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-blue-400 mb-2">Energy + Stability Combinations:</h5>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="p-2 bg-green-500/10 rounded">
                          <strong>High Energy + High Stability:</strong> Intense but balanced emotions
                        </div>
                        <div className="p-2 bg-yellow-500/10 rounded">
                          <strong>High Energy + Low Stability:</strong> Emotional volatility/chaos
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded">
                          <strong>Low Energy + High Stability:</strong> Calm, balanced state
                        </div>
                        <div className="p-2 bg-red-500/10 rounded">
                          <strong>Low Energy + Low Stability:</strong> Emotional numbness/disconnection
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-purple-400 mb-2">Practical Applications:</h5>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li>• Track changes over time to see patterns</li>
                        <li>• Use metrics to validate how you're feeling</li>
                        <li>• Identify when you need emotional regulation</li>
                        <li>• Set goals for improving stability</li>
                        <li>• Recognize when energy levels are concerning</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-slate-100">Real-World Examples</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(exampleScenarios).map(([key, scenario]) => (
                    <Button
                      key={key}
                      variant={activeExample === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveExample(key)}
                      className={activeExample === key ? "bg-gradient-to-r from-blue-500 to-purple-600" : ""}
                    >
                      {scenario.name}
                    </Button>
                  ))}
                </div>

                {Object.entries(exampleScenarios).map(([key, scenario]) => {
                  if (activeExample !== key) return null

                  const metrics = calculateExampleMetrics(scenario.emotions)

                  return (
                    <div key={key} className="space-y-6">
                      <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-6 rounded-lg">
                        <h4 className="text-xl font-semibold text-slate-100 mb-2">{scenario.name}</h4>
                        <p className="text-slate-300 mb-4">{scenario.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-blue-400 mb-3">Emotion Ratings:</h5>
                            <div className="space-y-2">
                              {Object.entries(scenario.emotions).map(([emotion, value]) => (
                                <div
                                  key={emotion}
                                  className="flex justify-between items-center p-2 bg-slate-700/30 rounded"
                                >
                                  <span className="text-slate-300 capitalize">{emotion}:</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                                        style={{ width: `${(value as number) * 10}%` }}
                                      />
                                    </div>
                                    <span className="text-slate-100 font-semibold w-6">{value as number}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold text-green-400 mb-3">Calculated Metrics:</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                                <span className="text-slate-300">Emotional Energy:</span>
                                <span className="text-slate-100 font-semibold">{metrics.energy.toFixed(1)}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                                <span className="text-slate-300">Stability Index:</span>
                                <span className="text-slate-100 font-semibold">{metrics.stability.toFixed(3)}</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                                <span className="text-slate-300">Max Curvature:</span>
                                <span className="text-slate-100 font-semibold">
                                  {Math.max(...metrics.curvatures).toFixed(3)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                                <span className="text-slate-300">Baseline (Mean):</span>
                                <span className="text-slate-100 font-semibold">{metrics.mean.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-slate-700/30 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-400 mb-3">Vector Analysis:</h5>
                          <div className="space-y-2 text-sm">
                            {Object.entries(scenario.emotions).map(([emotion, value], index) => {
                              if (value === 0) return null
                              return (
                                <div
                                  key={emotion}
                                  className="flex justify-between items-center p-2 bg-slate-600/30 rounded"
                                >
                                  <span className="text-slate-300 capitalize">{emotion}:</span>
                                  <div className="text-right">
                                    <div className="text-slate-100">{metrics.vectors[index].toFixed(2)} magnitude</div>
                                    <div className="text-xs text-slate-400">
                                      {metrics.curvatures[index].toFixed(3)} curvature
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <div className="bg-slate-700/30 p-4 rounded-lg">
                          <h5 className="font-semibold text-amber-400 mb-3">Key Insights:</h5>
                          <ul className="space-y-2 text-sm text-slate-300">
                            {scenario.insights.map((insight, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-400 mb-2">What This Would Look Like in Charts:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                          <div>
                            <strong>Radar Chart:</strong> Would show{" "}
                            {Object.entries(scenario.emotions).filter(([_, v]) => v > 0).length} active emotions with{" "}
                            {Object.entries(scenario.emotions).reduce((max, [_, v]) => Math.max(max, v as number), 0) >
                            7
                              ? "sharp spikes"
                              : "moderate peaks"}
                          </div>
                          <div>
                            <strong>Curvature Chart:</strong>{" "}
                            {Math.max(...metrics.curvatures) > 0.8
                              ? "High bars indicating instability"
                              : Math.max(...metrics.curvatures) > 0.3
                                ? "Moderate bars showing some deviation"
                                : "Low bars indicating stability"}
                          </div>
                          <div>
                            <strong>Energy Bar:</strong>{" "}
                            {metrics.energy > 200
                              ? "Long bar (high energy)"
                              : metrics.energy > 50
                                ? "Medium bar (moderate energy)"
                                : "Short bar (low energy)"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Close Detailed Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
