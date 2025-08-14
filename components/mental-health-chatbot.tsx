"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Settings, User, Bot } from "lucide-react"
import type { AnalysisResult, EmotionData } from "@/app/page"
import { ChatbotSettings } from "./chatbot-settings"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface MentalHealthChatbotProps {
  analysis: AnalysisResult | null
  emotions: EmotionData | null
}

interface PersonalContext {
  name?: string
  job?: string
  relationships?: string[]
  interests?: string[]
  previousTopics?: string[]
  lastInteraction?: string
}

export function MentalHealthChatbot({ analysis, emotions }: MentalHealthChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [personalContext, setPersonalContext] = useState<PersonalContext>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("chatbot-personal-context")
    if (saved) {
      try {
        setPersonalContext(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading personal context:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("chatbot-personal-context", JSON.stringify(personalContext))
  }, [personalContext])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    if (messages.length === 0) {
      const initialMessage: Message = {
        id: "initial",
        role: "assistant",
        content: getInitialMessage(),
        timestamp: new Date(),
      }
      setMessages([initialMessage, userMessage])
    } else {
      setMessages((prev) => [...prev, userMessage])
    }

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
          personalContext,
          isInCrisisMode: analysis?.mentalStability === "critical",
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
    const newContext = { ...personalContext }
    let updated = false

    const namePatterns = [/my name is (\w+)/i, /i'm (\w+)/i, /call me (\w+)/i, /i am (\w+)/i]
    for (const pattern of namePatterns) {
      const match = messageContent.match(pattern)
      if (match && match[1] && !newContext.name) {
        newContext.name = match[1].charAt(0).toUpperCase() + match[1].slice(1)
        updated = true
        break
      }
    }

    const jobPatterns = [/i work as (?:a |an )?(\w+)/i, /my job is (\w+)/i, /i'm (?:a |an )?(\w+)/i]
    for (const pattern of jobPatterns) {
      const match = messageContent.match(pattern)
      if (match && match[1] && !["feeling", "doing", "going", "having"].includes(match[1]) && !newContext.job) {
        newContext.job = match[1]
        updated = true
        break
      }
    }

    const interestPatterns = [/i love (\w+)/i, /i enjoy (\w+)/i, /i like (\w+)/i, /my hobby is (\w+)/i]
    for (const pattern of interestPatterns) {
      const match = messageContent.match(pattern)
      if (match && match[1]) {
        if (!newContext.interests) newContext.interests = []
        if (!newContext.interests.includes(match[1])) {
          newContext.interests.push(match[1])
          updated = true
        }
      }
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

  const getGreeting = () => {
    if (personalContext.name) {
      return `Hi ${personalContext.name}! 💙`
    }
    return "Hi there! 💙"
  }

  const getPlaceholder = () => {
    if (personalContext.name) {
      return `How are you feeling today, ${personalContext.name}?`
    }
    return "How are you feeling today?"
  }

  const getEmotionalContext = () => {
    if (!analysis || !emotions) return ""

    const highEmotions = Object.entries(emotions)
      .filter(([_, value]) => value >= 6)
      .map(([emotion]) => emotion)

    if (highEmotions.length > 0) {
      return `I notice you're experiencing ${highEmotions.join(", ")}. `
    }

    return ""
  }

  const getInitialMessage = () => {
    const greeting = getGreeting()
    const emotionalContext = getEmotionalContext()

    if (analysis?.mentalStability === "critical") {
      return `${greeting} ${emotionalContext}I'm here to support you through this difficult time. How can I help you right now?`
    } else if (analysis?.mentalStability === "unstable") {
      return `${greeting} ${emotionalContext}I'm here to listen and support you. What's on your mind?`
    } else if (analysis?.dominantEmotion === "Joy") {
      return `${greeting} You seem to be in a positive emotional state today! I'd love to hear what's going well for you. ✨`
    }

    return `${greeting} ${emotionalContext}I'm here to listen and support you. How are you doing today?`
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    handleSubmit(e)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl transition-all duration-300 z-50 ${
          isOpen ? "scale-0" : "scale-100"
        } bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700`}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-96 h-[500px] transition-all duration-300 z-50 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <Card className="h-full bg-slate-800/95 border-slate-700 backdrop-blur-lg shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Mental Health Support
                {personalContext.name && (
                  <span className="text-sm font-normal text-slate-400">• {personalContext.name}</span>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  className="h-8 w-8 text-slate-400 hover:text-slate-200"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-full flex flex-col">
            {showSettings ? (
              <div className="flex-1 p-4">
                <ChatbotSettings onClose={() => setShowSettings(false)} />
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
                  <div className="space-y-4 pb-4">
                    {messages.length === 0 && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm p-3 max-w-[280px]">
                          <p className="text-slate-200 text-sm leading-relaxed">{getInitialMessage()}</p>
                        </div>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-500 to-pink-500"
                              : "bg-gradient-to-r from-blue-500 to-purple-600"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl p-3 max-w-[280px] ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-tr-sm"
                              : "bg-slate-700/50 rounded-tl-sm"
                          }`}
                        >
                          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm p-3">
                          <div className="flex items-center gap-1">
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

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700">
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={getPlaceholder()}
                      className="flex-1 bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-blue-500"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
