import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export const runtime = "edge"

interface EmotionTrend {
  timestamp: number
  emotions: Record<string, number>
  dominantEmotion: string
  stabilityIndex: number
}

interface ResponseStyle {
  warmth: number // 0-10 (clinical to very warm)
  directness: number // 0-10 (gentle suggestions to direct advice)
  optimism: number // 0-10 (realistic to highly optimistic)
  formality: number // 0-10 (casual to professional)
  sarcasmFilter: boolean
  personalityType: "therapist" | "friend" | "coach" | "mentor"
}

interface TraumaIndicators {
  dissociation: boolean
  hypervigilance: boolean
  avoidance: boolean
  intrusion: boolean
  severity: "mild" | "moderate" | "severe"
}

interface PersonalContext {
  name?: string
  job?: string
  relationships?: string[]
  interests?: string[]
  previousTopics?: string[]
  lastInteraction?: string
}

export async function POST(req: Request) {
  const {
    messages,
    emotionData,
    emotionHistory = [],
    responseStyle = {
      warmth: 8,
      directness: 5,
      optimism: 6,
      formality: 3,
      sarcasmFilter: true,
      personalityType: "therapist",
    },
    traumaIndicators = null,
    personalContext = {},
  } = await req.json()

  // Analyze emotional trends
  const trendAnalysis = analyzeEmotionalTrends(emotionHistory)
  const traumaAssessment = assessTraumaIndicators(emotionData, messages)
  const personalInfo = extractPersonalInformation(messages, personalContext)
  const responseType = analyzeResponseType(messages)

  let groundingInstructions = ""
  let traumaProtocol = ""
  let personalityAdjustments = ""
  let personalContextPrompt = ""
  let minimalResponseHandling = ""

  // Enhanced emotional crisis detection
  if (emotionData) {
    const criticalEmotions = Object.entries(emotionData).filter(
      ([emotion, value]) => ["sadness", "anger", "fear", "disgust"].includes(emotion) && value >= 8,
    )

    const moderateDistress = Object.entries(emotionData).filter(
      ([emotion, value]) => ["sadness", "anger", "fear"].includes(emotion) && value >= 6,
    )

    if (criticalEmotions.length > 0) {
      groundingInstructions = generateCrisisProtocol(criticalEmotions, trendAnalysis)
    } else if (moderateDistress.length > 0) {
      groundingInstructions = generateSupportProtocol(moderateDistress, trendAnalysis)
    }
  }

  // Trauma-specific protocols
  if (traumaAssessment.hasTraumaIndicators || traumaIndicators) {
    traumaProtocol = generateTraumaProtocol(traumaAssessment, traumaIndicators)
  }

  // Personality and response style adjustments
  personalityAdjustments = generatePersonalityPrompt(responseStyle)

  // Personal context integration
  if (personalInfo.hasPersonalInfo) {
    personalContextPrompt = generatePersonalContextPrompt(personalInfo)
  }

  // Minimal response handling
  if (responseType.isMinimal) {
    minimalResponseHandling = generateMinimalResponseProtocol(responseType, personalInfo)
  }

  const trendInsights =
    trendAnalysis.insights.length > 0 ? `\n\nEMOTIONAL TREND INSIGHTS:\n${trendAnalysis.insights.join("\n")}` : ""

  const fullPrompt = `You are an advanced AI emotional support companion with deep empathy and therapeutic training. Your responses are personalized based on the user's emotional patterns, personal information, and communication style.

CORE PRINCIPLES:
- Validate all feelings without judgment
- Provide evidence-based emotional support
- Adapt your communication style to user preferences
- Recognize and respond to trauma indicators appropriately
- Use emotional trend data to provide contextual support
- Remember and reference personal information to build rapport
- Handle minimal responses with empathy and gentle exploration

${personalityAdjustments}

${personalContextPrompt}

${minimalResponseHandling}

CURRENT EMOTIONAL STATE:
${emotionData ? `Joy: ${emotionData.joy}/10, Sadness: ${emotionData.sadness}/10, Anger: ${emotionData.anger}/10, Fear: ${emotionData.fear}/10, Surprise: ${emotionData.surprise}/10, Disgust: ${emotionData.disgust}/10` : "Not provided"}

${trendInsights}

${groundingInstructions}

${traumaProtocol}

RESPONSE GUIDELINES:
- Keep responses concise but meaningful (2-4 sentences typically)
- Use appropriate emojis based on warmth setting
- Offer specific, actionable support when appropriate
- Ask gentle follow-up questions to deepen understanding
- Reference emotional patterns when relevant
- Use personal information naturally in conversation
- Show genuine interest in their life and experiences

Begin your empathetic response now.`

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [{ role: "system", content: fullPrompt }, ...messages],
    temperature: Math.max(0.3, Math.min(0.9, responseStyle.warmth / 10)),
    max_tokens: responseStyle.directness > 7 ? 200 : 150,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
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

function generatePersonalContextPrompt(personalInfo: PersonalContext & { hasPersonalInfo: boolean }) {
  if (!personalInfo.hasPersonalInfo) return ""

  let prompt = "PERSONAL CONTEXT:\n"

  if (personalInfo.name) {
    prompt += `- User's name: ${personalInfo.name}\n`
    prompt += `- Address them by name occasionally to build rapport\n`
  }

  if (personalInfo.job) {
    prompt += `- Occupation: ${personalInfo.job}\n`
    prompt += `- Reference their work when relevant to emotional discussions\n`
  }

  if (personalInfo.relationships && personalInfo.relationships.length > 0) {
    prompt += `- Relationships mentioned: ${personalInfo.relationships.join(", ")}\n`
    prompt += `- Consider relationship dynamics in emotional support\n`
  }

  if (personalInfo.interests && personalInfo.interests.length > 0) {
    prompt += `- Interests/hobbies: ${personalInfo.interests.join(", ")}\n`
    prompt += `- Suggest activities related to their interests for emotional wellness\n`
  }

  if (personalInfo.previousTopics && personalInfo.previousTopics.length > 0) {
    prompt += `- Previous conversation topics: ${personalInfo.previousTopics.join(", ")}\n`
    prompt += `- Reference previous discussions when appropriate\n`
  }

  prompt += "\nUSE THIS INFORMATION NATURALLY:\n"
  prompt += "- Don't force personal references into every response\n"
  prompt += "- Use their name occasionally, especially when offering comfort\n"
  prompt += "- Connect their interests to coping strategies when relevant\n"
  prompt += "- Show genuine interest in their life and experiences\n"

  return prompt
}

function generateMinimalResponseProtocol(responseType: any, personalInfo: PersonalContext) {
  let protocol = "MINIMAL RESPONSE DETECTED:\n"

  switch (responseType.type) {
    case "dismissive":
      protocol += `User responded with "${responseType.originalMessage}" which may indicate:\n`
      protocol += "- Feeling overwhelmed or wanting to end the conversation\n"
      protocol += "- Emotional shutdown or avoidance\n"
      protocol += "- Frustration or irritation\n"
      protocol += "- Feeling misunderstood\n\n"
      protocol += "RESPONSE APPROACH:\n"
      protocol += "- Acknowledge their response without judgment\n"
      protocol += "- Gently explore what might be behind the brevity\n"
      protocol += "- Offer space if they need it\n"
      protocol += "- Show you're still there for them\n"
      break

    case "acknowledgment":
      protocol += `User responded with "${responseType.originalMessage}" which likely indicates:\n`
      protocol += "- They're listening but may not have much to add\n"
      protocol += "- Processing what you've said\n"
      protocol += "- Feeling heard and understood\n\n"
      protocol += "RESPONSE APPROACH:\n"
      protocol += "- Acknowledge their listening\n"
      protocol += "- Gently invite them to share more if they want\n"
      protocol += "- Continue the conversation naturally\n"
      break

    case "uncertain":
      protocol += `User responded with "${responseType.originalMessage}" which suggests:\n`
      protocol += "- Confusion or uncertainty about their feelings\n"
      protocol += "- Difficulty articulating their thoughts\n"
      protocol += "- Feeling overwhelmed by options or emotions\n\n"
      protocol += "RESPONSE APPROACH:\n"
      protocol += "- Normalize uncertainty and confusion\n"
      protocol += "- Help them explore their feelings step by step\n"
      protocol += "- Offer gentle guidance without pressure\n"
      break

    default:
      protocol += "GENERAL MINIMAL RESPONSE APPROACH:\n"
      protocol += "- Don't take it personally or as rejection\n"
      protocol += "- Acknowledge their response warmly\n"
      protocol += "- Gently explore if there's more they'd like to share\n"
      protocol += "- Maintain supportive presence\n"
  }

  if (personalInfo.name) {
    protocol += `\n- Use their name (${personalInfo.name}) to create connection\n`
  }

  protocol += "\nEXAMPLE RESPONSES:\n"
  protocol += `- "I hear you${personalInfo.name ? `, ${personalInfo.name}` : ""}. Sometimes a simple '${responseType.originalMessage}' says a lot. What's going on for you right now?"\n`
  protocol +=
    "- \"That's okay - you don't need to say much. I'm here if you want to share more, or if you just need someone to sit with you in this moment.\"\n"
  protocol +=
    "- \"I notice you're keeping things brief. That's totally fine - sometimes that's all we have energy for. How are you feeling?\"\n"

  return protocol
}

function analyzeEmotionalTrends(emotionHistory: EmotionTrend[]) {
  if (emotionHistory.length < 2) {
    return { insights: [], patterns: {} }
  }

  const insights: string[] = []
  const recent = emotionHistory.slice(-5) // Last 5 entries
  const patterns: Record<string, any> = {}

  // Trend analysis
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

  // Pattern recognition
  const dominantEmotions = recent.map((entry) => entry.dominantEmotion)
  const emotionCounts = dominantEmotions.reduce(
    (acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostFrequent = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a)[0]

  if (mostFrequent && mostFrequent[1] >= 3) {
    insights.push(
      `${mostFrequent[0]} has been your dominant emotion recently. Let's explore what might be contributing to this pattern.`,
    )
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

function assessTraumaIndicators(emotionData: any, messages: any[]) {
  const indicators = {
    dissociation: false,
    hypervigilance: false,
    avoidance: false,
    intrusion: false,
    hasTraumaIndicators: false,
  }

  if (!emotionData || !messages) return indicators

  // Check for dissociation indicators
  if (emotionData.fear >= 7 && emotionData.sadness >= 6) {
    indicators.dissociation = true
  }

  // Check message content for trauma keywords
  const recentMessages = messages.slice(-3).map((m) => m.content?.toLowerCase() || "")
  const traumaKeywords = [
    "dissociate",
    "disconnect",
    "unreal",
    "floating",
    "watching myself",
    "flashback",
    "nightmare",
    "triggered",
    "panic",
    "hypervigilant",
    "avoid",
    "can't stop thinking",
    "intrusive thoughts",
  ]

  recentMessages.forEach((message) => {
    if (traumaKeywords.some((keyword) => message.includes(keyword))) {
      indicators.hasTraumaIndicators = true

      if (message.includes("dissociate") || message.includes("unreal") || message.includes("floating")) {
        indicators.dissociation = true
      }
      if (message.includes("flashback") || message.includes("intrusive")) {
        indicators.intrusion = true
      }
      if (message.includes("avoid") || message.includes("can't face")) {
        indicators.avoidance = true
      }
      if (message.includes("hypervigilant") || message.includes("on edge")) {
        indicators.hypervigilance = true
      }
    }
  })

  return indicators
}

function generateCrisisProtocol(criticalEmotions: [string, number][], trendAnalysis: any) {
  const emotionNames = criticalEmotions.map(([emotion]) => emotion).join(", ")

  return `CRISIS SUPPORT PROTOCOL ACTIVATED:
You are detecting signs of severe emotional distress (${emotionNames} at critical levels). 

IMMEDIATE RESPONSE APPROACH:
1. **Validation First**: "I can see you're going through something really difficult right now. Your feelings are completely valid."

2. **Safety Assessment**: Gently check if they're in immediate danger without being alarming.

3. **Grounding Techniques** (offer 2-3 options):
   - **4-7-8 Breathing**: "Let's breathe together. In for 4... hold for 7... out for 8..."
   - **5-4-3-2-1 Grounding**: Guide them to name 5 things they see, 4 they can touch, 3 they hear, 2 they smell, 1 they taste
   - **Body Scan**: "Feel your feet on the ground, your back against the chair..."

4. **Emotional Specific Support**:
   - *High Sadness*: Acknowledge the pain, offer gentle distraction or comfort items
   - *High Anger*: Validate the feeling, suggest safe physical outlets
   - *High Fear*: Reassure safety, help assess reality of threat
   - *High Disgust*: Acknowledge violation of values, suggest symbolic cleansing

5. **Trend Context**: ${trendAnalysis.insights.length > 0 ? `Reference that you notice patterns: "${trendAnalysis.insights[0]}"` : ""}

6. **Gentle Presence**: End with "I'm here with you. You don't have to go through this alone."

AVOID: Minimizing feelings, rushing to solutions, overwhelming with too many techniques.`
}

function generateSupportProtocol(moderateEmotions: [string, number][], trendAnalysis: any) {
  return `SUPPORTIVE CARE PROTOCOL:
Moderate emotional distress detected. Provide warm, validating support with gentle guidance.

APPROACH:
- Acknowledge their emotional experience with empathy
- Offer 1-2 coping strategies appropriate to their emotions
- Reference emotional patterns if relevant: ${trendAnalysis.insights[0] || "Notice any patterns in their emotional journey"}
- Ask gentle, open-ended questions to explore their experience
- Provide hope and reassurance about their resilience`
}

function generateTraumaProtocol(assessment: any, traumaIndicators: TraumaIndicators | null) {
  if (!assessment.hasTraumaIndicators && !traumaIndicators) return ""

  return `TRAUMA-INFORMED CARE PROTOCOL:

DISSOCIATION MANAGEMENT:
- If dissociation detected: "Let's bring you back to the present moment. Feel your feet on the ground..."
- **Grounding Techniques**: 
  * Name 5 things you can see in detail
  * Hold a textured object (ice cube, rough fabric)
  * Splash cold water on face/wrists
  * Strong mint or smell something distinct

HYPERVIGILANCE SUPPORT:
- Validate their alertness as a protective mechanism
- **Progressive Muscle Relaxation**: Tense and release muscle groups
- **Safe Space Visualization**: Guide them to imagine a completely safe place
- **Boundary Setting**: Help them identify what feels safe vs unsafe

INTRUSIVE THOUGHTS/FLASHBACKS:
- **STOP Technique**: Stop, Take a breath, Observe surroundings, Proceed mindfully
- **Container Visualization**: Imagine putting the memory in a strong container
- **Bilateral Stimulation**: Alternate tapping knees or shoulders
- **Remind**: "That was then, this is now. You are safe."

AVOIDANCE PATTERNS:
- Gentle exposure suggestions only when they're ready
- **Pendulation**: Brief contact with difficult feeling, then return to safety
- **Titration**: Break overwhelming experiences into tiny, manageable pieces

GENERAL TRAUMA SUPPORT:
- Always emphasize choice and control
- Normalize trauma responses
- Suggest professional trauma therapy when appropriate
- Focus on building safety and stability first

Remember: Go slow, follow their lead, prioritize safety over progress.`
}

function generatePersonalityPrompt(style: ResponseStyle) {
  let prompt = `RESPONSE STYLE CONFIGURATION:\n`

  // Warmth adjustment
  if (style.warmth >= 8) {
    prompt += `- Use warm, nurturing language with appropriate emojis 💙\n`
  } else if (style.warmth >= 5) {
    prompt += `- Maintain professional warmth without excessive emotional language\n`
  } else {
    prompt += `- Keep responses clinical and objective, minimal emotional language\n`
  }

  // Directness
  if (style.directness >= 7) {
    prompt += `- Provide clear, direct advice and actionable steps\n`
  } else if (style.directness >= 4) {
    prompt += `- Balance gentle suggestions with some direct guidance\n`
  } else {
    prompt += `- Use very gentle suggestions, avoid direct advice\n`
  }

  // Optimism
  if (style.optimism >= 7) {
    prompt += `- Emphasize hope, growth potential, and positive reframing\n`
  } else if (style.optimism >= 4) {
    prompt += `- Balance realism with gentle hope\n`
  } else {
    prompt += `- Focus on validation and acceptance rather than positive outlook\n`
  }

  // Personality type
  switch (style.personalityType) {
    case "therapist":
      prompt += `- Adopt a professional therapeutic stance with evidence-based approaches\n`
      break
    case "friend":
      prompt += `- Respond like a caring, understanding friend who listens without judgment\n`
      break
    case "coach":
      prompt += `- Take a motivational, goal-oriented approach focused on growth and action\n`
      break
    case "mentor":
      prompt += `- Provide wise, experienced guidance with gentle teaching moments\n`
      break
  }

  // Sarcasm filter
  if (style.sarcasmFilter) {
    prompt += `- IMPORTANT: Avoid all sarcasm, irony, or humor that could be misinterpreted\n`
  }

  return prompt
}
