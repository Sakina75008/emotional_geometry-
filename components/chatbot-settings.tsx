"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Brain, Heart, Target, User } from "lucide-react"

interface ResponseStyle {
  warmth: number
  directness: number
  optimism: number
  formality: number
  sarcasmFilter: boolean
  personalityType: "therapist" | "friend" | "coach" | "mentor"
}

interface ChatbotSettingsProps {
  responseStyle: ResponseStyle
  setResponseStyle: (style: ResponseStyle) => void
  emotionHistory: any[]
}

export function ChatbotSettings({ responseStyle, setResponseStyle, emotionHistory }: ChatbotSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateStyle = (key: keyof ResponseStyle, value: any) => {
    setResponseStyle({ ...responseStyle, [key]: value })
  }

  const personalityIcons = {
    therapist: Brain,
    friend: Heart,
    coach: Target,
    mentor: User,
  }

  const PersonalityIcon = personalityIcons[responseStyle.personalityType]

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="border-slate-600 hover:bg-slate-800"
      >
        <Settings className="h-4 w-4 mr-2" />
        AI Personality
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 z-50 bg-slate-800/95 backdrop-blur-xl border-slate-700 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <PersonalityIcon className="h-5 w-5" />
              AI Response Style
            </CardTitle>
            <CardDescription className="text-slate-400">
              Customize how your AI companion communicates with you
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Personality Type */}
            <div className="space-y-2">
              <Label className="text-slate-200">Personality Type</Label>
              <Select
                value={responseStyle.personalityType}
                onValueChange={(value) => updateStyle("personalityType", value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="therapist">🧠 Therapist - Professional & Evidence-based</SelectItem>
                  <SelectItem value="friend">💙 Friend - Caring & Understanding</SelectItem>
                  <SelectItem value="coach">🎯 Coach - Motivational & Action-oriented</SelectItem>
                  <SelectItem value="mentor">👤 Mentor - Wise & Guiding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Warmth */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-slate-200">Warmth Level</Label>
                <span className="text-sm text-slate-400">{responseStyle.warmth}/10</span>
              </div>
              <Slider
                value={[responseStyle.warmth]}
                onValueChange={(value) => updateStyle("warmth", value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Clinical</span>
                <span>Very Warm</span>
              </div>
            </div>

            {/* Directness */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-slate-200">Directness</Label>
                <span className="text-sm text-slate-400">{responseStyle.directness}/10</span>
              </div>
              <Slider
                value={[responseStyle.directness]}
                onValueChange={(value) => updateStyle("directness", value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Gentle Suggestions</span>
                <span>Direct Advice</span>
              </div>
            </div>

            {/* Optimism */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-slate-200">Optimism</Label>
                <span className="text-sm text-slate-400">{responseStyle.optimism}/10</span>
              </div>
              <Slider
                value={[responseStyle.optimism]}
                onValueChange={(value) => updateStyle("optimism", value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Realistic</span>
                <span>Very Hopeful</span>
              </div>
            </div>

            {/* Sarcasm Filter */}
            <div className="flex items-center justify-between">
              <Label className="text-slate-200">Sarcasm Filter</Label>
              <Switch
                checked={responseStyle.sarcasmFilter}
                onCheckedChange={(checked) => updateStyle("sarcasmFilter", checked)}
              />
            </div>

            {/* Emotional Trends Summary */}
            {emotionHistory.length > 0 && (
              <div className="pt-4 border-t border-slate-700">
                <Label className="text-slate-200 mb-2 block">Recent Emotional Trends</Label>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Sessions tracked: {emotionHistory.length}</div>
                  <div>
                    Most frequent emotion:{" "}
                    {emotionHistory.length > 0
                      ? emotionHistory[emotionHistory.length - 1]?.dominantEmotion || "Unknown"
                      : "None"}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Apply Settings
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
