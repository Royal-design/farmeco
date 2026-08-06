"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
interface GoogleTokenResponse {
  access_token?: string
  error?: string
}

interface GoogleError {
  type: string
  message?: string
}

interface GoogleOAuth2 {
  initTokenClient: (config: {
    client_id: string
    scope: string
    callback: (response: GoogleTokenResponse) => void
    error_callback?: (error: GoogleError) => void
  }) => { requestAccessToken: () => void }
}

declare global {
  interface Window {
    google?: { accounts: { oauth2: GoogleOAuth2 } }
  }
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3a7.2 7.2 0 0 1-10.75-3.8H1.29v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.32 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.29a12 12 0 0 0 0 10.78l4.03-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8a6.5 6.5 0 0 1 4.6 1.8l3.45-3.45A11.52 11.52 0 0 0 12 0 12 12 0 0 0 1.29 6.61l4.03 3.1A7.2 7.2 0 0 1 12 4.8z"
      />
    </svg>
  )
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve()
      return
    }
    const src = "https://accounts.google.com/gsi/client"
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    )
    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google sign-in"))
      )
      return
    }
    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google sign-in"))
    document.head.appendChild(script)
  })
}

function GoogleSignInButton({ className }: { className?: string }) {
  const router = useRouter()
  const googleLogin = useAuthStore((state) => state.googleLogin)
  const status = useAuthStore((state) => state.status)
  const [loading, setLoading] = React.useState(false)

  const handleClick = async () => {
    if (!GOOGLE_CLIENT_ID) {
      toast.error("Google sign-in isn't configured")
      return
    }
    if (loading || status === "loading") {
      return
    }

    setLoading(true)
    try {
      await loadGoogleScript()

      const tokenClient = window.google!.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        callback: async (response) => {
          try {
            if (!response.access_token) {
              throw new Error("No access token returned")
            }
            await googleLogin(response.access_token)
            toast.success("Signed in with Google")
            const redirect = new URLSearchParams(
              window.location.search
            ).get("redirect")
            router.push(
              redirect && redirect.startsWith("/") ? redirect : "/account"
            )
            router.refresh()
          } catch {
            toast.error("Couldn't sign in with Google", {
              description: "Please try again in a moment.",
            })
          } finally {
            setLoading(false)
          }
        },
        error_callback: (error) => {
          setLoading(false)
          if (error.type !== "popup_closed") {
            toast.error("Google sign-in failed", {
              description: error.message ?? "Please try again.",
            })
          }
        },
      })

      tokenClient.requestAccessToken()
    } catch {
      setLoading(false)
      toast.error("Couldn't load Google sign-in", {
        description: "Please try again or use email instead.",
      })
    }
  }

  return (
    <>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn("w-full", className)}
        onClick={handleClick}
        disabled={loading || status === "loading"}
      >
        <GoogleIcon />
        {loading ? "Connecting…" : "Continue with Google"}
      </Button>
    </>
  )
}

export { GoogleSignInButton }
