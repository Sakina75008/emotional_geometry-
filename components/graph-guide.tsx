"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { X, Info, BarChart3, Activity, TrendingUp, Zap } from "lucide-react"

interface GraphGuideProps {
  onClose: () => void
}

export function GraphGuide({ onClose }: GraphGuideProps) {
  const [activeSection, setActiveSection] = useState("overview")

  const sections = [
    { id: "overview", title: "Overview", icon: Info },
    { id: "radar", title: "Emotion Radar", icon: Activity },
    { id: "curvature", title: "Curvature Chart", icon: BarChart3 },
    { id: "energy", title: "Energy & Stability", icon: Zap },
    { id: "summary", title: "Summary Cards", icon: TrendingUp },
  ]

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-10 overflow-y-auto">
      <Card className="m-4 bg-slate-800/90 border-slate-700 max-w-4xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Info className="h-5 w-5" />
              Graph Reading Guide
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-slate-400">
            Learn how to interpret your emotional geometry visualizations
          </CardDescription>
        </CardHeader>

        <CardContent className="flex gap-6">
          {/* Navigation */}
          <div className="w-48 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "text-slate-300 hover:text-slate-100"
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {section.title}
                </Button>
              )
            })}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 h-96">
            <div className="space-y-6 pr-4">
              {activeSection === "overview" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-100">Understanding Emotional Geometry</h3>
                  <div className="space-y-4 text-slate-300">
                    <p>
                      Your emotions are represented as mathematical vectors in a 6-dimensional space. Each emotion has
                      both intensity (how strong) and geometric properties (how it relates to other emotions).
                    </p>

                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-200 mb-2">Key Concepts:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Badge variant="outline" className="mr-2">
                            Vector Magnitude
                          </Badge>
                          How intense each emotion is (scaled by factor k=1.2)
                        </li>
                        <li>
                          <Badge variant="outline" className="mr-2">
                            Curvature (κ)
                          </Badge>
                          How much each emotion deviates from your emotional baseline
                        </li>
                        <li>
                          <Badge variant="outline" className="mr-2">
                            Energy
                          </Badge>
                          Total emotional intensity across all emotions
                        </li>
                        <li>
                          <Badge variant="outline" className="mr-2">
                            Stability
                          </Badge>
                          How balanced your emotional state is (higher = more stable)
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">Mathematical Foundation:</h4>
                      <p className="text-sm">
                        This system uses differential geometry principles to model emotions as vectors in space, where
                        curvature represents emotional instability and energy represents overall emotional intensity.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "radar" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-100">Emotion Vector Radar Chart</h3>
                  <div className="space-y-4 text-slate-300">
                    <p>
                      The radar chart shows your emotions as vectors radiating from the center. Only emotions with
                      intensity &gt; 0 are displayed.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-400 mb-2">Purple Line (Vector Magnitude)</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Shows scaled emotional intensity (raw × 1.2)</li>
                          <li>• Larger area = more emotional energy</li>
                          <li>• Spikes indicate dominant emotions</li>
                        </ul>
                      </div>

                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-400 mb-2">Green Line (Raw Intensity)</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Your original 0-10 ratings</li>
                          <li>• Compare with purple to see scaling effect</li>
                          <li>• Helps validate the mathematical model</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-400 mb-2">Reading Tips:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Balanced shape = emotional equilibrium</li>
                        <li>• Sharp spikes = intense, focused emotions</li>
                        <li>• Large overall area = high emotional energy</li>
                        <li>• Empty areas = emotions not currently active</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "curvature" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-100">Emotional Curvature Chart</h3>
                  <div className="space-y-4 text-slate-300">
                    <p>
                      Curvature measures how much each emotion deviates from your emotional baseline. Higher curvature =
                      more instability for that emotion.
                    </p>

                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-400 mb-2">Understanding Curvature (κ):</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Formula:</strong> κᵢ = |Eᵢ - Ē| / (Ē + ε)
                        </p>
                        <ul className="space-y-1 ml-4">
                          <li>• Eᵢ = Individual emotion vector magnitude</li>
                          <li>• Ē = Average of all active emotion vectors</li>
                          <li>• ε = Small constant (0.01) to prevent division by zero</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                        <h5 className="font-semibold text-green-400 mb-1">Low Curvature (0-0.3)</h5>
                        <p className="text-xs">Emotion is close to your baseline - stable and balanced</p>
                      </div>

                      <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                        <h5 className="font-semibold text-yellow-400 mb-1">Medium Curvature (0.3-0.8)</h5>
                        <p className="text-xs">Moderate deviation - some emotional turbulence</p>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <h5 className="font-semibold text-red-400 mb-1">High Curvature (0.8+)</h5>
                        <p className="text-xs">Significant deviation - emotional instability</p>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-400 mb-2">Important Note:</h4>
                      <p className="text-sm">
                        Only emotions with intensity &gt; 0 are shown. Zero-intensity emotions have zero curvature by
                        definition and don't contribute to instability.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "energy" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-100">Energy & Stability Metrics</h3>
                  <div className="space-y-4 text-slate-300">
                    <p>These metrics provide an overall assessment of your emotional state's intensity and balance.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-2">Emotional Energy</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Formula:</strong> Energy = Σ |Eᵢ|²
                          </p>
                          <ul className="space-y-1">
                            <li>• Sum of squared emotion vector magnitudes</li>
                            <li>• Higher values = more intense emotional state</li>
                            <li>• Range: 0 to ~1440 (theoretical max)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-400 mb-2">Stability Index</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Formula:</strong> S = 1 / (max(κᵢ) + ε)
                          </p>
                          <ul className="space-y-1">
                            <li>• Inverse of maximum curvature</li>
                            <li>• Higher values = more stable emotional state</li>
                            <li>• Range: ~0.1 to 100+</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-200">Interpretation Guidelines:</h4>

                      <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                        <h5 className="font-semibold text-blue-400 mb-1">Emotional Energy Levels:</h5>
                        <ul className="text-sm space-y-1">
                          <li>• 0-50: Low emotional activation</li>
                          <li>• 50-200: Moderate emotional engagement</li>
                          <li>• 200-500: High emotional intensity</li>
                          <li>• 500+: Very high emotional activation</li>
                        </ul>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                        <h5 className="font-semibold text-green-400 mb-1">Stability Index Levels:</h5>
                        <ul className="text-sm space-y-1">
                          <li>• 0.1-0.2: Volatile emotional state</li>
                          <li>• 0.2-0.5: Unstable emotional state</li>
                          <li>• 0.5-2.0: Moderately stable</li>
                          <li>• 2.0+: Highly stable emotional state</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "summary" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-100">Summary Cards & Classification</h3>
                  <div className="space-y-4 text-slate-300">
                    <p>The summary section provides key insights and overall classification of your emotional state.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-2">Metric Cards</h4>
                        <ul className="space-y-2 text-sm">
                          <li>
                            <Badge variant="outline" className="mr-2">
                              Dominant Emotion
                            </Badge>
                            Emotion with highest vector magnitude
                          </li>
                          <li>
                            <Badge variant="outline" className="mr-2">
                              Total Energy
                            </Badge>
                            Sum of all emotional intensities
                          </li>
                          <li>
                            <Badge variant="outline" className="mr-2">
                              Highest Curvature
                            </Badge>
                            Most unstable emotion
                          </li>
                          <li>
                            <Badge variant="outline" className="mr-2">
                              Stability Score
                            </Badge>
                            Overall emotional balance (%)
                          </li>
                        </ul>
                      </div>

                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-400 mb-2">Classification System</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>
                              <strong>Stable:</strong> Balanced emotional state
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>
                              <strong>Unstable:</strong> Some emotional turbulence
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>
                              <strong>Volatile:</strong> High emotional instability
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-400 mb-2">Enhanced Classification Logic:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>Critical:</strong> Any negative emotion ≥ 8 → Volatile
                        </li>
                        <li>
                          • <strong>High Negative:</strong> Any negative emotion ≥ 6 → Volatile
                        </li>
                        <li>
                          • <strong>Majority Negative:</strong> &gt;60% negative intensity → Unstable
                        </li>
                        <li>
                          • <strong>Multiple Elevated:</strong> 2+ negative emotions ≥ 4 → Unstable
                        </li>
                        <li>
                          • <strong>Low Stability:</strong> Stability index &lt; 0.5 → Unstable
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-slate-200 mb-2">Mental State Assessment:</h4>
                      <p className="text-sm mb-2">
                        Based specifically on negative emotions (sadness, fear, anger, disgust):
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li>
                          <Badge variant="destructive" className="mr-2">
                            Critical
                          </Badge>
                          Any negative emotion ≥ 8 (requires immediate support)
                        </li>
                        <li>
                          <Badge variant="secondary" className="mr-2">
                            Unstable
                          </Badge>
                          Any negative emotion ≥ 6 or multiple concerns
                        </li>
                        <li>
                          <Badge variant="outline" className="mr-2">
                            Stable
                          </Badge>
                          Negative emotions well-managed
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <div className="p-4 border-t border-slate-700">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Close Guide
          </Button>
        </div>
      </Card>
    </div>
  )
}
