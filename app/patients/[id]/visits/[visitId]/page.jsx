"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Pill, Activity, Brain, FileText, Clock, Edit, Trash2 } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export default function VisitDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { t, language } = useLanguage()
  const [visit, setVisit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchVisit() {
      try {
        const response = await fetch(`/api/patients/${params.id}`)
        if (!response.ok) {
          throw new Error("Patient not found")
        }
        const patientData = await response.json()
        const visitData = patientData.visits?.find((v) => v.visitId === params.visitId)

        if (!visitData) {
          throw new Error("Visit not found")
        }

        setVisit(visitData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVisit()
  }, [params.id, params.visitId])

  const handleDeleteVisit = async () => {
    if (
      !confirm(
        language === "ar" ? "هل أنت متأكد من حذف هذه الزيارة؟" : "Êtes-vous sûr de vouloir supprimer cette visite ?",
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/patients/${params.id}/visits?visitId=${params.visitId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete visit")
      }

      alert(language === "ar" ? "تم حذف الزيارة بنجاح" : "Visite supprimée avec succès")
      router.push(`/patients/${params.id}`)
    } catch (error) {
      console.error("Error deleting visit:", error)
      alert(language === "ar" ? "خطأ في حذف الزيارة" : "Erreur lors de la suppression de la visite")
    }
  }

  if (loading) {
    return (
      <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title={language === "ar" ? "تفاصيل الزيارة" : "Détails de la visite"} />
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

  if (error || !visit) {
    return (
      <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title={language === "ar" ? "تفاصيل الزيارة" : "Détails de la visite"} />
          <main className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {error || (language === "ar" ? "الزيارة غير موجودة" : "Visite non trouvée")}
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const getAdherenceLabel = (adherence) => {
    const labels = {
      good: language === "ar" ? "جيد" : "Bonne",
      medium: language === "ar" ? "متوسط" : "Moyenne",
      poor: language === "ar" ? "ضعيف" : "Mauvaise",
    }
    return labels[adherence] || adherence
  }

  const getOrganizationLabel = (org) => {
    const labels = {
      pillbox: language === "ar" ? "علبة أدوية" : "Pilulier",
      alarm: language === "ar" ? "منبه" : "Alarme",
      caregiver: language === "ar" ? "مساعدة قريب" : "Aide d'un proche",
      other: language === "ar" ? "أخرى" : "Autre",
    }
    return labels[org] || org
  }

  const getEvaluationLabel = (value) => {
    const labels = {
      good: language === "ar" ? "جيد" : "Bonne",
      medium: language === "ar" ? "متوسط" : "Moyenne",
      low: language === "ar" ? "ضعيف" : "Faible",
      autonomous: language === "ar" ? "مستقل" : "Autonome",
      needsHelp: language === "ar" ? "يحتاج مساعدة" : "Aide nécessaire",
    }
    return labels[value] || value
  }

  const getLifestyleLabel = (value) => {
    const labels = {
      none: language === "ar" ? "لا" : "Non",
      occasional: language === "ar" ? "أحياناً" : "Occasionnel",
      daily: language === "ar" ? "يومياً" : "Quotidien",
      regular: language === "ar" ? "منتظم" : "Régulier",
    }
    return labels[value] || (value ? (language === "ar" ? "نعم" : "Oui") : language === "ar" ? "لا" : "Non")
  }

  return (
    <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
      <Sidebar />

      <div className="flex-1 md:mr-64">
        <Header title={language === "ar" ? "تفاصيل الزيارة" : "Détails de la visite"} />

        <main className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Visit Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {language === "ar" ? "زيارة" : "Visite"} {visit.visitId}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(visit.at).toLocaleDateString(language === "ar" ? "ar-SA" : "fr-FR")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(visit.at).toLocaleTimeString(language === "ar" ? "ar-SA" : "fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {visit.doctorName && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{visit.doctorName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/patients/${params.id}/visits/${params.visitId}/edit`}>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Edit className="h-4 w-4" />
                    {t("editVisit")}
                  </Button>
                </Link>

                <Button variant="destructive" onClick={handleDeleteVisit} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  {t("deleteVisit")}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medical Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t("medicalFollowup")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visit.questionnaire?.lastGPVisit && (
                    <div>
                      <span className="font-medium">{t("lastGPVisit")}:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.lastGPVisit}</p>
                    </div>
                  )}

                  {visit.questionnaire?.lastSpecialistVisit && (
                    <div>
                      <span className="font-medium">{t("lastSpecialistVisit")}:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.lastSpecialistVisit}</p>
                    </div>
                  )}

                  {visit.questionnaire?.lastLabTests?.date && (
                    <div>
                      <span className="font-medium">{t("lastLabTests")}:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.lastLabTests.date}</p>
                      {visit.questionnaire.lastLabTests.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{visit.questionnaire.lastLabTests.notes}</p>
                      )}
                    </div>
                  )}

                  {visit.questionnaire?.nextAppointment && (
                    <div>
                      <span className="font-medium">{t("nextAppointment")}:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.nextAppointment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Treatment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    {t("currentTreatment")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visit.questionnaire?.treatment?.medications &&
                    visit.questionnaire.treatment.medications.length > 0 && (
                      <div>
                        <span className="font-medium">{t("medications")}:</span>
                        <div className="mt-2 space-y-2">
                          {visit.questionnaire.treatment.medications.map((med, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="font-medium">{med.name}</span>
                              <span className="text-sm text-muted-foreground">{med.dose}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {visit.questionnaire?.treatment?.duration && (
                    <div>
                      <span className="font-medium">{t("treatmentDuration")}:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.treatment.duration}</p>
                    </div>
                  )}

                  {visit.questionnaire?.treatment?.adherence && (
                    <div>
                      <span className="font-medium">{t("adherence")}:</span>
                      <Badge variant="secondary" className="mr-2">
                        {getAdherenceLabel(visit.questionnaire.treatment.adherence)}
                      </Badge>
                    </div>
                  )}

                  {visit.questionnaire?.treatment?.organization &&
                    visit.questionnaire.treatment.organization.length > 0 && (
                      <div>
                        <span className="font-medium">{t("organization")}:</span>
                        <div className="mt-1 space-x-1 space-x-reverse">
                          {visit.questionnaire.treatment.organization.map((org, index) => (
                            <Badge key={index} variant="outline">
                              {getOrganizationLabel(org)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {visit.questionnaire?.treatment?.sideEffects && (
                    <div>
                      <span className="font-medium">{t("sideEffects")}:</span>
                      <p className="text-sm text-muted-foreground">{visit.questionnaire.treatment.sideEffects}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {visit.questionnaire?.medicalTests && visit.questionnaire.medicalTests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t("medicalTests")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visit.questionnaire.medicalTests.map((test, index) => (
                      <Card key={index} className="p-4 bg-muted/50">
                        <div className="space-y-2">
                          <h4 className="font-medium">{test.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{test.value}</span>
                            <span className="text-sm text-muted-foreground">{test.unit}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lifestyle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t("lifestyle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">{t("dietRecommended")}:</span>
                      <p className="text-muted-foreground">
                        {getLifestyleLabel(visit.questionnaire?.lifestyle?.dietRecommended)}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium">{t("exercise")}:</span>
                      <p className="text-muted-foreground">
                        {getLifestyleLabel(visit.questionnaire?.lifestyle?.exercise)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">{t("smoking")}:</span>
                      <p className="text-muted-foreground">
                        {getLifestyleLabel(visit.questionnaire?.lifestyle?.smoking)}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium">{t("alcohol")}:</span>
                      <p className="text-muted-foreground">
                        {getLifestyleLabel(visit.questionnaire?.lifestyle?.alcohol)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Evaluation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {t("patientEvaluation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visit.questionnaire?.evaluation?.diseaseKnowledge && (
                    <div>
                      <span className="font-medium">{t("diseaseKnowledge")}:</span>
                      <Badge variant="secondary" className="mr-2">
                        {getEvaluationLabel(visit.questionnaire.evaluation.diseaseKnowledge)}
                      </Badge>
                    </div>
                  )}

                  {visit.questionnaire?.evaluation?.treatmentUnderstanding && (
                    <div>
                      <span className="font-medium">{t("treatmentUnderstanding")}:</span>
                      <Badge variant="secondary" className="mr-2">
                        {getEvaluationLabel(visit.questionnaire.evaluation.treatmentUnderstanding)}
                      </Badge>
                    </div>
                  )}

                  {visit.questionnaire?.evaluation?.selfManagement && (
                    <div>
                      <span className="font-medium">{t("selfManagement")}:</span>
                      <Badge variant="secondary" className="mr-2">
                        {getEvaluationLabel(visit.questionnaire.evaluation.selfManagement)}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === "ar" ? "الملاحظات" : "Notes"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {visit.questionnaire?.pharmacistNotes && (
                  <div>
                    <span className="font-medium">{t("pharmacistNotes")}:</span>
                    <p className="mt-2 p-4 bg-muted rounded-lg text-sm">{visit.questionnaire.pharmacistNotes}</p>
                  </div>
                )}

                {visit.additionalInfo?.freeText && (
                  <div>
                    <span className="font-medium">{t("additionalInfo")}:</span>
                    <p className="mt-2 p-4 bg-muted rounded-lg text-sm">{visit.additionalInfo.freeText}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
