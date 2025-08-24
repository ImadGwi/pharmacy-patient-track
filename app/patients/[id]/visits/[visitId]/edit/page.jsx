"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Pill, Activity, Brain, FileText, Plus, Trash2 } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

export default function EditVisitPage() {
  const params = useParams()
  const router = useRouter()
  const { t, language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    lastGPVisit: "",
    lastSpecialistVisit: "",
    lastLabTests: { date: "", notes: "" },
    nextAppointment: "",
    treatment: {
      medications: [{ name: "", dose: "" }],
      duration: "",
      adherence: "",
      organization: [],
      sideEffects: "",
    },
    medicalTests: [{ name: "Glycémie", value: "", unit: "mg/dL" }],
    lifestyle: {
      dietRecommended: false,
      exercise: false,
      smoking: "",
      alcohol: "",
    },
    evaluation: {
      diseaseKnowledge: "",
      treatmentUnderstanding: "",
      selfManagement: "",
    },
    pharmacistNotes: "",
  })

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

        // Populate form with existing data
        setFormData({
          lastGPVisit: visitData.questionnaire?.lastGPVisit || "",
          lastSpecialistVisit: visitData.questionnaire?.lastSpecialistVisit || "",
          lastLabTests: visitData.questionnaire?.lastLabTests || { date: "", notes: "" },
          nextAppointment: visitData.questionnaire?.nextAppointment || "",
          treatment: {
            medications: visitData.questionnaire?.treatment?.medications || [{ name: "", dose: "" }],
            duration: visitData.questionnaire?.treatment?.duration || "",
            adherence: visitData.questionnaire?.treatment?.adherence || "",
            organization: visitData.questionnaire?.treatment?.organization || [],
            sideEffects: visitData.questionnaire?.treatment?.sideEffects || "",
          },
          medicalTests: visitData.questionnaire?.medicalTests || [{ name: "Glycémie", value: "", unit: "mg/dL" }],
          lifestyle: {
            dietRecommended: visitData.questionnaire?.lifestyle?.dietRecommended || false,
            exercise: visitData.questionnaire?.lifestyle?.exercise || false,
            smoking: visitData.questionnaire?.lifestyle?.smoking || "",
            alcohol: visitData.questionnaire?.lifestyle?.alcohol || "",
          },
          evaluation: {
            diseaseKnowledge: visitData.questionnaire?.evaluation?.diseaseKnowledge || "",
            treatmentUnderstanding: visitData.questionnaire?.evaluation?.treatmentUnderstanding || "",
            selfManagement: visitData.questionnaire?.evaluation?.selfManagement || "",
          },
          pharmacistNotes: visitData.questionnaire?.pharmacistNotes || "",
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVisit()
  }, [params.id, params.visitId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/patients/${params.id}/visits`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitId: params.visitId,
          questionnaire: formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update visit")
      }

      alert(language === "ar" ? "تم تحديث الزيارة بنجاح" : "Visite mise à jour avec succès")
      router.push(`/patients/${params.id}/visits/${params.visitId}`)
    } catch (error) {
      console.error("Error updating visit:", error)
      alert(language === "ar" ? "خطأ في تحديث الزيارة" : "Erreur lors de la mise à jour de la visite")
    } finally {
      setSaving(false)
    }
  }

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        medications: [...prev.treatment.medications, { name: "", dose: "" }],
      },
    }))
  }

  const removeMedication = (index) => {
    setFormData((prev) => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        medications: prev.treatment.medications.filter((_, i) => i !== index),
      },
    }))
  }

  const addMedicalTest = () => {
    setFormData((prev) => ({
      ...prev,
      medicalTests: [...prev.medicalTests, { name: "", value: "", unit: "" }],
    }))
  }

  const removeMedicalTest = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalTests: prev.medicalTests.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title={language === "ar" ? "تعديل الزيارة" : "Modifier la visite"} />
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

  if (error) {
    return (
      <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
        <Sidebar />
        <div className="flex-1 md:mr-64">
          <Header title={language === "ar" ? "تعديل الزيارة" : "Modifier la visite"} />
          <main className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error}</p>
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
        <Header title={language === "ar" ? "تعديل الزيارة" : "Modifier la visite"} />

        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Medical Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {t("medicalFollowup")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lastGPVisit">{t("lastGPVisit")}</Label>
                      <Input
                        id="lastGPVisit"
                        type="date"
                        value={formData.lastGPVisit}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastGPVisit: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastSpecialistVisit">{t("lastSpecialistVisit")}</Label>
                      <Input
                        id="lastSpecialistVisit"
                        type="date"
                        value={formData.lastSpecialistVisit}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastSpecialistVisit: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lastLabTestsDate">
                        {t("lastLabTests")} - {t("date")}
                      </Label>
                      <Input
                        id="lastLabTestsDate"
                        type="date"
                        value={formData.lastLabTests.date}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            lastLabTests: { ...prev.lastLabTests, date: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="nextAppointment">{t("nextAppointment")}</Label>
                      <Input
                        id="nextAppointment"
                        type="date"
                        value={formData.nextAppointment}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nextAppointment: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lastLabTestsNotes">
                      {t("lastLabTests")} - {t("notes")}
                    </Label>
                    <Textarea
                      id="lastLabTestsNotes"
                      value={formData.lastLabTests.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastLabTests: { ...prev.lastLabTests, notes: e.target.value },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Medical Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t("medicalTests")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.medicalTests.map((test, index) => (
                    <Card key={index} className="p-4 bg-muted/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">
                          {language === "ar" ? "فحص طبي" : "Test médical"} {index + 1}
                        </h4>
                        {formData.medicalTests.length > 1 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeMedicalTest(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label>{t("testName")}</Label>
                          <Input
                            value={test.name}
                            onChange={(e) => {
                              const newTests = [...formData.medicalTests]
                              newTests[index].name = e.target.value
                              setFormData((prev) => ({ ...prev, medicalTests: newTests }))
                            }}
                            placeholder={language === "ar" ? "اسم الفحص" : "Nom du test"}
                          />
                        </div>
                        <div>
                          <Label>{t("value")}</Label>
                          <Input
                            value={test.value}
                            onChange={(e) => {
                              const newTests = [...formData.medicalTests]
                              newTests[index].value = e.target.value
                              setFormData((prev) => ({ ...prev, medicalTests: newTests }))
                            }}
                            placeholder={language === "ar" ? "القيمة" : "Valeur"}
                          />
                        </div>
                        <div>
                          <Label>{t("unit")}</Label>
                          <Input
                            value={test.unit}
                            onChange={(e) => {
                              const newTests = [...formData.medicalTests]
                              newTests[index].unit = e.target.value
                              setFormData((prev) => ({ ...prev, medicalTests: newTests }))
                            }}
                            placeholder={language === "ar" ? "الوحدة" : "Unité"}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addMedicalTest} className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "ar" ? "إضافة فحص طبي" : "Ajouter un test médical"}
                  </Button>
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
                  {/* Medications */}
                  <div>
                    <Label className="text-base font-medium">{t("medications")}</Label>
                    <div className="space-y-3 mt-2">
                      {formData.treatment.medications.map((med, index) => (
                        <Card key={index} className="p-4 bg-muted/50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">
                              {language === "ar" ? "دواء" : "Médicament"} {index + 1}
                            </h4>
                            {formData.treatment.medications.length > 1 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeMedication(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label>{t("medicationName")}</Label>
                              <Input
                                value={med.name}
                                onChange={(e) => {
                                  const newMeds = [...formData.treatment.medications]
                                  newMeds[index].name = e.target.value
                                  setFormData((prev) => ({
                                    ...prev,
                                    treatment: { ...prev.treatment, medications: newMeds },
                                  }))
                                }}
                                placeholder={language === "ar" ? "اسم الدواء" : "Nom du médicament"}
                              />
                            </div>
                            <div>
                              <Label>{t("dosage")}</Label>
                              <Input
                                value={med.dose}
                                onChange={(e) => {
                                  const newMeds = [...formData.treatment.medications]
                                  newMeds[index].dose = e.target.value
                                  setFormData((prev) => ({
                                    ...prev,
                                    treatment: { ...prev.treatment, medications: newMeds },
                                  }))
                                }}
                                placeholder={language === "ar" ? "الجرعة" : "Posologie"}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                      <Button type="button" variant="outline" onClick={addMedication} className="w-full bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        {language === "ar" ? "إضافة دواء" : "Ajouter un médicament"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">{t("treatmentDuration")}</Label>
                      <Input
                        id="duration"
                        value={formData.treatment.duration}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            treatment: { ...prev.treatment, duration: e.target.value },
                          }))
                        }
                        placeholder={language === "ar" ? "مدة العلاج" : "Durée du traitement"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="adherence">{t("adherence")}</Label>
                      <Select
                        value={formData.treatment.adherence}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            treatment: { ...prev.treatment, adherence: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={language === "ar" ? "اختر الالتزام" : "Sélectionner l'observance"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">{language === "ar" ? "جيد" : "Bonne"}</SelectItem>
                          <SelectItem value="medium">{language === "ar" ? "متوسط" : "Moyenne"}</SelectItem>
                          <SelectItem value="poor">{language === "ar" ? "ضعيف" : "Mauvaise"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>{t("organization")}</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {[
                        { value: "pillbox", label: language === "ar" ? "علبة أدوية" : "Pilulier" },
                        { value: "alarm", label: language === "ar" ? "منبه" : "Alarme" },
                        { value: "caregiver", label: language === "ar" ? "مساعدة قريب" : "Aide d'un proche" },
                        { value: "other", label: language === "ar" ? "أخرى" : "Autre" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.value}
                            checked={formData.treatment.organization.includes(option.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData((prev) => ({
                                  ...prev,
                                  treatment: {
                                    ...prev.treatment,
                                    organization: [...prev.treatment.organization, option.value],
                                  },
                                }))
                              } else {
                                setFormData((prev) => ({
                                  ...prev,
                                  treatment: {
                                    ...prev.treatment,
                                    organization: prev.treatment.organization.filter((org) => org !== option.value),
                                  },
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={option.value} className="text-sm font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sideEffects">{t("sideEffects")}</Label>
                    <Textarea
                      id="sideEffects"
                      value={formData.treatment.sideEffects}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          treatment: { ...prev.treatment, sideEffects: e.target.value },
                        }))
                      }
                      placeholder={language === "ar" ? "الآثار الجانبية" : "Effets indésirables"}
                    />
                  </div>
                </CardContent>
              </Card>

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
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dietRecommended"
                        checked={formData.lifestyle.dietRecommended}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, dietRecommended: checked },
                          }))
                        }
                      />
                      <Label htmlFor="dietRecommended">{t("dietRecommended")}</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="exercise"
                        checked={formData.lifestyle.exercise}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, exercise: checked },
                          }))
                        }
                      />
                      <Label htmlFor="exercise">{t("exercise")}</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smoking">{t("smoking")}</Label>
                      <Select
                        value={formData.lifestyle.smoking}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, smoking: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={language === "ar" ? "اختر حالة التدخين" : "Sélectionner le tabagisme"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{language === "ar" ? "لا" : "Non"}</SelectItem>
                          <SelectItem value="occasional">{language === "ar" ? "أحياناً" : "Occasionnel"}</SelectItem>
                          <SelectItem value="daily">{language === "ar" ? "يومياً" : "Quotidien"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="alcohol">{t("alcohol")}</Label>
                      <Select
                        value={formData.lifestyle.alcohol}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, alcohol: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              language === "ar" ? "اختر استهلاك الكحول" : "Sélectionner la consommation d'alcool"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{language === "ar" ? "لا" : "Non"}</SelectItem>
                          <SelectItem value="occasional">{language === "ar" ? "أحياناً" : "Occasionnel"}</SelectItem>
                          <SelectItem value="regular">{language === "ar" ? "منتظم" : "Régulier"}</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="diseaseKnowledge">{t("diseaseKnowledge")}</Label>
                      <Select
                        value={formData.evaluation.diseaseKnowledge}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            evaluation: { ...prev.evaluation, diseaseKnowledge: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === "ar" ? "اختر المستوى" : "Sélectionner le niveau"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">{language === "ar" ? "جيد" : "Bonne"}</SelectItem>
                          <SelectItem value="medium">{language === "ar" ? "متوسط" : "Moyenne"}</SelectItem>
                          <SelectItem value="low">{language === "ar" ? "ضعيف" : "Faible"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="treatmentUnderstanding">{t("treatmentUnderstanding")}</Label>
                      <Select
                        value={formData.evaluation.treatmentUnderstanding}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            evaluation: { ...prev.evaluation, treatmentUnderstanding: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === "ar" ? "اختر المستوى" : "Sélectionner le niveau"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">{language === "ar" ? "جيد" : "Bonne"}</SelectItem>
                          <SelectItem value="medium">{language === "ar" ? "متوسط" : "Moyenne"}</SelectItem>
                          <SelectItem value="low">{language === "ar" ? "ضعيف" : "Faible"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="selfManagement">{t("selfManagement")}</Label>
                      <Select
                        value={formData.evaluation.selfManagement}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            evaluation: { ...prev.evaluation, selfManagement: value },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === "ar" ? "اختر المستوى" : "Sélectionner le niveau"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="autonomous">{language === "ar" ? "مستقل" : "Autonome"}</SelectItem>
                          <SelectItem value="needsHelp">
                            {language === "ar" ? "يحتاج مساعدة" : "Aide nécessaire"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t("pharmacistNotes")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.pharmacistNotes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pharmacistNotes: e.target.value }))}
                    placeholder={language === "ar" ? "ملاحظات الصيدلي" : "Notes du pharmacien"}
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  {language === "ar" ? "إلغاء" : "Annuler"}
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? language === "ar"
                      ? "جاري الحفظ..."
                      : "Enregistrement..."
                    : language === "ar"
                      ? "حفظ التغييرات"
                      : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
