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

export function calculateStabilityIndex(emotions: EmotionData, biometrics: BiometricData): number {
  const emotionVectors = computeEmotionVectors(emotions)
  const curvatures = calculateCurvature(emotionVectors)
  const epsilon = 0.01
  const maxCurvature = Math.max(...curvatures)

  // Factor in biometric stability
  let biometricStability = 1.0

  // Heart rate stability (normal range: 60-100 bpm)
  if (biometrics.heartRate < 60 || biometrics.heartRate > 100) {
    biometricStability *= 0.8
  }

  // Stress level impact
  biometricStability *= Math.max(0.1, 1 - biometrics.stressLevel / 10)

  const emotionalStability = 1 / (maxCurvature + epsilon)

  return Math.min(1.0, emotionalStability * biometricStability)
}

export function calculateEmotionalGeometry(emotions: EmotionData) {
  const emotionVectors = computeEmotionVectors(emotions)
  const curvatures = calculateCurvature(emotionVectors)
  const magnitude = Math.sqrt(calculateEmotionalEnergy(emotionVectors))

  // Find dominant emotion
  const emotionLabels = ["Joy", "Sadness", "Anger", "Fear", "Surprise", "Disgust"]
  const maxVectorIndex = emotionVectors.indexOf(Math.max(...emotionVectors))
  const dominantEmotion = emotionLabels[maxVectorIndex]

  // Calculate overall curvature
  const overallCurvature = curvatures.reduce((sum, c) => sum + c, 0) / curvatures.length

  // Classification based on emotional geometry
  let classification = "Stable"
  const negativeEmotions = [emotions.sadness, emotions.fear, emotions.anger, emotions.disgust]
  const totalNegativeIntensity = negativeEmotions.reduce((sum, emotion) => sum + emotion, 0)
  const criticalNegativeEmotions = negativeEmotions.filter((emotion) => emotion >= 8).length

  if (criticalNegativeEmotions > 0 || overallCurvature > 0.8) {
    classification = "Volatile"
  } else if (totalNegativeIntensity > 20 || overallCurvature > 0.5) {
    classification = "Unstable"
  }

  return {
    dominantEmotion,
    magnitude,
    curvature: overallCurvature,
    classification,
    vectors: emotionVectors,
    curvatures,
  }
}

export function classifyMentalState(emotions: EmotionData, biometrics: BiometricData, curvature: number) {
  const negativeEmotions = [emotions.sadness, emotions.fear, emotions.anger, emotions.disgust]
  const criticalNegativeEmotions = negativeEmotions.filter((emotion) => emotion >= 8).length
  const highNegativeEmotions = negativeEmotions.filter((emotion) => emotion >= 6).length

  let stability = "stable"
  const flags: string[] = []
  const recommendations: string[] = []

  // Determine mental stability
  if (criticalNegativeEmotions > 0) {
    stability = "critical"
    flags.push("Critical emotional distress detected")
    recommendations.push("Seek immediate professional support")
    recommendations.push("Practice grounding techniques (5-4-3-2-1 method)")
  } else if (highNegativeEmotions > 0 || curvature > 0.6) {
    stability = "unstable"
    flags.push("High emotional volatility")
    recommendations.push("Consider mindfulness exercises")
    recommendations.push("Reach out to trusted friends or family")
  } else if (curvature > 0.3) {
    stability = "unstable"
    recommendations.push("Focus on stress management techniques")
    recommendations.push("Maintain regular sleep schedule")
  }

  // Biometric analysis
  if (biometrics.heartRate > 100) {
    flags.push("Elevated heart rate")
    recommendations.push("Practice deep breathing exercises")
  }

  if (biometrics.stressLevel > 7) {
    flags.push("High stress levels")
    recommendations.push("Consider relaxation techniques")
  }

  // Blood pressure analysis
  const [systolic] = biometrics.bloodPressure.split("/").map(Number)
  if (systolic > 140) {
    flags.push("Elevated blood pressure")
    recommendations.push("Monitor blood pressure regularly")
  }

  return {
    stability,
    flags,
    recommendations,
  }
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

  if (biometrics.stressLevel > 7) {
    biometricFlags.push("High Stress Response")
  }

  return {
    dominantEmotion,
    dominantCurvature,
    classification,
    biometricFlags,
  }
}
