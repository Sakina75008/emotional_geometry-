"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, Settings } from "lucide-react"
import type { AnalysisResult, EmotionData } from "@/app/page"
import { ChatbotSettings } from "@/components/chatbot-settings"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "empathy" | "celebration" | "support" | "coping"
}

interface ResponseStyle {
  warmth: number
  directness: number
  optimism: number
  formality: number
  sarcasmFilter: boolean
  personalityType: "therapist" | "friend" | "coach" | "mentor"
}

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
  previousTopics?: string[]
}

interface FloatingChatbotProps {
  analysis: AnalysisResult | null
  emotions: EmotionData
}

export function FloatingChatbot({ analysis, emotions }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [personalContext, setPersonalContext] = useState<PersonalContext>({})
  const [emotionHistory, setEmotionHistory] = useState<EmotionTrend[]>([])
  const [isInCrisisMode, setIsInCrisisMode] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [responseStyle, setResponseStyle] = useState<ResponseStyle>({
    warmth: 8,
    directness: 5,
    optimism: 6,
    formality: 3,
    sarcasmFilter: true,
    personalityType: "therapist",
  })

  // Load personal context from localStorage
  useEffect(() => {
    const savedContext = localStorage.getItem("chatbot-personal-context")
    const savedHistory = localStorage.getItem("chatbot-emotion-history")

    if (savedContext) {
      try {
        setPersonalContext(JSON.parse(savedContext))
      } catch (error) {
        console.error("Error loading personal context:", error)
      }
    }

    if (savedHistory) {
      try {
        setEmotionHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Error loading emotion history:", error)
      }
    }
  }, [])

  // Save to localStorage when context changes
  useEffect(() => {
    localStorage.setItem("chatbot-personal-context", JSON.stringify(personalContext))
  }, [personalContext])

  useEffect(() => {
    localStorage.setItem("chatbot-emotion-history", JSON.stringify(emotionHistory))
  }, [emotionHistory])

  // Update emotion history when analysis changes
  useEffect(() => {
    if (analysis && emotions) {
      const newTrend: EmotionTrend = {
        timestamp: Date.now(),
        emotions: emotions,
        dominantEmotion: analysis.dominantEmotion,
        stabilityIndex: analysis.stabilityIndex,
      }

      setEmotionHistory((prev) => [...prev.slice(-9), newTrend]) // Keep last 10 entries
    }
  }, [analysis, emotions])

  // Crisis mode detection
  useEffect(() => {
    if (!emotions) return

    const criticalEmotions = Object.entries(emotions).filter(
      ([emotion, value]) => ["sadness", "anger", "fear", "disgust"].includes(emotion) && value >= 8,
    )

    const shouldActivateCrisis = criticalEmotions.length > 0 || (analysis && analysis.mentalStability === "critical")

    setIsInCrisisMode(shouldActivateCrisis)
  }, [emotions, analysis])

  // Custom chat implementation without AI SDK
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          emotionData: emotions,
          emotionHistory,
          personalContext,
          isInCrisisMode,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Extract personal information from the conversation
      updatePersonalContext(userMessage.content)
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const updatePersonalContext = (messageContent: string) => {
    const lowerMessage = messageContent.toLowerCase()
    const newContext = { ...personalContext }
    let updated = false

    // Extract name
    const namePatterns = [/my name is (\w+)/i, /i'm (\w+)/i, /call me (\w+)/i, /i am (\w+)/i]

    namePatterns.forEach((pattern) => {
      const match = messageContent.match(pattern)
      if (match && match[1] && match[1].length > 1 && !newContext.name) {
        newContext.name = match[1].charAt(0).toUpperCase() + match[1].slice(1)
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
      const match = messageContent.match(pattern)
      if (match && match[1] && !newContext.job) {
        newContext.job = match[1].trim()
        updated = true
      }
    })

    // Extract interests
    if (lowerMessage.includes("i like") || lowerMessage.includes("i love") || lowerMessage.includes("i enjoy")) {
      const interestPatterns = [/i like (.+?)(?:\.|,|$)/i, /i love (.+?)(?:\.|,|$)/i, /i enjoy (.+?)(?:\.|,|$)/i]

      interestPatterns.forEach((pattern) => {
        const match = messageContent.match(pattern)
        if (match && match[1]) {
          if (!newContext.interests) newContext.interests = []
          const interest = match[1].trim()
          if (!newContext.interests.includes(interest)) {
            newContext.interests.push(interest)
            updated = true
          }
        }
      })
    }

    if (updated) {
      setPersonalContext(newContext)
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateContextualMessage = (analysis: AnalysisResult, emotions: EmotionData) => {
    const { dominantEmotion, stabilityIndex, curvatureLevel, mentalStability } = analysis

    // Critical mental state check
    if (mentalStability === "critical") {
      return {
        content: personalContext.name
          ? `${personalContext.name}, I notice you're going through a really tough time right now. Your emotional state shows high intensity in difficult emotions. Please know that you're not alone, and it's okay to reach out for professional support if you need it. Would you like to talk about what's troubling you? 💙`
          : "I notice you're going through a really tough time right now. Your emotional state shows high intensity in difficult emotions. Please know that you're not alone, and it's okay to reach out for professional support if you need it. Would you like to talk about what's troubling you? 💙",
        type: "support" as const,
      }
    }

    // High curvature check
    if (curvatureLevel > 0.6) {
      return {
        content:
          "It looks like you're feeling a bit emotionally overwhelmed right now. Want to try a calming exercise together? I'm here to help you find some peace. 🌸",
        type: "coping" as const,
      }
    }

    // Sadness dominant
    if (dominantEmotion === "Sadness") {
      return {
        content: personalContext.name
          ? `${personalContext.name}, I'm here for you. Sadness can feel heavy — would you like to talk or hear something soothing? Sometimes just sharing what's on your heart can help lighten the load. 💜`
          : "I'm here for you. Sadness can feel heavy — would you like to talk or hear something soothing? Sometimes just sharing what's on your heart can help lighten the load. 💜",
        type: "empathy" as const,
      }
    }

    // Joy and high stability
    if (dominantEmotion === "Joy" && stabilityIndex > 0.8) {
      return {
        content: personalContext.name
          ? `${personalContext.name}, you seem to be in a great emotional state today! Keep riding that wave ✨ Your positive energy is beautiful to see. What's bringing you such joy?`
          : "You seem to be in a great emotional state today! Keep riding that wave ✨ Your positive energy is beautiful to see. What's bringing you such joy?",
        type: "celebration" as const,
      }
    }

    // Fear dominant
    if (dominantEmotion === "Fear") {
      return {
        content:
          "I can sense that fear is weighing on you right now. Fear is our mind's way of trying to protect us, but sometimes it can feel overwhelming. You're safe here, and I'm here to support you through this. What's been on your mind? 🛡️",
        type: "empathy" as const,
      }
    }

    // Anger dominant
    if (dominantEmotion === "Anger") {
      return {
        content:
          "I can feel the intensity of your anger. These feelings are completely valid - anger often tells us that something important needs attention. Let's work through this together. What's been frustrating you? 🔥",
        type: "empathy" as const,
      }
    }

    // Default supportive message
    return {
      content: personalContext.name
        ? `Hello ${personalContext.name}! I can see you're experiencing ${dominantEmotion.toLowerCase()} as your primary emotion right now. I'm here to listen and support you through whatever you're feeling. How are you doing today? 🌟`
        : `Hello! I can see you're experiencing ${dominantEmotion.toLowerCase()} as your primary emotion right now. I'm here to listen and support you through whatever you're feeling. How are you doing today? 🌟`,
      type: "empathy" as const,
    }
  }

  const getInterfaceColor = () => {
    if (isInCrisisMode) return "from-red-500/20 to-red-600/20 border-red-500/30"
    if (analysis && analysis.stabilityIndex < 0.5) return "from-amber-500/20 to-amber-600/20 border-amber-500/30"
    return "from-blue-500/20 to-purple-600/20 border-blue-500/30"
  }

  const getPlaceholder = () => {
    if (personalContext.name) {
      return `Share what's on your mind, ${personalContext.name}...`
    }
    return "Share what's on your mind..."
  }

  // Initialize with contextual message when analysis is available
  useEffect(() => {
    if (analysis && emotions && messages.length === 0) {
      const initialMessage = generateContextualMessage(analysis, emotions)
      const botMessage: Message = {
        id: "initial",
        role: "assistant",
        content: initialMessage.content,
        timestamp: new Date(),
        type: initialMessage.type,
      }
      setMessages([botMessage])
    }
  }, [analysis, emotions])

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className={`w-16 h-16 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 ${
              isInCrisisMode
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            }`}
            size="icon"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            {analysis && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>}
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] animate-in slide-in-from-bottom-4 duration-300">
          <Card className="h-full bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl">
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
                  Emotional Support AI
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${isInCrisisMode ? "bg-red-400" : "bg-green-400"}`}
                  ></div>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
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

              {personalContext.name && (
                <div className="text-xs text-slate-400 mt-2">
                  Chatting with {personalContext.name}
                  {personalContext.job && ` • ${personalContext.job}`}
                </div>
              )}
            </CardHeader>

            {/* Settings Panel */}
            {showSettings && (
              <ChatbotSettings
                responseStyle={responseStyle}
                setResponseStyle={setResponseStyle}
                emotionHistory={emotionHistory}
              />
            )}

            <CardContent className="flex-1 flex flex-col p-0 h-[calc(100%-80px)]">
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
                          <Bot className="h-4 w-4 text-blue-400" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "bg-slate-800/80 text-slate-100 border border-slate-700"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-60 mt-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
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
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getPlaceholder()}
                    disabled={isLoading}
                    className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className={`${
                      isInCrisisMode
                        ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
