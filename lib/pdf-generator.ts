import jsPDF from "jspdf"
import type { AnalysisResult, EmotionData } from "@/app/page"

interface BiometricData {
  heartRate: number
  bloodPressure: string
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
  stressLevel: number
}

export function generateEmotionalAnalysisPDF(
  analysis: AnalysisResult,
  emotions: EmotionData,
  biometrics: BiometricData,
) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Header with gradient effect (simulated with colors)
  doc.setFillColor(59, 130, 246) // Blue
  doc.rect(0, 0, pageWidth, 40, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("Emotional Geometry Analysis Report", pageWidth / 2, 25, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, 35, {
    align: "center",
  })

  yPosition = 60

  // Executive Summary Section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Executive Summary", 20, yPosition)
  yPosition += 15

  // Summary cards
  const summaryData = [
    {
      label: "Dominant Emotion",
      value: analysis.dominantEmotion,
      color: getDominantEmotionColor(analysis.dominantEmotion),
    },
    {
      label: "Mental Stability",
      value: analysis.mentalStability.toUpperCase(),
      color: getStabilityColor(analysis.mentalStability),
    },
    { label: "Emotional Energy", value: `${Math.round(analysis.emotionalEnergy * 100)}%`, color: [34, 197, 94] },
    { label: "Stability Index", value: `${Math.round(analysis.stabilityIndex * 100)}%`, color: [168, 85, 247] },
  ]

  const cardWidth = (pageWidth - 60) / 2
  const cardHeight = 25

  summaryData.forEach((item, index) => {
    const x = 20 + (index % 2) * (cardWidth + 20)
    const y = yPosition + Math.floor(index / 2) * (cardHeight + 10)

    // Card background
    doc.setFillColor(248, 250, 252)
    doc.rect(x, y, cardWidth, cardHeight, "F")

    // Card border
    doc.setDrawColor(226, 232, 240)
    doc.rect(x, y, cardWidth, cardHeight, "S")

    // Label
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 116, 139)
    doc.text(item.label, x + 5, y + 8)

    // Value
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(item.color[0], item.color[1], item.color[2])
    doc.text(item.value, x + 5, y + 20)
  })

  yPosition += 70

  // Emotional Profile Section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Emotional Profile", 20, yPosition)
  yPosition += 15

  // Emotion bars
  const emotionEntries = Object.entries(emotions)
  const barWidth = pageWidth - 100
  const barHeight = 8

  emotionEntries.forEach(([emotion, value], index) => {
    const y = yPosition + index * 20

    // Emotion label
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(emotion.charAt(0).toUpperCase() + emotion.slice(1), 20, y + 5)

    // Background bar
    doc.setFillColor(229, 231, 235)
    doc.rect(80, y - 2, barWidth, barHeight, "F")

    // Value bar
    const fillWidth = (value / 10) * barWidth
    const emotionColor = getEmotionColor(emotion)
    doc.setFillColor(emotionColor[0], emotionColor[1], emotionColor[2])
    doc.rect(80, y - 2, fillWidth, barHeight, "F")

    // Value text
    doc.setFontSize(10)
    doc.setTextColor(75, 85, 99)
    doc.text(`${value}/10`, 80 + barWidth + 5, y + 5)
  })

  yPosition += emotionEntries.length * 20 + 20

  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage()
    yPosition = 20
  }

  // Biometric Data Section
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("Biometric Indicators", 20, yPosition)
  yPosition += 15

  const biometricData = [
    {
      label: "Heart Rate",
      value: `${biometrics.heartRate} bpm`,
      normal: "60-100 bpm",
      status: getBiometricStatus(biometrics.heartRate, 60, 100),
    },
    { label: "Blood Pressure", value: biometrics.bloodPressure, normal: "120/80 mmHg", status: "normal" },
    {
      label: "Temperature",
      value: `${biometrics.temperature}°F`,
      normal: "97-99°F",
      status: getBiometricStatus(biometrics.temperature, 97, 99),
    },
    {
      label: "Respiratory Rate",
      value: `${biometrics.respiratoryRate} /min`,
      normal: "12-20 /min",
      status: getBiometricStatus(biometrics.respiratoryRate, 12, 20),
    },
    {
      label: "Oxygen Saturation",
      value: `${biometrics.oxygenSaturation}%`,
      normal: "95-100%",
      status: getBiometricStatus(biometrics.oxygenSaturation, 95, 100),
    },
    {
      label: "Stress Level",
      value: `${biometrics.stressLevel}/10`,
      normal: "0-3/10",
      status: biometrics.stressLevel <= 3 ? "normal" : biometrics.stressLevel <= 6 ? "elevated" : "high",
    },
  ]

  biometricData.forEach((item, index) => {
    const y = yPosition + index * 15

    // Label
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(item.label, 20, y)

    // Value
    doc.setFont("helvetica", "bold")
    doc.text(item.value, 80, y)

    // Normal range
    doc.setFont("helvetica", "normal")
    doc.setTextColor(107, 114, 128)
    doc.text(`(Normal: ${item.normal})`, 130, y)

    // Status indicator
    const statusColor =
      item.status === "normal" ? [34, 197, 94] : item.status === "elevated" ? [251, 191, 36] : [239, 68, 68]
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
    doc.setFont("helvetica", "bold")
    doc.text(item.status.toUpperCase(), pageWidth - 40, y)
  })

  yPosition += biometricData.length * 15 + 20

  // Mathematical Analysis Section
  if (yPosition > pageHeight - 80) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("Mathematical Analysis", 20, yPosition)
  yPosition += 15

  // Curvature calculation
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Emotional Curvature Calculation:", 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("κ = |d²r/dt²| / (1 + |dr/dt|²)^(3/2)", 20, yPosition)
  yPosition += 8
  doc.text(`Curvature Level: ${analysis.curvatureLevel.toFixed(3)}`, 20, yPosition)
  yPosition += 8
  doc.text(`Classification: ${analysis.classification}`, 20, yPosition)
  yPosition += 15

  // Vector magnitude
  doc.setFont("helvetica", "bold")
  doc.text("Emotional Vector Magnitude:", 20, yPosition)
  yPosition += 10

  doc.setFont("helvetica", "normal")
  doc.text("|E| = √(joy² + sadness² + anger² + fear² + surprise² + disgust²)", 20, yPosition)
  yPosition += 8
  doc.text(
    `Magnitude: ${Math.sqrt(Object.values(emotions).reduce((sum, val) => sum + val * val, 0)).toFixed(3)}`,
    20,
    yPosition,
  )
  yPosition += 15

  // Recommendations Section
  if (yPosition > pageHeight - 60) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Personalized Recommendations", 20, yPosition)
  yPosition += 15

  const recommendations = generateRecommendations(analysis, emotions, biometrics)

  recommendations.forEach((rec, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(`${index + 1}. ${rec.title}`, 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const lines = doc.splitTextToSize(rec.description, pageWidth - 40)
    doc.text(lines, 25, yPosition)
    yPosition += lines.length * 5 + 8
  })

  // Crisis Indicators (if any)
  if (analysis.biometricFlags.length > 0) {
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFillColor(254, 242, 242)
    doc.rect(15, yPosition - 5, pageWidth - 30, 30, "F")

    doc.setDrawColor(239, 68, 68)
    doc.rect(15, yPosition - 5, pageWidth - 30, 30, "S")

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(239, 68, 68)
    doc.text("⚠ Crisis Indicators Detected", 20, yPosition + 5)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(`Flags: ${analysis.biometricFlags.join(", ")}`, 20, yPosition + 15)
    doc.text("Please consider seeking professional support if these symptoms persist.", 20, yPosition + 22)
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text("Generated by Emotional Geometry AI - For informational purposes only", pageWidth / 2, pageHeight - 10, {
    align: "center",
  })

  return doc
}

function getDominantEmotionColor(emotion: string): [number, number, number] {
  const colors: Record<string, [number, number, number]> = {
    Joy: [34, 197, 94],
    Sadness: [59, 130, 246],
    Anger: [239, 68, 68],
    Fear: [168, 85, 247],
    Surprise: [251, 191, 36],
    Disgust: [34, 197, 94],
  }
  return colors[emotion] || [107, 114, 128]
}

function getStabilityColor(stability: string): [number, number, number] {
  const colors: Record<string, [number, number, number]> = {
    stable: [34, 197, 94],
    unstable: [251, 191, 36],
    volatile: [239, 68, 68],
    critical: [239, 68, 68],
  }
  return colors[stability] || [107, 114, 128]
}

function getEmotionColor(emotion: string): [number, number, number] {
  const colors: Record<string, [number, number, number]> = {
    joy: [34, 197, 94],
    sadness: [59, 130, 246],
    anger: [239, 68, 68],
    fear: [168, 85, 247],
    surprise: [251, 191, 36],
    disgust: [34, 197, 94],
  }
  return colors[emotion] || [107, 114, 128]
}

function getBiometricStatus(value: number, min: number, max: number): string {
  if (value >= min && value <= max) return "normal"
  if (value < min * 0.8 || value > max * 1.2) return "critical"
  return "elevated"
}

function generateRecommendations(analysis: AnalysisResult, emotions: EmotionData, biometrics: any) {
  const recommendations = []

  // Based on dominant emotion
  if (analysis.dominantEmotion === "Sadness" && emotions.sadness >= 7) {
    recommendations.push({
      title: "Mood Enhancement Activities",
      description:
        "Consider engaging in activities that naturally boost serotonin levels such as light exercise, listening to uplifting music, or spending time in nature. Social connection with trusted friends or family can also help alleviate feelings of sadness.",
    })
  }

  if (analysis.dominantEmotion === "Anger" && emotions.anger >= 7) {
    recommendations.push({
      title: "Anger Management Techniques",
      description:
        "Practice deep breathing exercises, progressive muscle relaxation, or physical exercise to help process anger constructively. Consider journaling about the source of your anger to gain clarity and perspective.",
    })
  }

  if (analysis.dominantEmotion === "Fear" && emotions.fear >= 7) {
    recommendations.push({
      title: "Anxiety Reduction Strategies",
      description:
        "Implement grounding techniques such as the 5-4-3-2-1 method (5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste). Regular meditation or mindfulness practices can help manage fear and anxiety.",
    })
  }

  // Based on stability
  if (analysis.stabilityIndex < 0.3) {
    recommendations.push({
      title: "Emotional Stability Building",
      description:
        "Focus on establishing consistent daily routines, maintaining regular sleep patterns, and practicing stress management techniques. Consider speaking with a mental health professional for additional support.",
    })
  }

  // Based on biometrics
  if (biometrics.stressLevel > 6) {
    recommendations.push({
      title: "Stress Reduction Protocol",
      description:
        "Your stress levels are elevated. Prioritize relaxation techniques such as deep breathing, meditation, or gentle yoga. Ensure adequate sleep (7-9 hours) and consider reducing caffeine intake.",
    })
  }

  // Based on curvature
  if (analysis.curvatureLevel > 0.6) {
    recommendations.push({
      title: "Emotional Regulation Support",
      description:
        "Your emotional volatility is high. Practice emotional regulation techniques such as cognitive reframing, mindfulness meditation, or seeking support from a counselor to develop better coping strategies.",
    })
  }

  // General wellness
  recommendations.push({
    title: "General Wellness Maintenance",
    description:
      "Maintain a balanced diet rich in omega-3 fatty acids, engage in regular physical activity, stay hydrated, and ensure quality sleep. These foundational practices support overall emotional well-being.",
  })

  return recommendations
}
