"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/patients")
      } else {
        router.push("/auth/login")
      }
    }
  }, [router, user, loading])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground font-arabic">جاري التحميل...</h1>
        <p className="text-muted-foreground mt-2">Loading...</p>
      </div>
    </div>
  )
}
