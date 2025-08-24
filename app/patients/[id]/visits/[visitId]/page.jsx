"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Pill, Activity, Brain, FileText, Clock } from "lucide-react"

export default function VisitDetailsPage() {
  const params = useParams()
  const [visit, setVisit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock visit data
    const mockVisit = {
      visitId: params.visitId,
      at: "2024-01-15T10:30:00Z",
      doctorId: "D-001",
      doctorName: "د. محمد أحمد",
      questionnaire: {
        lastGPVisit: "2024-01-10",
        lastSpecialistVisit: "2024-01-05",
        lastLabTests: {
          date: "2024-01-08",
          notes: "فحص السكر والضغط - النتائج ضمن المعدل الطبيعي",
        },
        nextAppointment: "2024-02-15",
        treatment: {
          medications: [
            { name: "ميتفورمين", dose: "500 مج مرتين يومياً" },
            { name: "أملوديبين", dose: "5 مج مرة واحدة يومياً" },
          ],
          duration: "3 أشهر",
          adherence: "good",
          organization: ["pillbox", "alarm"],
          sideEffects: "لا توجد آثار جانبية",
        },
        lifestyle: {
          dietRecommended: true,
          exercise: true,
          smoking: "none",
          alcohol: "none",
        },
        evaluation: {
          diseaseKnowledge: "good",
          treatmentUnderstanding: "good",
          selfManagement: "autonomous",
        },
        pharmacistNotes:
          "المريض يتابع العلاج بانتظام ويظهر تحسناً في مستويات السكر. ينصح بالاستمرار على النظام الغذائي والرياضة.",
      },
      additionalInfo: {
        freeText: "المريض سأل عن إمكانية تقليل جرعة الأنسولين",
      },
    }

    setTimeout(() => {
      setVisit(mockVisit)
      setLoading(false)
    }, 1000)
  }, [params.visitId])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background" dir="rtl">
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title="تفاصيل الزيارة" titleEn="Visit Details" />
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

  if (!visit) {
    return (
      <div className="flex min-h-screen bg-background" dir="rtl">
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title="تفاصيل الزيارة" titleEn="Visit Details" />
          <main className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground font-arabic">الزيارة غير موجودة</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const getAdherenceLabel = (adherence) => {
    const labels = {
      good: "جيد",
      medium: "متوسط",
      poor: "ضعيف",
    }
    return labels[adherence] || adherence
  }

  const getOrganizationLabel = (org) => {
    const labels = {
      pillbox: "علبة أدوية",
      alarm: "منبه",
      caregiver: "مساعدة قريب",
      other: "أخرى",
    }
    return labels[org] || org
  }

  const getEvaluationLabel = (value) => {
    const labels = {
      good: "جيد",
      medium: "متوسط",
      low: "ضعيف",
      autonomous: "مستقل",
      needsHelp: "يحتاج مساعدة",
    }
    return labels[value] || value
  }

  const getLifestyleLabel = (value) => {
    const labels = {
      none: "لا",
      occasional: "أحياناً",
      daily: "يومياً",
      regular: "منتظم",
    }
    return labels[value] || (value ? "نعم" : "لا")
  }

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />

      <div className="flex-1 md:mr-64">
        <Header title="تفاصيل الزيارة" titleEn="Visit Details" />

        <main className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Visit Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-arabic">زيارة {visit.visitId}</h1>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(visit.at).toLocaleDateString("ar-SA")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(visit.at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-arabic">{visit.doctorName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medical Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <Calendar className="h-5 w-5" />
                    المتابعة الطبية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {visit.questionnaire.lastGPVisit && (
                    <div>
                      <span className="font-arabic font-medium">آخر زيارة للطبيب العام:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.lastGPVisit}</p>
                    </div>
                  )}

                  {visit.questionnaire.lastSpecialistVisit && (
                    <div>
                      <span className="font-arabic font-medium">آخر زيارة للمختص:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.lastSpecialistVisit}</p>
                    </div>
                  )}

                  {visit.questionnaire.lastLabTests.date && (
                    <div>
                      <span className="font-arabic font-medium">آخر فحوصات:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.lastLabTests.date}</p>
                      {visit.questionnaire.lastLabTests.notes && (
                        <p className="text-sm text-muted-foreground font-arabic mt-1">
                          {visit.questionnaire.lastLabTests.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {visit.questionnaire.nextAppointment && (
                    <div>
                      <span className="font-arabic font-medium">الموعد القادم:</span>
                      <p className="text-muted-foreground">{visit.questionnaire.nextAppointment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Treatment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <Pill className="h-5 w-5" />
                    العلاج
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-arabic font-medium">الأدوية:</span>
                    <div className="mt-2 space-y-2">
                      {visit.questionnaire.treatment.medications.map((med, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="font-arabic font-medium">{med.name}</span>
                          <span className="text-sm text-muted-foreground font-arabic">{med.dose}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {visit.questionnaire.treatment.duration && (
                    <div>
                      <span className="font-arabic font-medium">مدة العلاج:</span>
                      <p className="text-muted-foreground font-arabic">{visit.questionnaire.treatment.duration}</p>
                    </div>
                  )}

                  {visit.questionnaire.treatment.adherence && (
                    <div>
                      <span className="font-arabic font-medium">الالتزام:</span>
                      <Badge variant="secondary" className="mr-2 font-arabic">
                        {getAdherenceLabel(visit.questionnaire.treatment.adherence)}
                      </Badge>
                    </div>
                  )}

                  {visit.questionnaire.treatment.organization.length > 0 && (
                    <div>
                      <span className="font-arabic font-medium">التنظيم:</span>
                      <div className="mt-1 space-x-1 space-x-reverse">
                        {visit.questionnaire.treatment.organization.map((org, index) => (
                          <Badge key={index} variant="outline" className="font-arabic">
                            {getOrganizationLabel(org)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {visit.questionnaire.treatment.sideEffects && (
                    <div>
                      <span className="font-arabic font-medium">الآثار الجانبية:</span>
                      <p className="text-sm text-muted-foreground font-arabic">
                        {visit.questionnaire.treatment.sideEffects}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lifestyle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <Activity className="h-5 w-5" />
                    نمط الحياة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-arabic font-medium">النظام الغذائي:</span>
                      <p className="text-muted-foreground font-arabic">
                        {getLifestyleLabel(visit.questionnaire.lifestyle.dietRecommended)}
                      </p>
                    </div>

                    <div>
                      <span className="font-arabic font-medium">الرياضة:</span>
                      <p className="text-muted-foreground font-arabic">
                        {getLifestyleLabel(visit.questionnaire.lifestyle.exercise)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-arabic font-medium">التدخين:</span>
                      <p className="text-muted-foreground font-arabic">
                        {getLifestyleLabel(visit.questionnaire.lifestyle.smoking)}
                      </p>
                    </div>

                    <div>
                      <span className="font-arabic font-medium">الكحول:</span>
                      <p className="text-muted-foreground font-arabic">
                        {getLifestyleLabel(visit.questionnaire.lifestyle.alcohol)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Evaluation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <Brain className="h-5 w-5" />
                    تقييم المريض
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-arabic font-medium">معرفة المرض:</span>
                    <Badge variant="secondary" className="mr-2 font-arabic">
                      {getEvaluationLabel(visit.questionnaire.evaluation.diseaseKnowledge)}
                    </Badge>
                  </div>

                  <div>
                    <span className="font-arabic font-medium">فهم العلاج:</span>
                    <Badge variant="secondary" className="mr-2 font-arabic">
                      {getEvaluationLabel(visit.questionnaire.evaluation.treatmentUnderstanding)}
                    </Badge>
                  </div>

                  <div>
                    <span className="font-arabic font-medium">الاستقلالية:</span>
                    <Badge variant="secondary" className="mr-2 font-arabic">
                      {getEvaluationLabel(visit.questionnaire.evaluation.selfManagement)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-arabic">
                  <FileText className="h-5 w-5" />
                  الملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {visit.questionnaire.pharmacistNotes && (
                  <div>
                    <span className="font-arabic font-medium">ملاحظات الصيدلي:</span>
                    <p className="mt-2 p-4 bg-muted rounded-lg text-sm font-arabic">
                      {visit.questionnaire.pharmacistNotes}
                    </p>
                  </div>
                )}

                {visit.additionalInfo?.freeText && (
                  <div>
                    <span className="font-arabic font-medium">معلومات إضافية:</span>
                    <p className="mt-2 p-4 bg-muted rounded-lg text-sm font-arabic">{visit.additionalInfo.freeText}</p>
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
