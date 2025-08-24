"use client"

export function Header({ title, titleEn }) {
  return (
    <header className="bg-background border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">{title}</h1>
        </div>
      </div>
    </header>
  )
}
