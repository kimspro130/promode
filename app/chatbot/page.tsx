"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Info, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm Style-GPT, your personal style assistant for PROMODE. How can I help you find the perfect thrifted piece today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  // This ensures hydration issues are avoided
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight
      const height = chatContainerRef.current.clientHeight
      const isNearBottom = chatContainerRef.current.scrollTop + height >= scrollHeight - 100

      if (isNearBottom || messages.length <= 1) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
      }
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Check if the query is related to fashion
      const fashionKeywords = ["outfit", "clothes", "style", "fashion", "recommend", "trend", "wear", "dress"]
      const isFashionQuery = fashionKeywords.some((keyword) => input.toLowerCase().includes(keyword))

      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          isFashionQuery,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Add AI response
      const aiMessage: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error:", error)

      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/50 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Style-GPT</h1>
              <p className="text-xs text-zinc-400">Your personal style assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowInfo(!showInfo)}>
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto mb-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 h-[calc(100vh-220px)]"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 ${message.role === "user" ? "flex justify-end" : "flex justify-start"}`}
              >
                <div className="flex gap-3 max-w-[80%]">
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-zinc-800 text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm md:text-base">{message.content}</div>
                    <div className="text-xs mt-1 opacity-70 text-right">{formatTime(message.timestamp)}</div>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-800 text-white">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div
                          className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-pink-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="relative">
            <Input
              type="text"
              placeholder="Ask about outfits, style advice, or fashion trends..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full py-6 px-4 bg-zinc-800 border-zinc-700 rounded-full pr-12 focus-visible:ring-purple-500"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1 top-1 h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Info Panel - Conditionally rendered on mobile, always visible on desktop */}
        <AnimatePresence>
          {(showInfo || window.innerWidth >= 768) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="md:w-80 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 p-4 md:p-6 space-y-6"
            >
              <div className="md:hidden flex justify-between items-center">
                <h2 className="font-semibold">About Daman-GPT</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowInfo(false)}>
                  Close
                </Button>
              </div>

              <div>
                <h3 className="font-medium text-purple-400 mb-2">How to use</h3>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex gap-2">
                    <span className="text-pink-400">•</span>
                    <span>Ask for outfit recommendations</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-400">•</span>
                    <span>Get styling advice for specific occasions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-400">•</span>
                    <span>Learn about current fashion trends</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-pink-400">•</span>
                    <span>Find items that match your style preferences</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-purple-400 mb-2">Example questions</h3>
                <div className="space-y-2">
                  {[
                    "What should I wear to a casual dinner?",
                    "How can I style a black t-shirt?",
                    "What are the trending colors this season?",
                    "Recommend outfits for a summer vacation",
                  ].map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                      onClick={() => {
                        setInput(question)
                        setShowInfo(false)
                      }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Style-GPT</h3>
                    <p className="text-xs text-zinc-400">Powered by AI</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400">
                  Style-GPT is your personal style assistant for PROMODE, designed to help you discover and refine your
                  fashion sense with our curated thrift collection.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
