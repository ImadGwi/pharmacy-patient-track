"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function Header({ title, titleEn }) {
  const [language, setLanguage] = useState("ar")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "fr" : "ar"))
    // In a real app, this would update the global language state
  }

  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">{language === "ar" ? title : titleEn}</h1>
        </div>

        <Button variant="outline" size="sm" onClick={toggleLanguage} className="flex items-center gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          <span>{language === "ar" ? "Français" : "العربية"}</span>
        </Button>
      </div>
    </header>
  )
}
