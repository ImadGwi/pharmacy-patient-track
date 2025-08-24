"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/providers/auth-provider"
import { useLanguage } from "@/components/providers/language-provider"
import { Save, ArrowRight, Plus, Trash2 } from "lucide-react"

export default function NewVisitPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // Medical Follow-up
    lastGPVisit: "",
    lastSpecialistVisit: "",
    lastLabTests: { date: "", notes: "" },
    nextAppointment: "",

    // Treatment
    medications: [{ name: "", dose: "" }],
    duration: "",
    adherence: "",
    organization: [],
    sideEffects: "",

    // Medical Tests
    medicalTests: [{ name: "bloodSugar", value: "", unit: "mg/dL" }],

    // Lifestyle
    dietRecommended: null,
    exercise: null,
    smoking: "",
    alcohol: "",

    // Evaluation
    diseaseKnowledge: "",
    treatmentUnderstanding: "",
    selfManagement: "",

    // Notes
    pharmacistNotes: "",
    additionalInfo: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }))
  }

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "", dose: "" }],
    }))
  }

  const removeMedication = (index) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const updateMedication = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) => (i === index ? { ...med, [field]: value } : med)),
    }))
  }

  const handleOrganizationChange = (value, checked) => {
    setFormData((prev) => ({
      ...prev,
      organization: checked ? [...prev.organization, value] : prev.organization.filter((item) => item !== value),
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

  const updateMedicalTest = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalTests: prev.medicalTests.map((test, i) => (i === index ? { ...test, [field]: value } : test)),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/patients/${params.id}/visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: user.id,
          questionnaire: {
            lastGPVisit: formData.lastGPVisit,
            lastSpecialistVisit: formData.lastSpecialistVisit,
            lastLabTests: formData.lastLabTests,
            nextAppointment: formData.nextAppointment,
            treatment: {
              medications: formData.medications,
              duration: formData.duration,
              adherence: formData.adherence,
              organization: formData.organization,
              sideEffects: formData.sideEffects,
            },
            medicalTests: formData.medicalTests,
            lifestyle: {
              dietRecommended: formData.dietRecommended,
              exercise: formData.exercise,
              smoking: formData.smoking,
              alcohol: formData.alcohol,
            },
            evaluation: {
              diseaseKnowledge: formData.diseaseKnowledge,
              treatmentUnderstanding: formData.treatmentUnderstanding,
              selfManagement: formData.selfManagement,
            },
            pharmacistNotes: formData.pharmacistNotes,
          },
          additionalInfo: {
            freeText: formData.additionalInfo,
            attachments: [],
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create visit")
      }

      router.push(`/patients/${params.id}`)
    } catch (error) {
      console.error("Error creating visit:", error)
      alert(language === "ar" ? "حدث خطأ في حفظ الزيارة" : "Erreur lors de l'enregistrement de la visite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className={`flex min-h-screen bg-background ${language === "ar" ? "dir-rtl" : ""}`}>
        <Sidebar />

        <div className="flex-1 md:mr-64">
          <Header title={t("newVisit")} />

          <main className="p-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
              {/* Medical Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("medicalFollowup")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastGPVisit">{t("lastGPVisit")}</Label>
                      <Input
                        id="lastGPVisit"
                        type="date"
                        value={formData.lastGPVisit}
                        onChange={(e) => handleInputChange("lastGPVisit", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastSpecialistVisit">{t("lastSpecialistVisit")}</Label>
                      <Input
                        id="lastSpecialistVisit"
                        type="date"
                        value={formData.lastSpecialistVisit}
                        onChange={(e) => handleInputChange("lastSpecialistVisit", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="labTestDate">{t("lastLabTests")}</Label>
                      <Input
                        id="labTestDate"
                        type="date"
                        value={formData.lastLabTests.date}
                        onChange={(e) => handleNestedChange("lastLabTests", "date", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nextAppointment">{t("nextAppointment")}</Label>
                      <Input
                        id="nextAppointment"
                        type="date"
                        value={formData.nextAppointment}
                        onChange={(e) => handleInputChange("nextAppointment", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="labNotes">{language === "ar" ? "ملاحظات الفحوصات" : "Notes des examens"}</Label>
                    <Textarea
                      id="labNotes"
                      value={formData.lastLabTests.notes}
                      onChange={(e) => handleNestedChange("lastLabTests", "notes", e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Medical Tests */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("medicalTests")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{t("medicalTests")}</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMedicalTest}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("addTest")}
                      </Button>
                    </div>

                    {formData.medicalTests.map((test, index) => (
                      <Card key={index} className="p-4 bg-muted/50">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1 space-y-2">
                            <Label>{t("testName")}</Label>
                            <Input
                              value={test.name}
                              onChange={(e) => updateMedicalTest(index, "name", e.target.value)}
                              placeholder={language === "ar" ? "نوع الفحص" : "Type de test"}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label>{t("testValue")}</Label>
                            <Input
                              value={test.value}
                              onChange={(e) => updateMedicalTest(index, "value", e.target.value)}
                              placeholder={language === "ar" ? "القيمة" : "Valeur"}
                            />
                          </div>
                          <div className="w-24 space-y-2">
                            <Label>{t("testUnit")}</Label>
                            <Input
                              value={test.unit}
                              onChange={(e) => updateMedicalTest(index, "unit", e.target.value)}
                              placeholder={language === "ar" ? "الوحدة" : "Unité"}
                            />
                          </div>
                          {formData.medicalTests.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeMedicalTest(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Treatment */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("currentTreatment")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{t("medications")}</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("addMedication")}
                      </Button>
                    </div>

                    {formData.medications.map((medication, index) => (
                      <Card key={index} className="p-4 bg-muted/50">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1 space-y-2">
                            <Label>{t("medicationName")}</Label>
                            <Input
                              value={medication.name}
                              onChange={(e) => updateMedication(index, "name", e.target.value)}
                              placeholder={language === "ar" ? "اسم الدواء" : "Nom du médicament"}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Label>{t("dosage")}</Label>
                            <Input
                              value={medication.dose}
                              onChange={(e) => updateMedication(index, "dose", e.target.value)}
                              placeholder={language === "ar" ? "الجرعة والتكرار" : "Posologie"}
                            />
                          </div>
                          {formData.medications.length > 1 && (
                            <Button type="button" variant="outline" size="icon" onClick={() => removeMedication(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">{t("treatmentDuration")}</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                        placeholder={language === "ar" ? "مثال: 3 أشهر" : "Ex: 3 mois"}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>{t("adherence")}</Label>
                      <RadioGroup
                        value={formData.adherence}
                        onValueChange={(value) => handleInputChange("adherence", value)}
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="good" id="adherence-good" />
                          <Label htmlFor="adherence-good">{t("good")}</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="medium" id="adherence-medium" />
                          <Label htmlFor="adherence-medium">{t("medium")}</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="poor" id="adherence-poor" />
                          <Label htmlFor="adherence-poor">{t("poor")}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>{t("organization")}</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "pillbox", label: "علبة أدوية" },
                        { value: "alarm", label: "منبه" },
                        { value: "caregiver", label: "مساعدة قريب" },
                        { value: "other", label: "أخرى" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`org-${option.value}`}
                            checked={formData.organization.includes(option.value)}
                            onCheckedChange={(checked) => handleOrganizationChange(option.value, checked)}
                          />
                          <Label htmlFor={`org-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sideEffects">{t("sideEffects")}</Label>
                    <Textarea
                      id="sideEffects"
                      value={formData.sideEffects}
                      onChange={(e) => handleInputChange("sideEffects", e.target.value)}
                      rows={2}
                      placeholder={
                        language === "ar"
                          ? "أي آثار جانبية ملاحظة..."
                          : "Quelles sont les effets secondaires observés..."
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lifestyle */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("lifestyle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>{t("dietRecommended")}</Label>
                      <RadioGroup
                        value={formData.dietRecommended?.toString() || ""}
                        onValueChange={(value) => handleInputChange("dietRecommended", value === "true")}
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="true" id="diet-yes" />
                          <Label htmlFor="diet-yes">{t("yes")}</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="false" id="diet-no" />
                          <Label htmlFor="diet-no">{t("no")}</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label>{t("exercise")}</Label>
                      <RadioGroup
                        value={formData.exercise?.toString() || ""}
                        onValueChange={(value) => handleInputChange("exercise", value === "true")}
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="true" id="exercise-yes" />
                          <Label htmlFor="exercise-yes">{t("yes")}</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="false" id="exercise-no" />
                          <Label htmlFor="exercise-no">{t("no")}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>{t("smoking")}</Label>
                      <RadioGroup
                        value={formData.smoking}
                        onValueChange={(value) => handleInputChange("smoking", value)}
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="none" id="smoking-none" />
                          <Label htmlFor="smoking-none">{t("none")}</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="occasional" id="smoking-occasional" />
                          <Label htmlFor="smoking-occasional">{t("occasional")}</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="daily" id="smoking-daily" />
                          <Label htmlFor="smoking-daily">{t("daily")}</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label>{t("alcohol")}</Label>
                      <RadioGroup
                        value={formData.alcohol}
                        onValueChange={(value) => handleInputChange("alcohol", value)}
                      >
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="none" id="alcohol-none" />
                          <Label htmlFor="alcohol-none">{t("none")}</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="occasional" id="alcohol-occasional" />
                          <Label htmlFor="alcohol-occasional">{t("occasional")}</Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value="regular" id="alcohol-regular" />
                          <Label htmlFor="alcohol-regular">{t("regular")}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Evaluation */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("evaluation")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>{t("diseaseKnowledge")}</Label>
                    <RadioGroup
                      value={formData.diseaseKnowledge}
                      onValueChange={(value) => handleInputChange("diseaseKnowledge", value)}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="good" id="knowledge-good" />
                        <Label htmlFor="knowledge-good">{t("good")}</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="medium" id="knowledge-medium" />
                        <Label htmlFor="knowledge-medium">{t("medium")}</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="low" id="knowledge-low" />
                        <Label htmlFor="knowledge-low">{t("low")}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>{t("treatmentUnderstanding")}</Label>
                    <RadioGroup
                      value={formData.treatmentUnderstanding}
                      onValueChange={(value) => handleInputChange("treatmentUnderstanding", value)}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="good" id="understanding-good" />
                        <Label htmlFor="understanding-good">{t("good")}</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="medium" id="understanding-medium" />
                        <Label htmlFor="understanding-medium">{t("medium")}</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="low" id="understanding-low" />
                        <Label htmlFor="understanding-low">{t("low")}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>{t("selfManagement")}</Label>
                    <RadioGroup
                      value={formData.selfManagement}
                      onValueChange={(value) => handleInputChange("selfManagement", value)}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="autonomous" id="management-autonomous" />
                        <Label htmlFor="management-autonomous">{t("autonomous")}</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="needsHelp" id="management-help" />
                        <Label htmlFor="management-help">{t("needsHelp")}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("notes")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pharmacistNotes">{t("pharmacistNotes")}</Label>
                    <Textarea
                      id="pharmacistNotes"
                      value={formData.pharmacistNotes}
                      onChange={(e) => handleInputChange("pharmacistNotes", e.target.value)}
                      rows={4}
                      placeholder={
                        language === "ar"
                          ? "ملاحظات إضافية حول حالة المريض..."
                          : "Notes supplémentaires sur l'état du patient..."
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">{t("additionalInfo")}</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      rows={3}
                      placeholder={
                        language === "ar" ? "أي معلومات إضافية..." : "Quelles informations supplémentaires..."
                      }
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
                      {language === "ar" ? "جاري الحفظ..." : "Enregistrement..."}
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t("save")}
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
