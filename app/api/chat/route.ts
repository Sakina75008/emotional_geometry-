// Allow streaming responses up to 30 seconds
export const maxDuration = 30

interface EmotionTrend {
  timestamp: number
  emotions: Record<string, number>
  dominantEmotion: string
  stabilityIndex: number
}

interface PersonalContext {
  name?: string
  job?: string
  relationships?: string[]
  interests?: string[]
  challenges?: string[]
  goals?: string[]
  previousTopics?: string[]
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      emotionData,
      emotionHistory = [],
      personalContext = {},
      isInCrisisMode = false,
    } = await req.json()

    // Get the last user message
    const lastMessage = messages[messages.length - 1]?.content || ""

    // Analyze emotional trends
    const trendAnalysis = analyzeEmotionalTrends(emotionHistory)
    const personalInfo = extractPersonalInformation(messages, personalContext)
    const responseType = analyzeResponseType(messages)

    // Build comprehensive system prompt
    const systemPrompt = buildSystemPrompt({
      emotionData,
      trendAnalysis,
      personalInfo,
      responseType,
      isInCrisisMode,
    })

    // Use OpenAI API directly
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-5), // Keep last 5 messages for context
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now."

    return Response.json({ content })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { content: "I'm experiencing some technical difficulties. Please try again in a moment." },
      { status: 500 },
    )
  }
}

function buildSystemPrompt({ emotionData, trendAnalysis, personalInfo, responseType, isInCrisisMode }: any) {
  let prompt = `You are an advanced AI emotional support companion with deep empathy and therapeutic training. Your responses are personalized based on the user's emotional patterns and personal information.

CORE PRINCIPLES:
- Validate all feelings without judgment
- Provide evidence-based emotional support
- Remember and reference personal information naturally
- Handle minimal responses with empathy and gentle exploration
- Recognize crisis situations and provide appropriate support

`

  // Add personal context if available
  if (personalInfo.hasPersonalInfo) {
    prompt += `PERSONAL CONTEXT:\n`
    if (personalInfo.name) {
      prompt += `- User's name: ${personalInfo.name}\n`
    }
    if (personalInfo.job) {
      prompt += `- Occupation: ${personalInfo.job}\n`
    }
    if (personalInfo.relationships && personalInfo.relationships.length > 0) {
      prompt += `- Relationships: ${personalInfo.relationships.join(", ")}\n`
    }
    if (personalInfo.interests && personalInfo.interests.length > 0) {
      prompt += `- Interests: ${personalInfo.interests.join(", ")}\n`
    }
    prompt += `\n`
  }

  // Add emotional state information
  if (emotionData) {
    prompt += `CURRENT EMOTIONAL STATE:\n`
    prompt += `Joy: ${emotionData.joy}/10, Sadness: ${emotionData.sadness}/10, `
    prompt += `Anger: ${emotionData.anger}/10, Fear: ${emotionData.fear}/10, `
    prompt += `Surprise: ${emotionData.surprise}/10, Disgust: ${emotionData.disgust}/10\n\n`

    // Check for high negative emotions
    const criticalEmotions = Object.entries(emotionData).filter(
      ([emotion, value]) => ["sadness", "anger", "fear", "disgust"].includes(emotion) && value >= 8,
    )

    if (criticalEmotions.length > 0) {
      prompt += `CRISIS INDICATORS DETECTED:\n`
      prompt += `High levels of: ${criticalEmotions.map(([emotion]) => emotion).join(", ")}\n`
      prompt += `Provide immediate emotional support and grounding techniques.\n\n`
    }
  }

  // Add trend analysis
  if (trendAnalysis.insights.length > 0) {
    prompt += `EMOTIONAL TRENDS:\n`
    trendAnalysis.insights.forEach((insight: string) => {
      prompt += `- ${insight}\n`
    })
    prompt += `\n`
  }

  // Handle minimal responses
  if (responseType.isMinimal) {
    prompt += `MINIMAL RESPONSE DETECTED:\n`
    prompt += `User responded with "${responseType.originalMessage}" which may indicate:\n`

    switch (responseType.type) {
      case "dismissive":
        prompt += `- Feeling overwhelmed or wanting to end conversation\n`
        prompt += `- Emotional shutdown or avoidance\n`
        prompt += `- Respond with gentle acknowledgment and exploration\n`
        break
      case "acknowledgment":
        prompt += `- They're listening but processing\n`
        prompt += `- Continue conversation naturally while inviting more sharing\n`
        break
      case "uncertain":
        prompt += `- Confusion about their feelings\n`
        prompt += `- Help them explore step by step\n`
        break
    }
    prompt += `\n`
  }

  // Crisis mode handling
  if (isInCrisisMode) {
    prompt += `CRISIS MODE ACTIVE:\n`
    prompt += `- Priority is immediate safety and stabilization\n`
    prompt += `- Offer grounding techniques after acknowledging their crisis\n`
    prompt += `- Use calm, clear, non-judgmental language\n`
    prompt += `- Focus on present moment and basic needs\n\n`
  }

  prompt += `RESPONSE GUIDELINES:
- Keep responses concise but meaningful (2-4 sentences)
- Use warm, empathetic language with appropriate emojis
- Reference personal information naturally when relevant
- Ask gentle follow-up questions to deepen understanding
- Offer specific, actionable support when appropriate
- Show genuine interest in their life and experiences

Begin your empathetic response now.`

  return prompt
}

