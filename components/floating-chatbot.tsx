"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, Heart, Sparkles } from "lucide-react"
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

interface FloatingChatbotProps {
  analysis: AnalysisResult | null
  emotions: EmotionData
}

export function FloatingChatbot({ analysis, emotions }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [responseStyle, setResponseStyle] = useState<ResponseStyle>({
    warmth: 8,
    directness: 5,
    optimism: 6,
    formality: 3,
    sarcasmFilter: true,
    personalityType: "therapist",
  })

  const [emotionHistory, setEmotionHistory] = useState<EmotionTrend[]>([])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (analysis && emotions) {
      // Add to emotion history
      const newTrend: EmotionTrend = {
        timestamp: Date.now(),
        emotions: emotions,
        dominantEmotion: analysis.dominantEmotion,
        stabilityIndex: analysis.stabilityIndex,
      }

      setEmotionHistory((prev) => [...prev.slice(-9), newTrend]) // Keep last 10 entries

      if (messages.length === 0) {
        const initialMessage = generateContextualMessage(analysis, emotions)
        setMessages([
          {
            id: Date.now().toString(),
            role: "assistant",
            content: initialMessage.content,
            timestamp: new Date(),
            type: initialMessage.type,
          },
        ])
      }
    }
  }, [analysis, emotions])

  const generateContextualMessage = (analysis: AnalysisResult, emotions: EmotionData) => {
    const { dominantEmotion, stabilityIndex, curvatureLevel, mentalStability } = analysis

    // Critical mental state check
    if (mentalStability === "critical") {
      return {
        content:
          "I notice you're going through a really tough time right now. Your emotional state shows high intensity in difficult emotions. Please know that you're not alone, and it's okay to reach out for professional support if you need it. Would you like to talk about what's troubling you? 💙",
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
        content:
          "I'm here for you. Sadness can feel heavy — would you like to talk or hear something soothing? Sometimes just sharing what's on your heart can help lighten the load. 💜",
        type: "empathy" as const,
      }
    }

    // Joy and high stability
    if (dominantEmotion === "Joy" && stabilityIndex > 0.8) {
      return {
        content:
          "You seem to be in a great emotional state today! Keep riding that wave ✨ Your positive energy is beautiful to see. What's bringing you such joy?",
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
      content: `Hello! I can see you're experiencing ${dominantEmotion.toLowerCase()} as your primary emotion right now. I'm here to listen and support you through whatever you're feeling. How are you doing today? 🌟`,
      type: "empathy" as const,
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(
      async () => {
        const response = await generateAIResponse(message, analysis, emotions)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.content,
            timestamp: new Date(),
            type: response.type,
          },
        ])
        setIsTyping(false)
      },
      1000 + Math.random() * 1500,
    )
  }

  const generateAIResponse = async (userMessage: string, analysis: AnalysisResult | null, emotions: EmotionData) => {
    const lowerMessage = userMessage.toLowerCase()

    if (!analysis) {
      return {
        content:
          "I'd love to help you better! Please run an emotional analysis first so I can provide more personalized support based on your current state. 💙",
        type: "support" as const,
      }
    }

    // Try to call GPT-4 API for more sophisticated responses
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.slice(-5), // Send last 5 messages for context
          emotionData: emotions,
          emotionHistory: emotionHistory,
          responseStyle: responseStyle,
          traumaIndicators: null, // Could be enhanced with trauma detection
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
            content: fullResponse,
            type: "empathy" as const,
          }
        }
      }
    } catch (error) {
      console.log("API call failed, using fallback responses")
    }

    // Fallback responses
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return {
        content:
          "I'm here to support you. Based on your emotional state, I can offer some gentle suggestions. Would you like to try some breathing exercises, or would you prefer to talk about what's on your mind? 🤗",
        type: "support" as const,
      }
    }

    if (lowerMessage.includes("calm") || lowerMessage.includes("relax")) {
      return {
        content:
          "Let's try a simple breathing exercise together. Breathe in slowly for 4 counts... hold for 4... and breathe out for 6. Feel your shoulders relax. You're doing great. 🌸",
        type: "coping" as const,
      }
    }

    if (lowerMessage.includes("sad") || lowerMessage.includes("down")) {
      return {
        content:
          "I hear you, and I want you to know that your feelings are completely valid. Sadness is a natural part of the human experience. Sometimes it helps to remember that this feeling, like all feelings, will pass. What's been weighing on your heart? 💜",
        type: "empathy" as const,
      }
    }

    if (lowerMessage.includes("anxious") || lowerMessage.includes("worried")) {
      return {
        content:
          "Anxiety can feel so overwhelming. Let's ground ourselves together. Can you name 5 things you can see around you right now? This can help bring you back to the present moment. You're safe. 🛡️",
        type: "coping" as const,
      }
    }

    // Default empathetic response
    return {
      content: `I can sense you're working through some feelings right now. With ${analysis.dominantEmotion.toLowerCase()} being your primary emotion, it's important to be gentle with yourself. What would feel most helpful right now - talking through your feelings or trying some calming techniques? 🌟`,
      type: "empathy" as const,
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "empathy":
        return <Heart className="h-4 w-4 text-pink-400" />
      case "celebration":
        return <Sparkles className="h-4 w-4 text-yellow-400" />
      case "support":
        return <Bot className="h-4 w-4 text-blue-400" />
      case "coping":
        return <Heart className="h-4 w-4 text-green-400" />
      default:
        return <Bot className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110"
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
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  Emotional Support AI
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <ChatbotSettings
                    responseStyle={responseStyle}
                    setResponseStyle={setResponseStyle}
                    emotionHistory={emotionHistory}
                  />
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
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 h-[calc(100%-80px)]">
              <ScrollArea className="flex-1 px-4 py-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-slate-600">
                          {getMessageIcon(message.type)}
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "bg-slate-800/80 text-slate-100 border border-slate-700"
                        }`}
                      >
                        <p className="leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-60 mt-2">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
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
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-slate-600">
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
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Share how you're feeling..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
                    disabled={isTyping}
                    className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500"
                  />
                  <Button
                    size="icon"
                    onClick={() => sendMessage(input)}
                    disabled={isTyping || !input.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
