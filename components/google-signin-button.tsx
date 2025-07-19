"use client"

import { useEffect, useRef } from "react"
import { loadGoogleScript, GOOGLE_CLIENT_ID } from "@/lib/google-auth"

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void
  onError?: (error: Error) => void
  text?: "signin_with" | "signup_with" | "continue_with" | "signin" | undefined
  className?: string
}

export function GoogleSignInButton({ onSuccess, onError, text = "continue_with", className }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeGoogleButton = async () => {
      try {
        await loadGoogleScript()

        if (window.google && buttonRef.current) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => {
              if (response.credential) {
                onSuccess(response.credential)
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          })

          window.google.accounts.id.renderButton(buttonRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text,
            width: buttonRef.current.clientWidth,
            logo_alignment: "center",
          })
        }
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error)
        onError?.(error as Error)
      }
    }

    initializeGoogleButton()

    return () => {
      // Clean up if needed
    }
  }, [onSuccess, onError, text])

  return <div ref={buttonRef} className={className} />
}
