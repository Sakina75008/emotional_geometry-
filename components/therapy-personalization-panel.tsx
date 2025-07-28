"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Shield, Heart, Brain } from "lucide-react"

interface TherapySettings {
  empathyLevel: "soft" | "balanced" | "clinical"
  sarcasmFilter: "none" | "moderate" | "strict"
  toneStyle: "warm" | "professional" | "blunt"
  copingMethod: "cbt" | "dbt" | "existential" | "somatic"
  crisisThreshold: number
  safeWords: string[]
  emergencyContact: string
  visualAnchors: string[]
}

interface TherapyPersonalizationPanelProps {
  settings: TherapySettings
  onSettingsChange: (settings: TherapySettings) => void
  onClose: () => void
}

export function TherapyPersonalizationPanel({ settings, onSettingsChange, onClose }: TherapyPersonalizationPanelProps) {
  const updateSetting = <K extends keyof TherapySettings>(key: K, value: TherapySettings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const addSafeWord = (word: string) => {
    if (word.trim() && !settings.safeWords.includes(word.trim())) {
      updateSetting("safeWords", [...settings.safeWords, word.trim()])
    }
  }

  const removeSafeWord = (word: string) => {
    updateSetting(
      "safeWords",
      settings.safeWords.filter((w) => w !== word),
    )
  }

  const addVisualAnchor = (anchor: string) => {
    if (anchor.trim() && !settings.visualAnchors.includes(anchor.trim())) {
      updateSetting("visualAnchors", [...settings.visualAnchors, anchor.trim()])
    }
  }

  const removeVisualAnchor = (anchor: string) => {
    updateSetting(
      "visualAnchors",
      settings.visualAnchors.filter((a) => a !== anchor),
    )
  }

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-10 overflow-y-auto">
      <Card className="m-4 bg-slate-800/90 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Brain className="h-5 w-5" />
              Therapy Personalization
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-slate-400">
            Customize your therapeutic experience and crisis support settings
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Empathy Level */}
          <div className="space-y-3">
            <Label className="text-slate-200 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Empathy Level
            </Label>
            <Select
              value={settings.empathyLevel}
              onValueChange={(value) => updateSetting("empathyLevel", value as any)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="soft">💙 Soft - Gentle, nurturing approach</SelectItem>
                <SelectItem value="balanced">⚖️ Balanced - Professional with warmth</SelectItem>
                <SelectItem value="clinical">🏥 Clinical - Direct, evidence-based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tone Style */}
          <div className="space-y-3">
            <Label className="text-slate-200">Communication Tone</Label>
            <Select value={settings.toneStyle} onValueChange={(value) => updateSetting("toneStyle", value as any)}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="warm">🌟 Warm - Comforting and supportive</SelectItem>
                <SelectItem value="professional">👔 Professional - Structured and clear</SelectItem>
                <SelectItem value="blunt">⚡ Blunt - Direct and straightforward</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Coping Method */}
          <div className="space-y-3">
            <Label className="text-slate-200">Preferred Therapy Approach</Label>
            <Select
              value={settings.copingMethod}
              onValueChange={(value) => updateSetting("copingMethod", value as any)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="cbt">🧠 CBT - Cognitive Behavioral Therapy</SelectItem>
                <SelectItem value="dbt">💎 DBT - Dialectical Behavior Therapy</SelectItem>
                <SelectItem value="existential">🌌 Existential - Meaning-focused therapy</SelectItem>
                <SelectItem value="somatic">🫀 Somatic - Body-based healing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sarcasm Filter */}
          <div className="space-y-3">
            <Label className="text-slate-200">Sarcasm Filter</Label>
            <Select
              value={settings.sarcasmFilter}
              onValueChange={(value) => updateSetting("sarcasmFilter", value as any)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="none">🚫 None - Allow all communication styles</SelectItem>
                <SelectItem value="moderate">⚠️ Moderate - Filter obvious sarcasm</SelectItem>
                <SelectItem value="strict">🛡️ Strict - No sarcasm or irony</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Crisis Threshold */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label className="text-slate-200 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Crisis Alert Threshold
              </Label>
              <span className="text-sm text-slate-400">{settings.crisisThreshold}/100</span>
            </div>
            <Slider
              value={[settings.crisisThreshold]}
              onValueChange={(value) => updateSetting("crisisThreshold", value[0])}
              max={50}
              min={10}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Very Sensitive (10)</span>
              <span>Less Sensitive (50)</span>
            </div>
          </div>

          {/* Safe Words */}
          <div className="space-y-3">
            <Label className="text-slate-200">Safe Words</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {settings.safeWords.map((word) => (
                <Badge
                  key={word}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-500/20"
                  onClick={() => removeSafeWord(word)}
                >
                  {word} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add a safe word (press Enter)"
              className="bg-slate-700 border-slate-600 text-slate-100"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addSafeWord((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ""
                }
              }}
            />
          </div>

          {/* Visual Anchors */}
          <div className="space-y-3">
            <Label className="text-slate-200">Visual Anchors (Calming Images)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {settings.visualAnchors.map((anchor) => (
                <Badge
                  key={anchor}
                  variant="outline"
                  className="cursor-pointer hover:bg-red-500/20"
                  onClick={() => removeVisualAnchor(anchor)}
                >
                  {anchor} ×
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add a visual anchor (press Enter)"
              className="bg-slate-700 border-slate-600 text-slate-100"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addVisualAnchor((e.target as HTMLInputElement).value)
                  ;(e.target as HTMLInputElement).value = ""
                }
              }}
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3">
            <Label className="text-slate-200">Emergency Contact</Label>
            <Input
              value={settings.emergencyContact}
              onChange={(e) => updateSetting("emergencyContact", e.target.value)}
              placeholder="Phone number or contact info"
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