function analyzeEmotionalTrends(emotionHistory: EmotionTrend[]) {
  if (emotionHistory.length < 2) {
    return { insights: [], patterns: {} }
  }

  const insights: string[] = []
  const recent = emotionHistory.slice(-5)
  const patterns: Record<string, any> = {}

  // Analyze trends for each emotion
  const emotions = ["joy", "sadness", "anger", "fear", "surprise", "disgust"]

  emotions.forEach((emotion) => {
    const values = recent.map((entry) => entry.emotions[emotion] || 0)
    const trend = calculateTrend(values)
    patterns[emotion] = trend

    if (Math.abs(trend.slope) > 1) {
      const direction = trend.slope > 0 ? "increasing" : "decreasing"
      insights.push(`Your ${emotion} levels have been ${direction} over recent sessions.`)
    }
  })

  // Stability analysis
  const stabilityTrend = recent.map((entry) => entry.stabilityIndex)
  const avgStability = stabilityTrend.reduce((a, b) => a + b, 0) / stabilityTrend.length

  if (avgStability < 0.3) {
    insights.push("Your emotional stability has been lower than usual. Consider focusing on grounding techniques.")
  } else if (avgStability > 0.7) {
    insights.push("Your emotional stability has been quite good recently. Great progress!")
  }

  return { insights, patterns }
}

function calculateTrend(values: number[]) {
  const n = values.length
  const sumX = (n * (n - 1)) / 2
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0)
  const sumXX = values.reduce((sum, _, x) => sum + x * x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept, direction: slope > 0 ? "increasing" : "decreasing" }
}

function extractPersonalInformation(messages: any[], existingContext: PersonalContext) {
  const personalInfo = { ...existingContext, hasPersonalInfo: false }

  if (!messages || messages.length === 0) return personalInfo

  const recentMessages = messages.slice(-5).map((m) => m.content?.toLowerCase() || "")
  const allText = recentMessages.join(" ")

  // Extract name
  const namePatterns = [/my name is (\w+)/i, /i'm (\w+)/i, /call me (\w+)/i, /i am (\w+)/i]

  for (const pattern of namePatterns) {
    const match = allText.match(pattern)
    if (match && match[1]) {
      personalInfo.name = match[1].charAt(0).toUpperCase() + match[1].slice(1)
      personalInfo.hasPersonalInfo = true
      break
    }
  }

  // Extract job/work information
  const jobPatterns = [/i work as (?:a |an )?(\w+)/i, /i'm (?:a |an )?(\w+)/i, /my job is (\w+)/i, /i do (\w+)/i]

  for (const pattern of jobPatterns) {
    const match = allText.match(pattern)
    if (match && match[1] && !["feeling", "doing", "going", "having"].includes(match[1])) {
      personalInfo.job = match[1]
      personalInfo.hasPersonalInfo = true
      break
    }
  }

  // Extract relationships
  const relationshipKeywords = [
    "husband",
    "wife",
    "partner",
    "boyfriend",
    "girlfriend",
    "spouse",
    "kids",
    "children",
    "family",
    "parents",
    "mom",
    "dad",
    "sister",
    "brother",
  ]
  const foundRelationships = relationshipKeywords.filter((keyword) => allText.includes(keyword))
  if (foundRelationships.length > 0) {
    personalInfo.relationships = [...(personalInfo.relationships || []), ...foundRelationships]
    personalInfo.hasPersonalInfo = true
  }

  // Extract interests/hobbies
  const interestPatterns = [/i love (\w+)/i, /i enjoy (\w+)/i, /i like (\w+)/i, /my hobby is (\w+)/i]

  for (const pattern of interestPatterns) {
    const match = allText.match(pattern)
    if (match && match[1]) {
      personalInfo.interests = [...(personalInfo.interests || []), match[1]]
      personalInfo.hasPersonalInfo = true
    }
  }

  return personalInfo
}

function analyzeResponseType(messages: any[]) {
  if (!messages || messages.length === 0) return { isMinimal: false, type: "normal" }

  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase().trim() || ""

  const minimalResponses = [
    "ok",
    "okay",
    "k",
    "mhm",
    "mm",
    "mmm",
    "yeah",
    "yep",
    "yes",
    "no",
    "nah",
    "sure",
    "fine",
    "whatever",
    "idk",
    "i don't know",
    "maybe",
    "i guess",
    "uh huh",
    "uh-huh",
    "right",
    "true",
    "exactly",
    "yup",
    "nope",
  ]

  const isMinimal = minimalResponses.includes(lastMessage) || lastMessage.length <= 3

  let responseType = "normal"
  if (isMinimal) {
    if (["ok", "okay", "k", "fine", "whatever"].includes(lastMessage)) {
      responseType = "dismissive"
    } else if (["mhm", "mm", "uh huh", "yeah"].includes(lastMessage)) {
      responseType = "acknowledgment"
    } else if (["idk", "i don't know", "maybe", "i guess"].includes(lastMessage)) {
      responseType = "uncertain"
    }
  }

  return { isMinimal, type: responseType, originalMessage: lastMessage }
}
