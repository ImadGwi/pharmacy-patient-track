"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Calendar, Stethoscope, FileText, Plus, Eye, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export default function PatientProfilePage() {
  const params = useParams()
  const { t, language } = useLanguage()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPatient() {
      try {
        console.log("[v0] Fetching patient:", params.id)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`/api/patients/${params.id}`, {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error("Patient not found")
        }
        const patientData = await response.json()
        console.log("[v0] Patient fetched successfully:", patientData.id)
        setPatient(patientData)
      } catch (err) {
        if (err.name === "AbortError") {
          setError("Request timeout - please try again")
        } else {
          setError(err.message)
        }
        console.error("[v0] Error fetching patient:", err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPatient()
    }
  }, [params.id])

  const handleDeletePatient = async () => {
    if (
      !confirm(
        language === "ar" ? "هل أنت متأكد من حذف هذا المريض؟" : "Êtes-vous sûr de vouloir supprimer ce patient ?",
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/patients/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete patient")
      }

      alert(language === "ar" ? "تم حذف المريض بنجاح" : "Patient supprimé avec succès")
      window.location.href = "/patients"
    } catch (error) {
      console.error("Error deleting patient:", error)
      alert(language === "ar" ? "خطأ في حذف المريض" : "Erreur lors de la suppression du patient")
    }
  }

  if (loading) {
    return (
      <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title={t("patientProfile")} />
          <main className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title={t("patientProfile")} />
          <main className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {error || (language === "ar" ? "المريض غير موجود" : "Patient non trouvé")}
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
      <Sidebar />

      <div className="flex-1 md:mr-64">
        <Header title={t("patientProfile")} />

        <main className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Patient Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {patient.general.firstName} {patient.general.lastName}
                </h1>
                <p className="text-muted-foreground">
                  {language === "ar" ? "رقم المريض:" : "ID Patient:"} {patient.id}
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={`/patients/${patient.id}/edit`}>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Edit className="h-4 w-4" />
                    {t("editPatient")}
                  </Button>
                </Link>

                <Button variant="destructive" onClick={handleDeletePatient} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  {t("deletePatient")}
                </Button>

                <Link href={`/patients/${patient.id}/visits/new`}>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t("newVisit")}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {language === "ar" ? "المعلومات الشخصية" : "Informations personnelles"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{t("phone")}:</span>
                    <span>{patient.general.phone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{t("birthDate")}:</span>
                    <span>{patient.general.birthDate}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span>{t("primaryPhysician")}:</span>
                    <span>{patient.general.primaryPhysician}</span>
                  </div>

                  {patient.general.specialists && patient.general.specialists.length > 0 && (
                    <div>
                      <span className="font-medium">{t("specialists")}:</span>
                      <div className="mt-2 space-y-1">
                        {patient.general.specialists.map((specialist, index) => (
                          <Badge key={index} variant="secondary">
                            {specialist}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {language === "ar" ? "التاريخ المرضي" : "Antécédents médicaux"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.medical.chronicConditions && patient.medical.chronicConditions.length > 0 && (
                    <div>
                      <span className="font-medium">{t("chronicConditions")}:</span>
                      <div className="mt-2 space-y-1">
                        {patient.medical.chronicConditions.map((condition, index) => (
                          <Badge key={index} variant="outline">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient.medical.allergies && patient.medical.allergies.length > 0 && (
                    <div>
                      <span className="font-medium">{t("allergies")}:</span>
                      <div className="mt-2 space-y-1">
                        {patient.medical.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient.medical.familyHistory && (
                    <div>
                      <span className="font-medium">{t("familyHistory")}:</span>
                      <p className="mt-1 text-sm text-muted-foreground">{patient.medical.familyHistory}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Visits History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === "ar" ? "تاريخ الزيارات" : "Historique des visites"} (
                  {patient.visits ? patient.visits.length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.visits && patient.visits.length > 0 ? (
                    patient.visits.map((visit) => (
                      <div key={visit.visitId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {language === "ar" ? "زيارة" : "Visite"} {visit.visitId}
                            </span>
                            <Badge variant="outline">
                              {new Date(visit.at).toLocaleDateString(language === "ar" ? "ar-SA" : "fr-FR")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {visit.questionnaire?.pharmacistNotes ||
                              (language === "ar" ? "لا توجد ملاحظات" : "Aucune note")}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/patients/${patient.id}/visits/${visit.visitId}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              {language === "ar" ? "عرض" : "Voir"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {language === "ar" ? "لا توجد زيارات سابقة" : "Aucune visite précédente"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
