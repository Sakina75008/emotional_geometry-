"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Heart, Lightbulb, MessageCircle } from "lucide-react"
import type { AnalysisResult, EmotionData } from "@/app/page"
import { generateEmpatheticResponse, generateAdvice } from "@/lib/chatbot-responses"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "empathy" | "advice" | "general"
}

interface EmotionalChatbotProps {
  analysis: AnalysisResult | null
  emotions: EmotionData
  messages: Message[]
  setMessages: (messages: Message[]) => void
}

export function EmotionalChatbot({ analysis, emotions, messages, setMessages }: EmotionalChatbotProps) {
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (message: string, type: "user" | "auto" = "user") => {
    if (!message.trim() && type === "user") return

    const newMessage: Message = {
      role: type === "user" ? "user" : "assistant",
      content: message,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])

    if (type === "user") {
      setInput("")
      setIsTyping(true)

      // Simulate AI response delay
      setTimeout(
        () => {
          const response = generateResponse(message)
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: response.content,
              timestamp: new Date(),
              type: response.type,
            },
          ])
          setIsTyping(false)
        },
        1000 + Math.random() * 1000,
      )
    }
  }

  const generateResponse = (userMessage: string): { content: string; type: "empathy" | "advice" | "general" } => {
    if (!analysis) {
      return {
        content:
          "I'd love to help you understand your emotional state better. Please run an analysis first so I can provide personalized insights and support.",
        type: "general",
      }
    }

    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("help") || lowerMessage.includes("advice") || lowerMessage.includes("what should i do")) {
      return {
        content: generateAdvice(analysis, emotions),
        type: "advice",
      }
    }

    if (
      lowerMessage.includes("feel") ||
      lowerMessage.includes("emotion") ||
      lowerMessage.includes("sad") ||
      lowerMessage.includes("angry") ||
      lowerMessage.includes("anxious") ||
      lowerMessage.includes("stressed")
    ) {
      return {
        content: generateEmpatheticResponse(analysis, emotions),
        type: "empathy",
      }
    }

    // Default response based on current emotional state
    return {
      content: generateEmpatheticResponse(analysis, emotions),
      type: "empathy",
    }
  }

  const sendQuickResponse = (type: "empathy" | "advice" | "analysis") => {
    if (!analysis) return

    let response = ""
    let responseType: "empathy" | "advice" | "general" = "general"

    switch (type) {
      case "empathy":
        response = generateEmpatheticResponse(analysis, emotions)
        responseType = "empathy"
        break
      case "advice":
        response = generateAdvice(analysis, emotions)
        responseType = "advice"
        break
      case "analysis":
        response = `Based on your emotional analysis, you're experiencing ${analysis.dominantEmotion.toLowerCase()} as your primary emotion with a stability index of ${(analysis.stabilityIndex * 100).toFixed(1)}%. Your emotional state is classified as ${analysis.classification.toLowerCase()}. ${analysis.biometricFlags.length > 0 ? `I also notice some physiological indicators: ${analysis.biometricFlags.join(", ")}.` : ""}`
        responseType = "general"
        break
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: responseType,
      },
    ])
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "empathy":
        return <Heart className="h-4 w-4 text-pink-500" />
      case "advice":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      default:
        return <Bot className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Emotional Support AI
        </CardTitle>
        <CardDescription>I'm here to help you understand and navigate your emotional state</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Hello! I'm your emotional support AI.</p>
                <p className="text-xs mt-1">Run an analysis and I'll help you understand your emotional state.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    {getMessageIcon(message.type)}
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-500" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {analysis && (
          <div className="px-4 py-2 border-t">
            <div className="flex gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={() => sendQuickResponse("empathy")} className="text-xs">
                <Heart className="h-3 w-3 mr-1" />
                Comfort
              </Button>
              <Button size="sm" variant="outline" onClick={() => sendQuickResponse("advice")} className="text-xs">
                <Lightbulb className="h-3 w-3 mr-1" />
                Advice
              </Button>
            </div>
          </div>
        )}

        <div className="px-4 pb-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share how you're feeling..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
              disabled={isTyping}
            />
            <Button size="icon" onClick={() => sendMessage(input)} disabled={isTyping || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
