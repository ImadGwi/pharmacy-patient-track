"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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

export default function EditPatientPage() {
  const params = useParams()
  const router = useRouter()
  const { t, language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    primaryPhysician: "",
    specialists: "",
    chronicConditions: "",
    allergies: "",
    familyHistory: "",
  })

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch(`/api/patients/${params.id}`)
        if (!response.ok) {
          throw new Error("Patient not found")
        }
        const patient = await response.json()

        setFormData({
          firstName: patient.general.firstName || "",
          lastName: patient.general.lastName || "",
          birthDate: patient.general.birthDate || "",
          phone: patient.general.phone || "",
          primaryPhysician: patient.general.primaryPhysician || "",
          specialists: patient.general.specialists ? patient.general.specialists.join(", ") : "",
          chronicConditions: patient.medical.chronicConditions ? patient.medical.chronicConditions.join(", ") : "",
          allergies: patient.medical.allergies ? patient.medical.allergies.join(", ") : "",
          familyHistory: patient.medical.familyHistory ? patient.medical.familyHistory.join(", ") : "",
        })
      } catch (error) {
        console.error("Error fetching patient:", error)
        alert(language === "ar" ? "خطأ في تحميل بيانات المريض" : "Erreur lors du chargement des données du patient")
        router.back()
      } finally {
        setFetchLoading(false)
      }
    }

    fetchPatient()
  }, [params.id, language, router])

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

      const response = await fetch(`/api/patients/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update patient")
      }

      alert(language === "ar" ? "تم تحديث بيانات المريض بنجاح" : "Données du patient mises à jour avec succès")
      router.push(`/patients/${params.id}`)
    } catch (error) {
      console.error("Error updating patient:", error)
      alert(language === "ar" ? "خطأ في تحديث بيانات المريض" : "Erreur lors de la mise à jour des données du patient")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <AuthGuard>
        <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
          <Sidebar />
          <div className="flex-1 md:mr-64">
            <Header title={t("editPatient")} />
            <main className="p-6">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="space-y-4">
                  <div className="h-64 bg-muted rounded"></div>
                  <div className="h-64 bg-muted rounded"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
        <Sidebar />

        <div className="flex-1 md:mr-64">
          <Header title={t("editPatient")} />

          <main className="p-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
              {/* General Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === "ar" ? "المعلومات الشخصية" : "Informations personnelles"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("firstName")}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("lastName")}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">{t("birthDate")}</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryPhysician">{t("primaryPhysician")}</Label>
                      <Input
                        id="primaryPhysician"
                        value={formData.primaryPhysician}
                        onChange={(e) => handleInputChange("primaryPhysician", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialists">{t("specialists")}</Label>
                      <Input
                        id="specialists"
                        value={formData.specialists}
                        onChange={(e) => handleInputChange("specialists", e.target.value)}
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
                  <CardTitle>{language === "ar" ? "التاريخ المرضي" : "Antécédents médicaux"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chronicConditions">{t("chronicConditions")}</Label>
                    <Textarea
                      id="chronicConditions"
                      value={formData.chronicConditions}
                      onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                      rows={3}
                      placeholder={language === "ar" ? "مفصولة بفاصلة" : "Séparées par des virgules"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">{t("allergies")}</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      rows={3}
                      placeholder={language === "ar" ? "مفصولة بفاصلة" : "Séparées par des virgules"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyHistory">{t("familyHistory")}</Label>
                    <Textarea
                      id="familyHistory"
                      value={formData.familyHistory}
                      onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                      rows={3}
                      placeholder={language === "ar" ? "مفصولة بفاصلة" : "Séparées par des virgules"}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {t("cancel")}
                </Button>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      {language === "ar" ? "جاري التحديث..." : "Mise à jour..."}
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {language === "ar" ? "حفظ التغييرات" : "Enregistrer les modifications"}
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
