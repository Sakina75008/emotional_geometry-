import type { EmotionData, BiometricData } from "@/app/page"

export function computeEmotionVectors(emotions: EmotionData): number[] {
  const k = 1.2 // Scaling factor
  return Object.values(emotions).map((intensity) => intensity * k)
}

export function calculateCurvature(emotionVectors: number[]): number[] {
  const epsilon = 0.01
  const activeVectors = emotionVectors.filter((v) => v > 0)

  if (activeVectors.length === 0) {
    return emotionVectors.map(() => 0)
  }

  const mean = activeVectors.reduce((sum, v) => sum + v, 0) / activeVectors.length

  return emotionVectors.map((vector) => {
    if (vector === 0) return 0 // No curvature for zero-intensity emotions
    return Math.abs(vector - mean) / (mean + epsilon)
  })
}

export function calculateEmotionalEnergy(emotionVectors: number[]): number {
  return emotionVectors.reduce((sum, vector) => sum + Math.pow(vector, 2), 0)
}

export function calculateStabilityIndex(curvatures: number[]): number {
  const epsilon = 0.01
  const maxCurvature = Math.max(...curvatures)
  return 1 / (maxCurvature + epsilon)
}

export function diagnoseState(
  emotions: EmotionData,
  biometrics: BiometricData,
  emotionVectors: number[],
  curvatures: number[],
  stabilityIndex: number,
) {
  const emotionLabels = ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Disgust"]

  // Find dominant emotion
  const maxVectorIndex = emotionVectors.indexOf(Math.max(...emotionVectors))
  const dominantEmotion = emotionLabels[maxVectorIndex]

  // Find dominant curvature (only from active emotions)
  const activeCurvatures = curvatures
    .map((curvature, index) => ({ curvature, index }))
    .filter((item) => emotionVectors[item.index] > 0)

  const dominantCurvature =
    activeCurvatures.length > 0
      ? emotionLabels[
          activeCurvatures.reduce((max, current) => (current.curvature > max.curvature ? current : max)).index
        ]
      : "None"

  // Enhanced classification system considering negative emotion dominance
  let classification = "Stable"

  // Check if majority of emotions are negative
  const negativeEmotions = [emotions.sadness, emotions.fear, emotions.anger, emotions.disgust]
  const positiveEmotions = [emotions.joy, emotions.surprise]

  const totalNegativeIntensity = negativeEmotions.reduce((sum, emotion) => sum + emotion, 0)
  const totalPositiveIntensity = positiveEmotions.reduce((sum, emotion) => sum + emotion, 0)
  const totalEmotionalIntensity = totalNegativeIntensity + totalPositiveIntensity

  // Count how many negative emotions are elevated
  const elevatedNegativeEmotions = negativeEmotions.filter((emotion) => emotion >= 4).length
  const criticalNegativeEmotions = negativeEmotions.filter((emotion) => emotion >= 8).length
  const highNegativeEmotions = negativeEmotions.filter((emotion) => emotion >= 6).length

  // Classification logic
  if (criticalNegativeEmotions > 0) {
    classification = "Volatile"
  } else if (highNegativeEmotions > 0 || stabilityIndex < 0.2) {
    classification = "Volatile"
  } else if (
    // Majority negative emotions present
    (totalEmotionalIntensity > 0 && totalNegativeIntensity / totalEmotionalIntensity > 0.6) ||
    elevatedNegativeEmotions >= 2 ||
    stabilityIndex < 0.5
  ) {
    classification = "Unstable"
  }

  // Biometric flags
  const biometricFlags: string[] = []

  if (biometrics.heartRate > 90) {
    biometricFlags.push("Elevated Heart Rate")
  }

  if (biometrics.voicePitchVariance > 60) {
    biometricFlags.push("High Emotional Volatility")
  }

  if (biometrics.breathRate < 10 || biometrics.breathRate > 20) {
    biometricFlags.push("Physiological Dysregulation")
  }

  if (biometrics.skinConductance > 70) {
    biometricFlags.push("High Stress Response")
  }

  return {
    dominantEmotion,
    dominantCurvature,
    classification,
    biometricFlags,
  }
}
