"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useTheme } from "@/components/providers/theme-provider"
import { useLanguage } from "@/components/providers/language-provider"
import { Sun, Moon, Globe } from "lucide-react"

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:mr-64">
        <Header title={t("settings")} />
        <main className="p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  {t("theme")}
                </CardTitle>
                <CardDescription>
                  {t("language") === "ar"
                    ? "اختر المظهر المفضل للتطبيق"
                    : "Choisissez l'apparence préférée de l'application"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-toggle" className="flex items-center gap-2">
                    {t("darkMode")}
                  </Label>
                  <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {theme === "dark" ? t("darkMode") : t("lightMode")}{" "}
                  {t("language") === "ar" ? "مفعل حالياً" : "actuellement activé"}
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t("language")}
                </CardTitle>
                <CardDescription>
                  {t("language") === "ar" ? "اختر لغة واجهة التطبيق" : "Choisissez la langue de l'interface"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("language")}</Label>
                  <Select value={language} onValueChange={changeLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">{t("arabic")}</SelectItem>
                      <SelectItem value="fr">{t("french")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("language") === "ar"
                    ? "سيتم تطبيق التغييرات فوراً"
                    : "Les modifications seront appliquées immédiatement"}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
