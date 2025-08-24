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
import { User, Phone, Calendar, Stethoscope, FileText, Plus, Eye, AlertTriangle } from "lucide-react"

export default function PatientProfilePage() {
  const params = useParams()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock patient data
    const mockPatient = {
      id: params.id,
      general: {
        firstName: "أحمد",
        lastName: "محمد علي",
        birthDate: "1980-05-15",
        phone: "0123456789",
        primaryPhysician: "د. محمد حسن",
        specialists: ["د. فاطمة أحمد - قلبية", "د. علي محمود - غدد صماء"],
      },
      medical: {
        chronicConditions: ["السكري النوع الثاني", "ارتفاع ضغط الدم"],
        allergies: ["البنسلين", "الأسبرين"],
        familyHistory: "تاريخ عائلي للسكري وأمراض القلب",
      },
      visits: [
        {
          visitId: "V-001",
          at: "2024-01-15T10:30:00Z",
          doctorId: "D-001",
          questionnaire: {
            pharmacistNotes: "المريض يتابع العلاج بانتظام، لا توجد آثار جانبية",
          },
        },
        {
          visitId: "V-002",
          at: "2024-01-08T14:15:00Z",
          doctorId: "D-001",
          questionnaire: {
            pharmacistNotes: "تم تعديل جرعة الأنسولين حسب توصية الطبيب",
          },
        },
      ],
    }

    setTimeout(() => {
      setPatient(mockPatient)
      setLoading(false)
    }, 1000)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background" dir="rtl">
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title="ملف المريض" titleEn="Patient Profile" />
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

  if (!patient) {
    return (
      <div className="flex min-h-screen bg-background" dir="rtl">
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title="ملف المريض" titleEn="Patient Profile" />
          <main className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground font-arabic">المريض غير موجود</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />

      <div className="flex-1 md:mr-64">
        <Header title="ملف المريض" titleEn="Patient Profile" />

        <main className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Patient Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-arabic">
                  {patient.general.firstName} {patient.general.lastName}
                </h1>
                <p className="text-muted-foreground">رقم المريض: {patient.id}</p>
              </div>

              <Link href={`/patients/${patient.id}/visits/new`}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="font-arabic">زيارة جديدة</span>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <User className="h-5 w-5" />
                    المعلومات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-arabic">الهاتف:</span>
                    <span>{patient.general.phone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-arabic">تاريخ الميلاد:</span>
                    <span>{patient.general.birthDate}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span className="font-arabic">الطبيب المعالج:</span>
                    <span className="font-arabic">{patient.general.primaryPhysician}</span>
                  </div>

                  {patient.general.specialists.length > 0 && (
                    <div>
                      <span className="font-arabic font-medium">الأطباء المختصون:</span>
                      <div className="mt-2 space-y-1">
                        {patient.general.specialists.map((specialist, index) => (
                          <Badge key={index} variant="secondary" className="font-arabic">
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
                  <CardTitle className="flex items-center gap-2 font-arabic">
                    <AlertTriangle className="h-5 w-5" />
                    التاريخ المرضي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="font-arabic font-medium">الأمراض المزمنة:</span>
                    <div className="mt-2 space-y-1">
                      {patient.medical.chronicConditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="font-arabic">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-arabic font-medium">الحساسية:</span>
                    <div className="mt-2 space-y-1">
                      {patient.medical.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="font-arabic">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-arabic font-medium">التاريخ العائلي:</span>
                    <p className="mt-1 text-sm text-muted-foreground font-arabic">{patient.medical.familyHistory}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Visits History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-arabic">
                  <FileText className="h-5 w-5" />
                  تاريخ الزيارات ({patient.visits.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.visits.map((visit) => (
                    <div key={visit.visitId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">زيارة {visit.visitId}</span>
                          <Badge variant="outline">{new Date(visit.at).toLocaleDateString("ar-SA")}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-arabic">
                          {visit.questionnaire.pharmacistNotes}
                        </p>
                      </div>

                      <Link href={`/patients/${patient.id}/visits/${visit.visitId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 ml-2" />
                          <span className="font-arabic">عرض</span>
                        </Button>
                      </Link>
                    </div>
                  ))}

                  {patient.visits.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground font-arabic">لا توجد زيارات سابقة</p>
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
