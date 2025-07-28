"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { EmotionData } from "@/app/page"

interface EmotionInputsProps {
  emotions: EmotionData
  setEmotions: (emotions: EmotionData) => void
}

const emotionConfig = [
  { key: "joy", label: "Joy", color: "from-yellow-400 to-orange-500", emoji: "😊", textColor: "text-yellow-400" },
  { key: "sadness", label: "Sadness", color: "from-blue-400 to-blue-600", emoji: "😢", textColor: "text-blue-400" },
  { key: "anger", label: "Anger", color: "from-red-400 to-red-600", emoji: "😠", textColor: "text-red-400" },
  { key: "fear", label: "Fear", color: "from-purple-400 to-purple-600", emoji: "😨", textColor: "text-purple-400" },
  {
    key: "surprise",
    label: "Surprise",
    color: "from-orange-400 to-pink-500",
    emoji: "😲",
    textColor: "text-orange-400",
  },
  { key: "disgust", label: "Disgust", color: "from-green-400 to-green-600", emoji: "🤢", textColor: "text-green-400" },
]

export function EmotionInputs({ emotions, setEmotions }: EmotionInputsProps) {
  const updateEmotion = (key: keyof EmotionData, value: number) => {
    setEmotions({ ...emotions, [key]: value })
  }

  return (
    <div className="space-y-6">
      {emotionConfig.map(({ key, label, color, emoji, textColor }) => (
        <div key={key} className="space-y-3 group">
          <div className="flex items-center justify-between">
            <Label
              className={`flex items-center gap-3 ${textColor} transition-all duration-300 group-hover:scale-105 font-medium`}
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{emoji}</span>
              {label}
            </Label>
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
                emotions[key as keyof EmotionData] > 0
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {emotions[key as keyof EmotionData]}
            </div>
          </div>

          <div className="relative">
            <Slider
              value={[emotions[key as keyof EmotionData]]}
              onValueChange={(value) => updateEmotion(key as keyof EmotionData, value[0])}
              max={10}
              min={0}
              step={1}
              className="w-full transition-all duration-300 hover:scale-[1.02]"
            />

            {/* Gradient overlay for active emotions */}
            {emotions[key as keyof EmotionData] > 0 && (
              <div
                className={`absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r ${color} rounded-full opacity-60 transition-all duration-500 shadow-lg`}
                style={{ width: `${(emotions[key as keyof EmotionData] / 10) * 100}%` }}
              />
            )}
          </div>

          {/* Intensity indicator */}
          <div className="flex justify-between text-xs text-slate-500">
            <span>None</span>
            <span className={emotions[key as keyof EmotionData] >= 8 ? "text-red-400 font-bold" : ""}>
              {emotions[key as keyof EmotionData] >= 8 ? "Critical" : "Intense"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
