"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Settings, Heart, Brain, Zap, User } from "lucide-react"

interface ResponseStyle {
  warmth: number
  directness: number
  optimism: number
  formality: number
  sarcasmFilter: boolean
  personalityType: "therapist" | "friend" | "coach" | "mentor"
}

interface EmotionTrend {
  timestamp: number
  emotions: Record<string, number>
  dominantEmotion: string
  stabilityIndex: number
}

interface ChatbotSettingsProps {
  responseStyle?: ResponseStyle
  setResponseStyle?: (style: ResponseStyle) => void
  emotionHistory?: EmotionTrend[]
  onClose?: () => void
}

export function ChatbotSettings({
  responseStyle = {
    warmth: 8,
    directness: 5,
    optimism: 6,
    formality: 3,
    sarcasmFilter: true,
    personalityType: "therapist",
  },
  setResponseStyle = () => {},
  emotionHistory = [],
  onClose = () => {},
}: ChatbotSettingsProps) {
  const [localStyle, setLocalStyle] = useState<ResponseStyle>(responseStyle)

  const handleStyleChange = (key: keyof ResponseStyle, value: any) => {
    const newStyle = { ...localStyle, [key]: value }
    setLocalStyle(newStyle)
    setResponseStyle(newStyle)
  }

  const getPersonalityIcon = (type: string) => {
    switch (type) {
      case "therapist":
        return <Brain className="h-4 w-4" />
      case "friend":
        return <Heart className="h-4 w-4" />
      case "coach":
        return <Zap className="h-4 w-4" />
      case "mentor":
        return <User className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getPersonalityDescription = (type: string) => {
    switch (type) {
      case "therapist":
        return "Professional, evidence-based approach with therapeutic techniques"
      case "friend":
        return "Warm, casual, and supportive like a caring friend"
      case "coach":
        return "Motivational, goal-oriented, and action-focused"
      case "mentor":
        return "Wise, experienced guidance with teaching moments"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full bg-slate-800/90 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chatbot Personality
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personality Type */}
        <div className="space-y-3">
          <Label className="text-slate-200 font-medium">Personality Type</Label>
          <Select
            value={localStyle.personalityType}
            onValueChange={(value) => handleStyleChange("personalityType", value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="therapist" className="text-slate-200">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Therapist
                </div>
              </SelectItem>
              <SelectItem value="friend" className="text-slate-200">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Friend
                </div>
              </SelectItem>
              <SelectItem value="coach" className="text-slate-200">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Coach
                </div>
              </SelectItem>
              <SelectItem value="mentor" className="text-slate-200">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Mentor
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-400">{getPersonalityDescription(localStyle.personalityType)}</p>
        </div>

        {/* Warmth Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-200 font-medium">Warmth Level</Label>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {localStyle.warmth}/10
            </Badge>
          </div>
          <Slider
            value={[localStyle.warmth]}
            onValueChange={(value) => handleStyleChange("warmth", value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Clinical</span>
            <span>Balanced</span>
            <span>Very Warm</span>
          </div>
        </div>

        {/* Directness Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-200 font-medium">Directness</Label>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {localStyle.directness}/10
            </Badge>
          </div>
          <Slider
            value={[localStyle.directness]}
            onValueChange={(value) => handleStyleChange("directness", value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Gentle</span>
            <span>Balanced</span>
            <span>Direct</span>
          </div>
        </div>

        {/* Optimism Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-200 font-medium">Optimism</Label>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {localStyle.optimism}/10
            </Badge>
          </div>
          <Slider
            value={[localStyle.optimism]}
            onValueChange={(value) => handleStyleChange("optimism", value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Realistic</span>
            <span>Balanced</span>
            <span>Optimistic</span>
          </div>
        </div>

        {/* Sarcasm Filter */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-slate-200 font-medium">Sarcasm Filter</Label>
            <p className="text-xs text-slate-400 mt-1">Prevents potentially misunderstood humor</p>
          </div>
          <Switch
            checked={localStyle.sarcasmFilter}
            onCheckedChange={(checked) => handleStyleChange("sarcasmFilter", checked)}
          />
        </div>

        {/* Emotion History Summary */}
        {emotionHistory.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-700">
            <Label className="text-slate-200 font-medium">Recent Emotional Patterns</Label>
            <div className="grid grid-cols-2 gap-2">
              {emotionHistory.slice(-4).map((trend, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-2">
                  <div className="text-xs text-slate-300 font-medium">{trend.dominantEmotion}</div>
                  <div className="text-xs text-slate-400">Stability: {Math.round(trend.stabilityIndex * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset to Defaults */}
        <Button
          variant="outline"
          onClick={() => {
            const defaultStyle: ResponseStyle = {
              warmth: 8,
              directness: 5,
              optimism: 6,
              formality: 3,
              sarcasmFilter: true,
              personalityType: "therapist",
            }
            setLocalStyle(defaultStyle)
            setResponseStyle(defaultStyle)
          }}
          className="w-full bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  )
}
