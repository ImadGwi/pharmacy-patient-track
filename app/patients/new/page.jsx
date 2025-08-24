"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth-guard"
import { useLanguage } from "@/components/providers/language-provider"
import { Save, ArrowRight } from "lucide-react"

export default function NewPatientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    // General Information
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    primaryPhysician: "",
    specialists: "",

    // Medical History
    chronicConditions: "",
    allergies: "",
    familyHistory: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const patientData = {
        general: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          phone: formData.phone,
          primaryPhysician: formData.primaryPhysician,
          specialists: formData.specialists
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
        },
        medical: {
          chronicConditions: formData.chronicConditions
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
          allergies: formData.allergies
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
          familyHistory: formData.familyHistory
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
        },
      }

      console.log("[v0] Submitting patient data:", patientData)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create patient")
      }

      const newPatient = await response.json()
      console.log("[v0] Patient created successfully:", newPatient)

      router.replace("/patients")
    } catch (error) {
      if (error.name === "AbortError") {
        alert(
          language === "ar"
            ? "انتهت مهلة الطلب - يرجى المحاولة مرة أخرى"
            : "Délai d'attente dépassé - veuillez réessayer",
        )
      } else {
        console.error("[v0] Error creating patient:", error)
        alert(language === "ar" ? "خطأ في إنشاء المريض" : "Erreur lors de la création du patient")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
        <Sidebar />

        <div className="flex-1 md:mr-64">
          <Header title={t("newPatient")} titleEn="New Patient" />

          <main className="p-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
              {/* General Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">
                    {language === "ar" ? "المعلومات الشخصية" : "Informations personnelles"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-arabic">
                        {language === "ar" ? "الاسم الأول" : "Prénom"}
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="font-arabic"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-arabic">
                        {language === "ar" ? "اسم العائلة" : "Nom de famille"}
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="font-arabic"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="font-arabic">
                        {language === "ar" ? "تاريخ الميلاد" : "Date de naissance"}
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-arabic">
                        {language === "ar" ? "رقم الهاتف" : "Téléphone"}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="font-arabic"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryPhysician" className="font-arabic">
                        {language === "ar" ? "الطبيب المعالج" : "Médecin traitant"}
                      </Label>
                      <Input
                        id="primaryPhysician"
                        value={formData.primaryPhysician}
                        onChange={(e) => handleInputChange("primaryPhysician", e.target.value)}
                        className="font-arabic"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialists" className="font-arabic">
                        {language === "ar" ? "الأطباء المختصون" : "Spécialistes"}
                      </Label>
                      <Input
                        id="specialists"
                        value={formData.specialists}
                        onChange={(e) => handleInputChange("specialists", e.target.value)}
                        className="font-arabic"
                        placeholder={language === "ar" ? "مفصولة بفاصلة" : "Séparés par des virgules"}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-arabic">
                    {language === "ar" ? "التاريخ المرضي" : "Antécédents médicaux"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chronicConditions" className="font-arabic">
                      {language === "ar" ? "الأمراض المزمنة الرئيسية" : "Pathologies chroniques principales"}
                    </Label>
                    <Textarea
                      id="chronicConditions"
                      value={formData.chronicConditions}
                      onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                      className="font-arabic"
                      rows={3}
                      placeholder={language === "ar" ? "مفصولة بفاصلة" : "Séparées par des virgules"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="font-arabic">
                      {language === "ar" ? "الحساسية المعروفة" : "Allergies connues"}
                    </Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      className="font-arabic"
                      rows={3}
                      placeholder={language === "ar" ? "مفصولة بفاصلة" : "Séparées par des virgules"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyHistory" className="font-arabic">
                      {language === "ar" ? "التاريخ العائلي" : "Antécédents familiaux"}
                    </Label>
                    <Textarea
                      id="familyHistory"
                      value={formData.familyHistory}
                      onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                      className="font-arabic"
                      rows={3}
                      placeholder={language === "ar" ? "مفصولة بفاصلة" : "Séparées par des virgules"}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                  <ArrowRight className="h-4 w-4 ml-2" />
                  <span className="font-arabic">{language === "ar" ? "إلغاء" : "Annuler"}</span>
                </Button>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span className="font-arabic">{language === "ar" ? "جاري الحفظ..." : "Enregistrement..."}</span>
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 ml-2" />
                      <span className="font-arabic">{language === "ar" ? "حفظ المريض" : "Enregistrer le patient"}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
