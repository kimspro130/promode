"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  value?: string
}

export function AccordionItem({ title, children, defaultOpen = false, className, value }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn("border-b border-gray-700", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-primary"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="pb-4 pt-0 text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}

export function Accordion({
  children,
  className,
  type,
  collapsible,
}: {
  children: React.ReactNode
  className?: string
  type?: string
  collapsible?: boolean
}) {
  return <div className={cn("space-y-1", className)}>{children}</div>
}

// Add these exports to maintain compatibility with any existing code
export const AccordionTrigger = ({ children }: { children: React.ReactNode }) => children
export const AccordionContent = ({ children }: { children: React.ReactNode }) => children
