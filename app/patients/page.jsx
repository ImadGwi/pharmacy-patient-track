"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { useLanguage } from "@/components/providers/language-provider"
import { Search, Plus, Eye, FileText } from "lucide-react"

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    // Mock data for demonstration
    const mockPatients = [
      {
        id: "P-001",
        name: "أحمد محمد علي",
        phone: "0123456789",
        lastVisit: "2024-01-15",
        condition: "السكري",
        visitsCount: 3,
      },
      {
        id: "P-002",
        name: "فاطمة حسن",
        phone: "0987654321",
        lastVisit: "2024-01-10",
        condition: "ضغط الدم",
        visitsCount: 5,
      },
    ]

    setTimeout(() => {
      setPatients(mockPatients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredPatients = patients.filter(
    (patient) => patient.name.includes(searchQuery) || patient.phone.includes(searchQuery),
  )

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background" dir="rtl">
        <Sidebar />

        <div className="flex-1 md:mr-64">
          <Header title={t("patients")} titleEn="Patient Management" />

          <main className="p-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={
                    language === "ar" ? "البحث بالاسم أو رقم الهاتف..." : "Rechercher par nom ou téléphone..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 font-arabic"
                />
              </div>
              <Link href="/patients/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="font-arabic">{t("newPatient")}</span>
                </Button>
              </Link>
            </div>

            {/* Patients Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="font-arabic text-lg">{patient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{patient.phone}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-arabic">الحالة:</span>
                          <Badge variant="secondary" className="font-arabic">
                            {patient.condition}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-arabic">آخر زيارة:</span>
                          <span className="text-sm text-muted-foreground">{patient.lastVisit}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-arabic">عدد الزيارات:</span>
                          <Badge variant="outline">{patient.visitsCount}</Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Link href={`/patients/${patient.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              <Eye className="h-4 w-4 ml-2" />
                              <span className="font-arabic">عرض</span>
                            </Button>
                          </Link>
                          <Link href={`/patients/${patient.id}/visits/new`} className="flex-1">
                            <Button size="sm" className="w-full">
                              <FileText className="h-4 w-4 ml-2" />
                              <span className="font-arabic">زيارة جديدة</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredPatients.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-arabic">
                  {language === "ar" ? "لا توجد نتائج للبحث" : "Aucun résultat trouvé"}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
