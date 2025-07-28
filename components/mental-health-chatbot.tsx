"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Heart,
  AlertTriangle,
  Settings,
  BookOpen,
  TrendingDown,
  TrendingUp,
  Minus,
  Shield,
  Music,
  Wind,
} from "lucide-react"
import type { AnalysisResult, EmotionData } from "@/app/page"
import { TherapyPersonalizationPanel } from "@/components/therapy-personalization-panel"
import { EmotionalTrendChart } from "@/components/emotional-trend-chart"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "empathy" | "crisis" | "grounding" | "reflection" | "support" | "breathing" | "music"
  stabilityScore?: number
}

interface JournalEntry {
  id: string
  content: string
  timestamp: Date
  stabilityScore: number
  emotionalState: string
  detectedFlags: string[]
}

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

interface PersonalContext {
  name?: string
  job?: string
  relationships?: string[]
  interests?: string[]
  challenges?: string[]
  goals?: string[]
  previousTopics?: string[]
}

interface MentalHealthChatbotProps {
  analysis: AnalysisResult | null
  emotions: EmotionData
}

export function MentalHealthChatbot({ analysis, emotions }: MentalHealthChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [currentStabilityScore, setCurrentStabilityScore] = useState(75)
  const [isInCrisisMode, setIsInCrisisMode] = useState(false)
  const [showPersonalization, setShowPersonalization] = useState(false)
  const [showTrends, setShowTrends] = useState(false)
  const [isJournalMode, setIsJournalMode] = useState(false)
  const [personalContext, setPersonalContext] = useState<PersonalContext>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [therapySettings, setTherapySettings] = useState<TherapySettings>({
    empathyLevel: "balanced",
    sarcasmFilter: "moderate",
    toneStyle: "warm",
    copingMethod: "cbt",
    crisisThreshold: 35,
    safeWords: ["pause", "stop", "break"],
    emergencyContact: "",
    visualAnchors: ["blue sky", "warm blanket", "safe room"],
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Load data from localStorage
    const savedEntries = localStorage.getItem("mentalHealthJournal")
    const savedContext = localStorage.getItem("personalContext")

    if (savedEntries) {
      setJournalEntries(JSON.parse(savedEntries))
    }

    if (savedContext) {
      setPersonalContext(JSON.parse(savedContext))
    }

    // Initialize with therapeutic greeting
    if (messages.length === 0) {
      const greeting = generateTherapeuticGreeting()
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
          type: "empathy",
        },
      ])
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem("mentalHealthJournal", JSON.stringify(journalEntries))
    localStorage.setItem("personalContext", JSON.stringify(personalContext))
  }, [journalEntries, personalContext])

  useEffect(() => {
    // Crisis mode logic
    const negativeEmotions = {
      sadness: emotions.sadness,
      fear: emotions.fear,
      anger: emotions.anger,
      disgust: emotions.disgust,
    }

    const hasCriticalEmotion = Object.values(negativeEmotions).some((value) => value >= 8)
    const shouldActivateCrisis = hasCriticalEmotion || currentStabilityScore <= therapySettings.crisisThreshold

    if (shouldActivateCrisis && !isInCrisisMode) {
      activateCrisisMode()
    } else if (!hasCriticalEmotion && currentStabilityScore > therapySettings.crisisThreshold + 15 && isInCrisisMode) {
      deactivateCrisisMode()
    }
  }, [currentStabilityScore, therapySettings.crisisThreshold, emotions])

  const extractPersonalInfo = (message: string) => {
    const lowerMessage = message.toLowerCase()
    const newContext = { ...personalContext }
    let updated = false

    // Extract name
    const namePatterns = [/my name is (\w+)/i, /i'm (\w+)/i, /call me (\w+)/i, /i am (\w+)/i]

    namePatterns.forEach((pattern) => {
      const match = message.match(pattern)
      if (match && match[1] && match[1].length > 1) {
        newContext.name = match[1]
        updated = true
      }
    })

    // Extract job/work info
    const jobPatterns = [
      /i work as a? (.+?)(?:\.|,|$)/i,
      /my job is (.+?)(?:\.|,|$)/i,
      /i'm a (.+?)(?:\.|,|$)/i,
      /i am a (.+?)(?:\.|,|$)/i,
    ]

    jobPatterns.forEach((pattern) => {
      const match = message.match(pattern)
      if (match && match[1]) {
        newContext.job = match[1].trim()
        updated = true
      }
    })

    // Extract relationship info
    if (
      lowerMessage.includes("boyfriend") ||
      lowerMessage.includes("girlfriend") ||
      lowerMessage.includes("partner") ||
      lowerMessage.includes("husband") ||
      lowerMessage.includes("wife") ||
      lowerMessage.includes("spouse")
    ) {
      if (!newContext.relationships) newContext.relationships = []
      const relationshipMentions = message.match(/(boyfriend|girlfriend|partner|husband|wife|spouse)/gi)
      if (relationshipMentions) {
        relationshipMentions.forEach((rel) => {
          if (!newContext.relationships!.includes(rel.toLowerCase())) {
            newContext.relationships!.push(rel.toLowerCase())
            updated = true
          }
        })
      }
    }

    // Extract interests/hobbies
    const interestPatterns = [
      /i like (.+?)(?:\.|,|$)/i,
      /i love (.+?)(?:\.|,|$)/i,
      /i enjoy (.+?)(?:\.|,|$)/i,
      /my hobby is (.+?)(?:\.|,|$)/i,
    ]

    interestPatterns.forEach((pattern) => {
      const match = message.match(pattern)
      if (match && match[1]) {
        if (!newContext.interests) newContext.interests = []
        const interest = match[1].trim()
        if (!newContext.interests.includes(interest)) {
          newContext.interests.push(interest)
          updated = true
        }
      }
    })

    // Track previous topics
    if (!newContext.previousTopics) newContext.previousTopics = []
    const topics = [
      "work",
      "job",
      "family",
      "relationship",
      "health",
      "anxiety",
      "depression",
      "stress",
      "sleep",
      "friends",
      "money",
      "school",
      "college",
      "university",
    ]

    topics.forEach((topic) => {
      if (lowerMessage.includes(topic) && !newContext.previousTopics!.includes(topic)) {
        newContext.previousTopics!.push(topic)
        updated = true
      }
    })

    if (updated) {
      setPersonalContext(newContext)
    }

    return newContext
  }

  const generateTherapeuticGreeting = () => {
    const greetings = {
      soft: personalContext.name
        ? `Hello ${personalContext.name}, I'm here to listen and support you through whatever you're experiencing. How are you feeling today? 💙`
        : "Hello, I'm here to listen and support you through whatever you're experiencing. There's no pressure to share anything you're not ready for. How are you feeling in this moment? 💙",
      balanced: personalContext.name
        ? `Hi ${personalContext.name}. I'm here to provide a safe space for you to explore your thoughts and feelings. What's on your mind today?`
        : "Hi there. I'm here to provide a safe space for you to explore your thoughts and feelings. What's on your mind today?",
      clinical: personalContext.name
        ? `Good day, ${personalContext.name}. I'm here to assist you with emotional processing and coping strategies. What would you like to discuss?`
        : "Good day. I'm here to assist you with emotional processing and coping strategies. What would you like to discuss?",
    }
    return greetings[therapySettings.empathyLevel]
  }

  const calculateStabilityScore = (text: string): number => {
    let score = 75

    const negativeEmotions = {
      sadness: emotions.sadness,
      fear: emotions.fear,
      anger: emotions.anger,
      disgust: emotions.disgust,
    }

    const highNegativeEmotions = Object.entries(negativeEmotions).filter(([_, value]) => value >= 8)
    const moderateNegativeEmotions = Object.entries(negativeEmotions).filter(([_, value]) => value >= 6 && value < 8)
    const lowNegativeEmotions = Object.entries(negativeEmotions).filter(([_, value]) => value >= 4 && value < 6)

    if (highNegativeEmotions.length > 0) {
      score = Math.min(score, 25)
      score -= highNegativeEmotions.length * 10
    } else if (moderateNegativeEmotions.length > 0) {
      score = Math.min(score, 45)
      score -= moderateNegativeEmotions.length * 8
    } else if (lowNegativeEmotions.length > 0) {
      score = Math.min(score, 65)
      score -= lowNegativeEmotions.length * 5
    }

    const lowerText = text.toLowerCase()

    // Crisis indicators
    const crisisIndicators = [
      "want to die",
      "kill myself",
      "end it",
      "can't go on",
      "hopeless",
      "worthless",
      "burden",
      "better off dead",
      "no point",
      "suicide",
    ]

    crisisIndicators.forEach((indicator) => {
      if (lowerText.includes(indicator)) {
        score = Math.min(score, 15)
      }
    })

    // Minimal response indicators (ok, mhm, etc.)
    const minimalResponses = ["ok", "okay", "mhm", "mm", "yeah", "yep", "sure", "fine", "whatever"]
    const isMinimalResponse = minimalResponses.some(
      (response) => lowerText.trim() === response || lowerText.trim() === response + ".",
    )

    if (isMinimalResponse && text.length < 10) {
      score -= 10 // Minimal responses often indicate withdrawal or overwhelm
    }

    // Other text analysis...
    const numbnessPhrases = [
      "feel nothing",
      "don't feel",
      "can't feel",
      "numb",
      "empty",
      "void",
      "don't care",
      "doesn't matter",
    ]

    numbnessPhrases.forEach((phrase) => {
      if (lowerText.includes(phrase)) {
        score -= 8
      }
    })

    const positiveIndicators = [
      "grateful",
      "happy",
      "excited",
      "hopeful",
      "better",
      "improving",
      "good day",
      "feeling well",
      "positive",
      "optimistic",
    ]

    if (highNegativeEmotions.length === 0) {
      positiveIndicators.forEach((indicator) => {
        if (lowerText.includes(indicator)) {
          score += 5
        }
      })
    }

    return Math.max(5, Math.min(100, Math.round(score)))
  }

  const detectEmotionalFlags = (text: string, score: number): string[] => {
    const flags: string[] = []
    const lowerText = text.toLowerCase()

    const negativeEmotions = {
      sadness: emotions.sadness,
      fear: emotions.fear,
      anger: emotions.anger,
      disgust: emotions.disgust,
    }

    const criticalEmotions = Object.entries(negativeEmotions).filter(([_, value]) => value >= 8)
    const highEmotions = Object.entries(negativeEmotions).filter(([_, value]) => value >= 6 && value < 8)

    if (criticalEmotions.length > 0) {
      flags.push("Critical Instability")
      criticalEmotions.forEach(([emotion, value]) => {
        flags.push(`High ${emotion.charAt(0).toUpperCase() + emotion.slice(1)} (${value}/10)`)
      })
    } else if (highEmotions.length > 0) {
      flags.push("High Instability")
    }

    // Check for minimal responses
    const minimalResponses = ["ok", "okay", "mhm", "mm", "yeah", "yep", "sure", "fine", "whatever"]
    const isMinimalResponse = minimalResponses.some(
      (response) => lowerText.trim() === response || lowerText.trim() === response + ".",
    )

    if (isMinimalResponse && text.length < 10) {
      flags.push("Minimal Response - Possible Withdrawal")
    }

    // Text-based flags
    if (lowerText.includes("numb") || lowerText.includes("empty") || lowerText.includes("feel nothing")) {
      flags.push("Emotional Numbness")
    }

    if (lowerText.includes("unreal") || lowerText.includes("floating") || lowerText.includes("watching myself")) {
      flags.push("Dissociation Signs")
    }

    if ((lowerText.includes("fine") || lowerText.includes("okay")) && text.length < 20) {
      flags.push("Possible Emotional Masking")
    }

    if (lowerText.includes("don't care") || lowerText.includes("whatever") || lowerText.includes("doesn't matter")) {
      flags.push("Emotional Detachment")
    }

    // Crisis indicators
    const crisisKeywords = ["want to die", "kill myself", "end it", "hopeless", "worthless", "suicide"]
    if (crisisKeywords.some((keyword) => lowerText.includes(keyword))) {
      flags.push("Crisis Risk - Immediate Support Needed")
    }

    return flags
  }

  const activateCrisisMode = () => {
    setIsInCrisisMode(true)
    const crisisMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "I notice you might be going through a particularly difficult time right now. I want you to know that you're not alone, and your feelings are valid. Let's take this one moment at a time. Are you in a safe place right now?",
      timestamp: new Date(),
      type: "crisis",
    }
    setMessages((prev) => [...prev, crisisMessage])
  }

  const deactivateCrisisMode = () => {
    setIsInCrisisMode(false)
    const recoveryMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "I'm glad to see you're feeling a bit more stable. That takes strength. How are you doing right now?",
      timestamp: new Date(),
      type: "support",
    }
    setMessages((prev) => [...prev, recoveryMessage])
  }

  const getGroundingTechnique = (): { content: string; type: "grounding" | "breathing" | "music" } => {
    const techniques = [
      {
        content:
          "Let's try the 5-4-3-2-1 grounding technique together. Can you name:\n• 5 things you can see around you\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste\n\nTake your time with each one.",
        type: "grounding" as const,
      },
      {
        content:
          "Let's focus on your breathing together. Take a slow, deep breath in through your nose for 4 counts... hold it for 4... now breathe out through your mouth for 6 counts. Feel your shoulders drop and your body relax. You're doing great. 🌸",
        type: "breathing" as const,
      },
      {
        content:
          "I want you to place both hands on your chest and feel your heartbeat. You're here, you're alive, and that matters. Now try humming the tune of your favorite song - it doesn't matter which one. The vibration in your chest can be very calming. 🎵",
        type: "music" as const,
      },
    ]

    return techniques[Math.floor(Math.random() * techniques.length)]
  }

  const generateContextAwareResponse = async (userMessage: string, stabilityScore: number): Promise<Message> => {
    const lowerMessage = userMessage.toLowerCase().trim()

    // Extract and store personal information
    const updatedContext = extractPersonalInfo(userMessage)

    // Handle minimal responses with empathy and curiosity
    const minimalResponses = ["ok", "okay", "mhm", "mm", "yeah", "yep", "sure", "fine", "whatever"]
    const isMinimalResponse = minimalResponses.some(
      (response) => lowerMessage === response || lowerMessage === response + ".",
    )

    if (isMinimalResponse) {
      const minimalResponseTexts = [
        `I notice you said "${userMessage.trim()}" - sometimes when we're feeling a lot, it's hard to find the words. That's completely okay. What's going on for you right now?`,
        `"${userMessage.trim()}" - I hear you. Sometimes we don't have much to say, and that's valid too. Are you feeling overwhelmed, or maybe just processing things?`,
        `I see you responded with "${userMessage.trim()}". Sometimes that can mean we're taking things in, or maybe feeling a bit stuck. What's happening in your world right now?`,
        `"${userMessage.trim()}" - I'm here with you. Sometimes the simplest responses carry the most weight. What would feel helpful to talk about right now?`,
      ]

      // Add personal context if available
      let responseText = minimalResponseTexts[Math.floor(Math.random() * minimalResponseTexts.length)]

      if (updatedContext.previousTopics && updatedContext.previousTopics.length > 0) {
        const lastTopic = updatedContext.previousTopics[updatedContext.previousTopics.length - 1]
        responseText += ` We were talking about ${lastTopic} earlier - is that still on your mind?`
      }

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
        type: "reflection",
      }
    }

    // Handle personal information acknowledgment
    if (updatedContext.name && !personalContext.name) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: `Thank you for sharing your name with me, ${updatedContext.name}. It's nice to meet you. I want you to know that I'll remember the things you tell me so I can better support you. What brought you here today?`,
        timestamp: new Date(),
        type: "empathy",
      }
    }

    if (updatedContext.job && !personalContext.job) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: `I see you work as ${updatedContext.job}. That's interesting - how do you find that work affects your emotional well-being? Does it energize you or drain you most days?`,
        timestamp: new Date(),
        type: "reflection",
      }
    }

    // Enhanced contextual responses with personal details
    if (lowerMessage.includes("work") || lowerMessage.includes("job")) {
      let response = "I can hear that work is weighing on you. "
      if (personalContext.job) {
        response += `Being ${personalContext.job} can be challenging. `
      }
      response += "Can you tell me more about what's happening at work that's bothering you?"

      if (stabilityScore < 40) {
        const technique = getGroundingTechnique()
        response += ` Since you're feeling quite overwhelmed, let's also try this: ${technique.content}`
        return {
          id: Date.now().toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
          type: technique.type,
        }
      }

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: "reflection",
      }
    }

    // Relationship context
    if (
      lowerMessage.includes("relationship") ||
      lowerMessage.includes("partner") ||
      lowerMessage.includes("boyfriend") ||
      lowerMessage.includes("girlfriend")
    ) {
      let response = "Relationships can bring up so many complex emotions. "
      if (personalContext.relationships && personalContext.relationships.length > 0) {
        response += `I remember you mentioned your ${personalContext.relationships[0]}. `
      }
      response +=
        "It sounds like there's something going on in your relationship that's affecting you. Would you feel comfortable sharing more about what's happening?"

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: "empathy",
      }
    }

    // Crisis mode responses
    if (isInCrisisMode || stabilityScore <= therapySettings.crisisThreshold) {
      return generateCrisisResponse(userMessage, stabilityScore)
    }

    // Try API call for sophisticated responses
    try {
      const response = await fetch("/api/mental-health-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          stabilityScore,
          therapySettings,
          recentMessages: messages.slice(-3),
          isInCrisisMode,
          personalContext: updatedContext,
        }),
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        if (reader) {
          let fullResponse = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = new TextDecoder().decode(value)
            fullResponse += chunk
          }

          return {
            id: Date.now().toString(),
            role: "assistant",
            content: fullResponse,
            timestamp: new Date(),
            type: "empathy",
          }
        }
      }
    } catch (error) {
      console.log("API call failed, using fallback")
    }

    // Enhanced fallback with personal context
    return generatePersonalizedFallback(userMessage, stabilityScore, updatedContext)
  }

  const generateCrisisResponse = (userMessage: string, stabilityScore: number): Message => {
    const lowerMessage = userMessage.toLowerCase()

    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("overwhelm") ||
      lowerMessage.includes("panic") ||
      stabilityScore < 20
    ) {
      const technique = getGroundingTechnique()
      let response = "I can hear that you're in a lot of pain right now. "
      if (personalContext.name) {
        response = `${personalContext.name}, I can hear that you're in a lot of pain right now. `
      }
      response += `Let's focus on this moment and getting you grounded. ${technique.content}`

      return {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: technique.type,
      }
    }

    const crisisResponses = [
      {
        content: personalContext.name
          ? `${personalContext.name}, I can hear that you're in a lot of pain right now. Your feelings are valid, and you don't have to go through this alone. Can you tell me if you're in a safe place? Let's take some deep breaths together - in for 4, hold for 4, out for 6.`
          : "I can hear that you're in a lot of pain right now. Your feelings are valid, and you don't have to go through this alone. Can you tell me if you're in a safe place? Let's take some deep breaths together - in for 4, hold for 4, out for 6.",
        type: "breathing" as const,
      },
      {
        content:
          "Thank you for sharing that with me. It takes courage to express these feelings. Right now, let's focus on keeping you safe. Try placing your hand on your chest and humming any tune that comes to mind - even 'Happy Birthday' works. The vibration can be very calming. 🎵",
        type: "music" as const,
      },
    ]

    const response = crisisResponses[Math.floor(Math.random() * crisisResponses.length)]
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      type: response.type,
    }
  }

  const generatePersonalizedFallback = (
    userMessage: string,
    stabilityScore: number,
    context: PersonalContext,
  ): Message => {
    let response = ""

    if (context.name) {
      response += `${context.name}, `
    }

    if (stabilityScore < 50) {
      const supportiveResponses = [
        "you're being really brave by talking about this. How can I best support you right now?",
        "it sounds like you're carrying a lot. What would feel most helpful in this moment?",
        "I appreciate you trusting me with this. What do you need most right now?",
      ]
      response += supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)]
    } else {
      const reflectiveResponses = [
        "I hear what you're saying. Can you tell me more about that feeling?",
        "that sounds really important to you. What's that experience like?",
        "thank you for sharing that with me. What comes up for you when you think about it?",
      ]
      response += reflectiveResponses[Math.floor(Math.random() * reflectiveResponses.length)]
    }

    // Add context-specific follow-up
    if (context.previousTopics && context.previousTopics.length > 0) {
      const recentTopic = context.previousTopics[context.previousTopics.length - 1]
      response += ` I notice we've talked about ${recentTopic} before - is this connected to that?`
    }

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
      type: stabilityScore < 50 ? "support" : "reflection",
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    const stabilityScore = calculateStabilityScore(message)
    const flags = detectEmotionalFlags(message, stabilityScore)

    setCurrentStabilityScore(stabilityScore)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
      stabilityScore,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Add to journal if in journal mode
    if (isJournalMode) {
      const journalEntry: JournalEntry = {
        id: Date.now().toString(),
        content: message,
        timestamp: new Date(),
        stabilityScore,
        emotionalState: analysis?.dominantEmotion || "Unknown",
        detectedFlags: flags,
      }
      setJournalEntries((prev) => [...prev, journalEntry])
    }

    setTimeout(
      async () => {
        const response = await generateContextAwareResponse(message, stabilityScore)
        setMessages((prev) => [...prev, response])
        setIsTyping(false)
      },
      1000 + Math.random() * 1500,
    )
  }

  const getStabilityColor = (score: number) => {
    if (score >= 70) return "text-green-400"
    if (score >= 50) return "text-yellow-400"
    if (score >= 35) return "text-orange-400"
    return "text-red-400"
  }

  const getStabilityBgColor = (score: number) => {
    if (score >= 70) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    if (score >= 35) return "bg-orange-500"
    return "bg-red-500"
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "crisis":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "grounding":
        return <Shield className="h-4 w-4 text-blue-400" />
      case "breathing":
        return <Wind className="h-4 w-4 text-cyan-400" />
      case "music":
        return <Music className="h-4 w-4 text-purple-400" />
      case "reflection":
        return <Heart className="h-4 w-4 text-purple-400" />
      case "support":
        return <Heart className="h-4 w-4 text-green-400" />
      default:
        return <Bot className="h-4 w-4 text-blue-400" />
    }
  }

  const getInterfaceColor = () => {
    if (isInCrisisMode) return "from-red-500/20 to-red-600/20 border-red-500/30"
    if (currentStabilityScore < 50) return "from-amber-500/20 to-amber-600/20 border-amber-500/30"
    return "from-blue-500/20 to-purple-600/20 border-blue-500/30"
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="flex flex-col gap-2 items-end">
            {/* Quick Journal Button */}
            <Button
              onClick={() => {
                setIsJournalMode(true)
                setIsOpen(true)
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg transition-all duration-300 hover:scale-110"
              size="icon"
            >
              <BookOpen className="h-5 w-5 text-white" />
            </Button>

            {/* Main Chat Button */}
            <Button
              onClick={() => setIsOpen(true)}
              className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
                isInCrisisMode
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
              size="icon"
            >
              <MessageCircle className="h-6 w-6 text-white" />
              {isInCrisisMode && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] animate-in slide-in-from-bottom-4 duration-300">
          <Card
            className={`h-full bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl ${getInterfaceColor()}`}
          >
            <CardHeader className={`pb-3 bg-gradient-to-r ${getInterfaceColor()} border-b border-slate-700`}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                      isInCrisisMode ? "from-red-500 to-red-600" : "from-blue-500 to-purple-600"
                    } flex items-center justify-center`}
                  >
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  Mental Health Support
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${isInCrisisMode ? "bg-red-400" : "bg-green-400"}`}
                  ></div>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTrends(!showTrends)}
                    className="text-slate-400 hover:text-slate-100"
                  >
                    {currentStabilityScore >= 70 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : currentStabilityScore >= 35 ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPersonalization(!showPersonalization)}
                    className="text-slate-400 hover:text-slate-100"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stability Score Display */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Mental Stability</span>
                  <span className={`font-bold ${getStabilityColor(currentStabilityScore)}`}>
                    {currentStabilityScore}/100
                  </span>
                </div>
                <Progress value={currentStabilityScore} className="h-2" />
                {isInCrisisMode && (
                  <Badge variant="destructive" className="text-xs">
                    Crisis Support Active
                  </Badge>
                )}
                {personalContext.name && (
                  <div className="text-xs text-slate-400">Chatting with {personalContext.name}</div>
                )}
              </div>
            </CardHeader>

            {/* Personalization Panel */}
            {showPersonalization && (
              <TherapyPersonalizationPanel
                settings={therapySettings}
                onSettingsChange={setTherapySettings}
                onClose={() => setShowPersonalization(false)}
              />
            )}

            {/* Trends Panel */}
            {showTrends && <EmotionalTrendChart journalEntries={journalEntries} onClose={() => setShowTrends(false)} />}

            <CardContent className="flex-1 flex flex-col p-0 h-[calc(100%-140px)]">
              <ScrollArea className="flex-1 px-4 py-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${getInterfaceColor()} flex items-center justify-center border border-slate-600`}
                        >
                          {getMessageIcon(message.type)}
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : `bg-slate-800/80 text-slate-100 border border-slate-700 ${
                                message.type === "crisis"
                                  ? "border-red-500/50 bg-red-900/20"
                                  : message.type === "breathing"
                                    ? "border-cyan-500/50 bg-cyan-900/20"
                                    : message.type === "music"
                                      ? "border-purple-500/50 bg-purple-900/20"
                                      : ""
                              }`
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-60">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          {message.stabilityScore && (
                            <span className={`text-xs font-bold ${getStabilityColor(message.stabilityScore)}`}>
                              {message.stabilityScore}
                            </span>
                          )}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${getInterfaceColor()} flex items-center justify-center border border-slate-600`}
                      >
                        <Bot className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-slate-700">
                {isJournalMode && (
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Journal Mode
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsJournalMode(false)}
                      className="text-xs text-slate-400 hover:text-slate-100"
                    >
                      Switch to Chat
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  {isJournalMode ? (
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Write about your thoughts and feelings..."
                      disabled={isTyping}
                      className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 resize-none"
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        personalContext.name
                          ? `Share what's on your mind, ${personalContext.name}...`
                          : "Share what's on your mind..."
                      }
                      onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
                      disabled={isTyping}
                      className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
                    />
                  )}

                  <Button
                    size="icon"
                    onClick={() => sendMessage(input)}
                    disabled={isTyping || !input.trim()}
                    className={`${
                      isInCrisisMode
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
