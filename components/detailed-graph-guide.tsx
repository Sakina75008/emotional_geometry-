"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, TrendingUp, BarChart3, Lightbulb, ArrowRight, Target, Zap, Heart, Brain } from "lucide-react"

interface DetailedGraphGuideProps {
  onClose: () => void
}

export function DetailedGraphGuide({ onClose }: DetailedGraphGuideProps) {
  const [selectedExample, setSelectedExample] = useState("balanced")

  const examples = {
    balanced: {
      name: "Balanced State",
      emotions: { joy: 6, sadness: 2, anger: 1, fear: 3, surprise: 4, disgust: 1 },
      energy: 4.2,
      stability: 0.85,
      curvature: 0.23,
      description: "A healthy, stable emotional state with moderate positive emotions and low negative emotions.",
    },
    stressed: {
      name: "High Stress",
      emotions: { joy: 2, sadness: 7, anger: 6, fear: 8, surprise: 2, disgust: 4 },
      energy: 7.8,
      stability: 0.15,
      curvature: 0.89,
      description: "Elevated negative emotions with high energy and low stability, indicating acute stress.",
    },
    excited: {
      name: "Excited/Manic",
      emotions: { joy: 9, sadness: 1, anger: 2, fear: 1, surprise: 8, disgust: 0 },
      energy: 8.9,
      stability: 0.45,
      curvature: 0.67,
      description:
        "Very high positive emotions with elevated energy, potentially indicating mania or extreme excitement.",
    },
    depressed: {
      name: "Depressive Episode",
      emotions: { joy: 1, sadness: 9, anger: 3, fear: 6, surprise: 0, disgust: 5 },
      energy: 2.1,
      stability: 0.25,
      curvature: 0.78,
      description: "Dominant sadness with very low energy and poor stability, characteristic of depression.",
    },
  }

  const currentExample = examples[selectedExample as keyof typeof examples]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Complete Graph Reading Guide</h2>
            <p className="text-slate-400">Master the art of emotional geometry interpretation</p>
          </div>
        </div>
        <Button variant="outline" onClick={onClose} className="border-slate-600 bg-transparent">
          Close Guide
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
            <Brain className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="radar" className="data-[state=active]:bg-purple-600">
            <Target className="h-4 w-4 mr-2" />
            Radar Chart
          </TabsTrigger>
          <TabsTrigger value="curvature" className="data-[state=active]:bg-orange-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Curvature
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-green-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="examples" className="data-[state=active]:bg-pink-600">
            <Lightbulb className="h-4 w-4 mr-2" />
            Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Brain className="h-5 w-5 text-blue-400" />
                Mathematical Foundation
              </CardTitle>
              <CardDescription className="text-slate-400">
                Understanding the core mathematics behind emotional geometry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Emotion Vectors</h3>
                  <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                    <p className="text-sm text-slate-300 mb-2">Each emotion is converted to a vector magnitude:</p>
                    <code className="text-blue-400 text-sm">V(emotion) = √(intensity² + baseline²)</code>
                    <p className="text-xs text-slate-400 mt-2">
                      Where intensity is your 0-10 rating and baseline represents emotional stability
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Curvature Calculation</h3>
                  <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                    <p className="text-sm text-slate-300 mb-2">Emotional curvature measures rate of change:</p>
                    <code className="text-purple-400 text-sm">κ = |V''(t)| / (1 + V'(t)²)^(3/2)</code>
                    <p className="text-xs text-slate-400 mt-2">
                      Higher curvature indicates more volatile emotional transitions
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Energy Formula</h3>
                  <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                    <p className="text-sm text-slate-300 mb-2">Total emotional energy:</p>
                    <code className="text-orange-400 text-sm">E = Σ(V(emotion) × weight)</code>
                    <p className="text-xs text-slate-400 mt-2">
                      Weighted sum of all emotion vectors, normalized to 0-10 scale
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Stability Index</h3>
                  <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                    <p className="text-sm text-slate-300 mb-2">Emotional stability measure:</p>
                    <code className="text-green-400 text-sm">S = 1 - (σ(curvatures) / max_curvature)</code>
                    <p className="text-xs text-slate-400 mt-2">
                      Based on curvature variance; higher values indicate more stability
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-lg border border-blue-800/30">
                <h4 className="font-semibold text-blue-300 mb-2">Key Concepts</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Vector Magnitude:</strong> Represents the "strength" of each emotion in multidimensional
                      space
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Curvature:</strong> Measures how quickly emotions change direction (volatility)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Energy:</strong> Total emotional activation across all dimensions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Stability:</strong> Consistency and predictability of emotional patterns
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-6 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Target className="h-5 w-5 text-purple-400" />
                Radar Chart Deep Dive
              </CardTitle>
              <CardDescription className="text-slate-400">
                Understanding the emotional radar visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Reading the Radar</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-slate-200">Joy (Yellow)</p>
                        <p className="text-sm text-slate-400">Positive emotions, happiness, contentment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-400 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-slate-200">Sadness (Blue)</p>
                        <p className="text-sm text-slate-400">Grief, melancholy, disappointment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-slate-200">Anger (Red)</p>
                        <p className="text-sm text-slate-400">Frustration, irritation, rage</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-400 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-slate-200">Fear (Purple)</p>
                        <p className="text-sm text-slate-400">Anxiety, worry, apprehension</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-400 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-slate-200">Surprise (Green)</p>
                        <p className="text-sm text-slate-400">Astonishment, wonder, shock</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 rounded-full bg-violet-400 mt-1.5"></div>
                      <div>
                        <p className="font-medium text-slate-200">Disgust (Violet)</p>
                        <p className="text-sm text-slate-400">Revulsion, aversion, distaste</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Shape Interpretation</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Circular/Balanced</h4>
                      <p className="text-sm text-slate-400">
                        Even distribution suggests emotional balance and stability. No single emotion dominates.
                      </p>
                    </div>
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Spiked/Pointed</h4>
                      <p className="text-sm text-slate-400">
                        Sharp peaks indicate intense emotions. The direction shows which emotions are dominant.
                      </p>
                    </div>
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Compressed/Small</h4>
                      <p className="text-sm text-slate-400">
                        Small overall shape suggests emotional numbness or suppression across all dimensions.
                      </p>
                    </div>
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Asymmetrical</h4>
                      <p className="text-sm text-slate-400">
                        Uneven shapes indicate emotional imbalance, with some emotions significantly stronger than
                        others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 rounded-lg border border-purple-800/30">
                <h4 className="font-semibold text-purple-300 mb-3">Pro Reading Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                  <div>
                    <p className="font-medium mb-1">Area Analysis:</p>
                    <p>Larger total area = higher overall emotional intensity</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Symmetry Check:</p>
                    <p>Symmetrical shapes suggest emotional regulation</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Peak Counting:</p>
                    <p>Multiple peaks = complex emotional state</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Center Distance:</p>
                    <p>Points far from center = intense specific emotions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curvature" className="space-y-6 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <TrendingUp className="h-5 w-5 text-orange-400" />
                Curvature Analysis
              </CardTitle>
              <CardDescription className="text-slate-400">
                Understanding emotional volatility through curvature mathematics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Curvature Ranges</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-green-400"></div>
                      <div className="flex-1">
                        <p className="font-medium text-green-300">Low (0.0 - 0.3)</p>
                        <p className="text-sm text-slate-400">Stable, gradual emotional changes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                      <div className="flex-1">
                        <p className="font-medium text-yellow-300">Moderate (0.3 - 0.6)</p>
                        <p className="text-sm text-slate-400">Normal emotional fluctuations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-900/20 border border-orange-800/30 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-orange-400"></div>
                      <div className="flex-1">
                        <p className="font-medium text-orange-300">High (0.6 - 0.8)</p>
                        <p className="text-sm text-slate-400">Significant emotional volatility</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-red-400"></div>
                      <div className="flex-1">
                        <p className="font-medium text-red-300">Critical (0.8 - 1.0)</p>
                        <p className="text-sm text-slate-400">Extreme emotional instability</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">What Curvature Tells Us</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Emotional Transitions</h4>
                      <p className="text-sm text-slate-400">
                        High curvature indicates rapid emotional shifts - like going from joy to sadness quickly.
                      </p>
                    </div>
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Predictability</h4>
                      <p className="text-sm text-slate-400">
                        Low curvature suggests predictable emotional patterns, while high curvature indicates chaos.
                      </p>
                    </div>
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Regulation Ability</h4>
                      <p className="text-sm text-slate-400">
                        Consistent low curvature shows good emotional regulation skills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                <h4 className="font-medium text-slate-200 mb-3">Mathematical Insight</h4>
                <p className="text-sm text-slate-400 mb-3">
                  The curvature formula κ = |V''(t)| / (1 + V'(t)²)^(3/2) measures how much the emotional "path" bends
                  at each point. Think of it like driving on a road:
                </p>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• Straight road = low curvature = stable emotions</li>
                  <li>• Winding road = high curvature = volatile emotions</li>
                  <li>• Sharp turns = curvature spikes = emotional crises</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Energy & Stability Metrics
              </CardTitle>
              <CardDescription className="text-slate-400">
                Understanding the key numerical indicators of emotional state
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Emotional Energy
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Energy Scale (0-10)</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">0-2: Very Low</span>
                          <Badge variant="secondary" className="bg-gray-700">
                            Lethargy
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">3-4: Low</span>
                          <Badge variant="secondary" className="bg-blue-700">
                            Calm
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">5-6: Moderate</span>
                          <Badge variant="secondary" className="bg-green-700">
                            Balanced
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">7-8: High</span>
                          <Badge variant="secondary" className="bg-orange-700">
                            Energetic
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">9-10: Very High</span>
                          <Badge variant="secondary" className="bg-red-700">
                            Intense
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-800/30">
                      <p className="text-sm text-slate-300">
                        <strong>Energy Interpretation:</strong> High energy isn't always positive - it could indicate
                        anxiety or mania. Low energy might suggest depression or fatigue.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-400" />
                    Stability Index
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="font-medium text-slate-200 mb-2">Stability Scale (0-1)</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">0.0-0.2: Critical</span>
                          <Badge variant="destructive">Crisis</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">0.2-0.4: Poor</span>
                          <Badge variant="secondary" className="bg-red-700">
                            Unstable
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">0.4-0.6: Fair</span>
                          <Badge variant="secondary" className="bg-yellow-700">
                            Variable
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">0.6-0.8: Good</span>
                          <Badge variant="secondary" className="bg-green-700">
                            Stable
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">0.8-1.0: Excellent</span>
                          <Badge variant="secondary" className="bg-blue-700">
                            Very Stable
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-pink-900/20 p-4 rounded-lg border border-pink-800/30">
                      <p className="text-sm text-slate-300">
                        <strong>Stability Factors:</strong> Based on curvature variance. Higher stability means more
                        predictable emotional patterns and better regulation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6 rounded-lg border border-green-800/30">
                <h4 className="font-semibold text-green-300 mb-4">Combined Interpretation Matrix</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <p className="font-medium text-slate-200 mb-1">High Energy + High Stability</p>
                    <p className="text-slate-400">Optimal state: energetic but controlled</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <p className="font-medium text-slate-200 mb-1">High Energy + Low Stability</p>
                    <p className="text-slate-400">Manic/anxious: intense but chaotic</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <p className="font-medium text-slate-200 mb-1">Low Energy + High Stability</p>
                    <p className="text-slate-400">Calm state: peaceful and controlled</p>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    <p className="font-medium text-slate-200 mb-1">Low Energy + Low Stability</p>
                    <p className="text-slate-400">Concerning: depressed and unstable</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Lightbulb className="h-5 w-5 text-pink-400" />
                Real-World Examples
              </CardTitle>
              <CardDescription className="text-slate-400">
                Interactive examples showing different emotional states and their interpretations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(examples).map(([key, example]) => (
                  <Button
                    key={key}
                    variant={selectedExample === key ? "default" : "outline"}
                    onClick={() => setSelectedExample(key)}
                    className={
                      selectedExample === key ? "bg-gradient-to-r from-pink-500 to-purple-600" : "border-slate-600"
                    }
                  >
                    {example.name}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">{currentExample.name}</h3>
                  <p className="text-slate-400">{currentExample.description}</p>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-medium text-slate-200 mb-3">Emotion Breakdown</h4>
                    <div className="space-y-2">
                      {Object.entries(currentExample.emotions).map(([emotion, value]) => (
                        <div key={emotion} className="flex items-center justify-between">
                          <span className="text-sm text-slate-300 capitalize">{emotion}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                                style={{ width: `${(value / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-400 w-6">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-medium text-slate-200 mb-2">Energy Level</h4>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-lg font-bold text-slate-200">{currentExample.energy}</span>
                        <span className="text-sm text-slate-400">/10</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-medium text-slate-200 mb-2">Stability</h4>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-400" />
                        <span className="text-lg font-bold text-slate-200">{currentExample.stability}</span>
                        <span className="text-sm text-slate-400">/1.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">Analysis & Insights</h3>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-medium text-slate-200 mb-2">Curvature Analysis</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-orange-400" />
                      <span className="text-lg font-bold text-slate-200">{currentExample.curvature}</span>
                      <Badge
                        variant="secondary"
                        className={
                          currentExample.curvature < 0.3
                            ? "bg-green-700"
                            : currentExample.curvature < 0.6
                              ? "bg-yellow-700"
                              : currentExample.curvature < 0.8
                                ? "bg-orange-700"
                                : "bg-red-700"
                        }
                      >
                        {currentExample.curvature < 0.3
                          ? "Stable"
                          : currentExample.curvature < 0.6
                            ? "Moderate"
                            : currentExample.curvature < 0.8
                              ? "High"
                              : "Critical"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {currentExample.curvature < 0.3
                        ? "Low volatility, predictable emotional patterns"
                        : currentExample.curvature < 0.6
                          ? "Normal emotional fluctuations"
                          : currentExample.curvature < 0.8
                            ? "Significant emotional volatility, may need support"
                            : "Extreme instability, professional help recommended"}
                    </p>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-medium text-slate-200 mb-3">Recommendations</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {selectedExample === "balanced" && (
                        <>
                          <li>• Maintain current emotional regulation strategies</li>
                          <li>• Continue healthy lifestyle habits</li>
                          <li>• Consider helping others with emotional challenges</li>
                        </>
                      )}
                      {selectedExample === "stressed" && (
                        <>
                          <li>• Practice immediate stress reduction techniques</li>
                          <li>• Consider professional counseling support</li>
                          <li>• Focus on grounding and breathing exercises</li>
                          <li>• Identify and address stress triggers</li>
                        </>
                      )}
                      {selectedExample === "excited" && (
                        <>
                          <li>• Channel energy into productive activities</li>
                          <li>• Monitor for signs of mania if persistent</li>
                          <li>• Ensure adequate rest and sleep</li>
                          <li>• Practice mindfulness to maintain awareness</li>
                        </>
                      )}
                      {selectedExample === "depressed" && (
                        <>
                          <li>• Seek professional mental health support</li>
                          <li>• Focus on basic self-care activities</li>
                          <li>• Consider medication evaluation</li>
                          <li>• Build support network connections</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 p-4 rounded-lg border border-pink-800/30">
                    <h4 className="font-semibold text-pink-300 mb-2">Key Takeaway</h4>
                    <p className="text-sm text-slate-300">
                      {selectedExample === "balanced" &&
                        "This represents an ideal emotional state with good regulation and moderate positive emotions."}
                      {selectedExample === "stressed" &&
                        "High negative emotions with poor stability indicate need for immediate stress management."}
                      {selectedExample === "excited" &&
                        "Very high positive emotions can be wonderful but monitor for sustainability and balance."}
                      {selectedExample === "depressed" &&
                        "Dominant sadness with low energy suggests clinical depression requiring professional support."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
