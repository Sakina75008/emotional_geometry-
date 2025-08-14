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
    const apiKey = process.env.OPENAI_API_KEY

    const {
      messages,
      emotionData,
      emotionHistory = [],
      personalContext = {},
      isInCrisisMode = false,
    } = await req.json()

    if (!apiKey) {
      console.log("OPENAI_API_KEY not available, using fallback responses")

      // Use fallback response system
      const fallbackResponse = generateFallbackResponse({
        messages,
        emotionData,
        emotionHistory,
        personalContext,
        isInCrisisMode,
      })

      return Response.json({ content: fallbackResponse })
    }

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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
      const errorText = await response.text()
      console.error(`OpenAI API error: ${response.status} - ${errorText}`)

      if (response.status === 401) {
        return Response.json(
          {
            content:
              "I'm sorry, but there's an authentication issue with the AI service. Please check the API key configuration.",
          },
          { status: 500 },
        )
      }

      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
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

function generateFallbackResponse({ messages, emotionData, emotionHistory, personalContext, isInCrisisMode }: any) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""
  const responseType = analyzeResponseType(messages)
  const personalInfo = extractPersonalInformation(messages, personalContext)

  // Crisis mode responses
  if (
    isInCrisisMode ||
    (emotionData && (emotionData.sadness >= 8 || emotionData.anger >= 8 || emotionData.fear >= 8))
  ) {
    const crisisResponses = [
      "I can see you're going through a really difficult time right now. Your feelings are completely valid, and you don't have to face this alone. 💙",
      "It sounds like you're experiencing intense emotions. That takes courage to share. Let's focus on getting through this moment together. 🤗",
      "I hear that you're struggling, and I want you to know that reaching out shows incredible strength. You matter, and your feelings matter. ✨",
    ]
    return crisisResponses[Math.floor(Math.random() * crisisResponses.length)]
  }

  // Handle minimal responses
  if (responseType.isMinimal) {
    if (responseType.type === "dismissive") {
      return "I sense you might be feeling overwhelmed or wanting some space. That's completely okay. I'm here whenever you're ready to share more. 💙"
    } else if (responseType.type === "acknowledgment") {
      return "I appreciate you staying with me in this conversation. Sometimes just being present is enough. How are you feeling in this moment? 🌟"
    } else if (responseType.type === "uncertain") {
      return "It's okay not to have all the answers right now. Uncertainty can feel uncomfortable, but it's also completely human. What feels most important to you today? 💭"
    }
  }

  // Emotion-based responses
  if (emotionData) {
    const dominantEmotion = Object.entries(emotionData).reduce((a, b) =>
      emotionData[a[0]] > emotionData[b[0]] ? a : b,
    )[0]
    const emotionLevel = emotionData[dominantEmotion]

    if (dominantEmotion === "joy" && emotionLevel >= 6) {
      const joyResponses = [
        "I can feel the positive energy in your message! It's wonderful to see you experiencing joy. What's bringing you this happiness? ✨",
        "Your joy is contagious! It's beautiful when we can recognize and celebrate these positive moments. 😊",
        "I love hearing about the good things in your life. Joy is such a precious emotion - tell me more about what's making you feel this way! 🌟",
      ]
      return joyResponses[Math.floor(Math.random() * joyResponses.length)]
    }

    if (dominantEmotion === "sadness" && emotionLevel >= 5) {
      const sadnessResponses = [
        "I can sense the sadness you're carrying right now. It's okay to feel this way - sadness is a natural response to loss or disappointment. You're not alone. 💙",
        "Your sadness is valid, and I'm here to listen. Sometimes we need to sit with these feelings before we can move through them. What's weighing on your heart? 🤗",
        "I hear the pain in your words. Sadness can feel overwhelming, but it also shows how deeply you care. That's actually a beautiful thing about you. 💝",
      ]
      return sadnessResponses[Math.floor(Math.random() * sadnessResponses.length)]
    }

    if (dominantEmotion === "anger" && emotionLevel >= 5) {
      const angerResponses = [
        "I can feel the intensity of your anger. That energy shows you care deeply about something. What's stirring up these strong feelings? 🔥",
        "Anger can be a powerful emotion that signals something important to us. It's okay to feel this way. What feels unfair or frustrating right now? 💪",
        "Your anger is telling you something important. Let's explore what's behind these feelings - sometimes anger is protecting other emotions. 🛡️",
      ]
      return angerResponses[Math.floor(Math.random() * angerResponses.length)]
    }

    if (dominantEmotion === "fear" && emotionLevel >= 5) {
      const fearResponses = [
        "I can sense the fear you're experiencing. Fear often shows up when we're facing something uncertain or important to us. You're brave for acknowledging it. 🌟",
        "Fear can feel overwhelming, but it also shows you're stepping outside your comfort zone. That takes courage. What's feeling scary right now? 💙",
        "I hear the worry in your message. Fear is our mind's way of trying to protect us, but sometimes it can hold us back too. Let's explore this together. 🤗",
      ]
      return fearResponses[Math.floor(Math.random() * fearResponses.length)]
    }
  }

  // Personalized responses based on context
  if (personalInfo.name) {
    const personalizedResponses = [
      `${personalInfo.name}, I appreciate you sharing with me. Your openness helps me understand what you're going through. How can I best support you today? 💙`,
      `Thank you for trusting me with your thoughts, ${personalInfo.name}. What's been on your mind lately? 🌟`,
      `${personalInfo.name}, I'm here to listen and support you. What would be most helpful for you right now? ✨`,
    ]
    return personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)]
  }

  // General supportive responses
  const generalResponses = [
    "Thank you for sharing with me. I'm here to listen and support you through whatever you're experiencing. What's on your mind today? 💙",
    "I appreciate your openness in our conversation. Every feeling you have is valid and important. How are you taking care of yourself? 🌟",
    "It means a lot that you're here talking with me. Sometimes just expressing our thoughts can be really helpful. What feels most important to you right now? ✨",
    "I'm glad you reached out. Your willingness to explore your emotions shows real strength and self-awareness. What would you like to talk about? 🤗",
    "Thank you for trusting me with your thoughts and feelings. I'm here to support you however I can. What's been weighing on your mind? 💝",
  ]

  return generalResponses[Math.floor(Math.random() * generalResponses.length)]
}
