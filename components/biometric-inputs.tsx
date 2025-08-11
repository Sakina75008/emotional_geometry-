"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { BiometricData } from "@/app/page"
import { Heart, Zap, Mic, Wind } from "lucide-react"

interface BiometricInputsProps {
  biometrics: BiometricData
  setBiometrics: (biometrics: BiometricData) => void
}

const biometricConfig = [
  {
    key: "heartRate",
    label: "Heart Rate (BPM)",
    icon: Heart,
    min: 40,
    max: 200,
    color: "text-red-500",
  },
  {
    key: "skinConductance",
    label: "Skin Conductance",
    icon: Zap,
    min: 0,
    max: 100,
    color: "text-blue-500",
  },
  {
    key: "voicePitchVariance",
    label: "Voice Pitch Variance",
    icon: Mic,
    min: 0,
    max: 100,
    color: "text-green-500",
  },
  {
    key: "breathRate",
    label: "Breath Rate (breaths/min)",
    icon: Wind,
    min: 5,
    max: 40,
    color: "text-purple-500",
  },
]

export function BiometricInputs({ biometrics, setBiometrics }: BiometricInputsProps) {
  const updateBiometric = (key: keyof BiometricData, value: number) => {
    setBiometrics({ ...biometrics, [key]: value })
  }

  return (
    <div className="space-y-6">
      {biometricConfig.map(({ key, label, icon: Icon, min, max, color }) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className={`flex items-center gap-2 ${color}`}>
              <Icon className="h-4 w-4" />
              {label}
            </Label>
            <span className="text-sm font-mono bg-slate-700/50 dark:bg-slate-700/70 px-2 py-1 rounded border border-slate-600/30 text-white">
              {biometrics[key as keyof BiometricData]}
            </span>
          </div>
          <Slider
            value={[biometrics[key as keyof BiometricData]]}
            onValueChange={(value) => updateBiometric(key as keyof BiometricData, value[0])}
            max={max}
            min={min}
            step={1}
            className="w-full text-purple-900"
          />
        </div>
      ))}
    </div>
  )
}
