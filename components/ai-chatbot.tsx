"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

function AIChatbot() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Link
      href="/chatbot"
      className="group fixed bottom-6 right-6 z-50 dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden shadow-lg"
    >
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span className="inset-0 absolute pointer-events-none select-none">
          <span
            className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
            style={{
              background: "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
            }}
          ></span>
        </span>
      </span>

      <span
        className="inset-0 absolute pointer-events-none select-none"
        style={{
          animation: "border-glow-translate 10s ease-in-out infinite alternate",
        }}
      >
        <span
          className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full"
          style={{
            animation: "border-glow-scale 10s ease-in-out infinite alternate",
            background: "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
          }}
        ></span>
      </span>

      <span className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2 px-4 pl-2 w-full">
        <span className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500">
          <MessageSquare className="w-5 h-5 text-[#2D2D2D]" />
          <span
            className="rounded-full size-11 absolute opacity-0 dark:opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-lg"
            style={{
              animation: "star-shine 14s ease-in-out infinite alternate",
              background:
                "linear-gradient(135deg, rgb(59, 196, 242), rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
            }}
          ></span>
        </span>
        <span className="bg-gradient-to-b ml-1.5 dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-xs text-transparent group-hover:scale-105 transition transform-gpu">
          Let's Style Your Look Today!
        </span>
      </span>
    </Link>
  )
}

export default AIChatbot
