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
import { Save, ArrowRight, Plus, Trash2 } from "lucide-react"

export default function NewVisitPage() {
  const params = useParams()
  const router = useRouter()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Creating visit:", formData)
      router.push(`/patients/${params.id}`)
    } catch (error) {
      console.error("Error creating visit:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      <Sidebar />

      <div className="flex-1 md:mr-64">
        <Header title="زيارة جديدة" titleEn="New Visit" />

        <main className="p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Medical Follow-up */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">المتابعة الطبية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastGPVisit" className="font-arabic">
                      آخر زيارة للطبيب العام
                    </Label>
                    <Input
                      id="lastGPVisit"
                      type="date"
                      value={formData.lastGPVisit}
                      onChange={(e) => handleInputChange("lastGPVisit", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastSpecialistVisit" className="font-arabic">
                      آخر زيارة للمختص
                    </Label>
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
                    <Label htmlFor="labTestDate" className="font-arabic">
                      تاريخ آخر فحوصات
                    </Label>
                    <Input
                      id="labTestDate"
                      type="date"
                      value={formData.lastLabTests.date}
                      onChange={(e) => handleNestedChange("lastLabTests", "date", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextAppointment" className="font-arabic">
                      الموعد القادم
                    </Label>
                    <Input
                      id="nextAppointment"
                      type="date"
                      value={formData.nextAppointment}
                      onChange={(e) => handleInputChange("nextAppointment", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labNotes" className="font-arabic">
                    ملاحظات الفحوصات
                  </Label>
                  <Textarea
                    id="labNotes"
                    value={formData.lastLabTests.notes}
                    onChange={(e) => handleNestedChange("lastLabTests", "notes", e.target.value)}
                    className="font-arabic"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Treatment */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">العلاج الحالي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-arabic">الأدوية</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                      <Plus className="h-4 w-4 ml-2" />
                      <span className="font-arabic">إضافة دواء</span>
                    </Button>
                  </div>

                  {formData.medications.map((medication, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label className="font-arabic">اسم الدواء</Label>
                        <Input
                          value={medication.name}
                          onChange={(e) => updateMedication(index, "name", e.target.value)}
                          className="font-arabic"
                          placeholder="اسم الدواء"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="font-arabic">الجرعة</Label>
                        <Input
                          value={medication.dose}
                          onChange={(e) => updateMedication(index, "dose", e.target.value)}
                          className="font-arabic"
                          placeholder="الجرعة والتكرار"
                        />
                      </div>
                      {formData.medications.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeMedication(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="font-arabic">
                      مدة العلاج
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      className="font-arabic"
                      placeholder="مثال: 3 أشهر"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="font-arabic">الالتزام بالعلاج</Label>
                    <RadioGroup
                      value={formData.adherence}
                      onValueChange={(value) => handleInputChange("adherence", value)}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="good" id="adherence-good" />
                        <Label htmlFor="adherence-good" className="font-arabic">
                          جيد
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="medium" id="adherence-medium" />
                        <Label htmlFor="adherence-medium" className="font-arabic">
                          متوسط
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="poor" id="adherence-poor" />
                        <Label htmlFor="adherence-poor" className="font-arabic">
                          ضعيف
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-arabic">تنظيم الأدوية</Label>
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
                        <Label htmlFor={`org-${option.value}`} className="font-arabic">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sideEffects" className="font-arabic">
                    الآثار الجانبية
                  </Label>
                  <Textarea
                    id="sideEffects"
                    value={formData.sideEffects}
                    onChange={(e) => handleInputChange("sideEffects", e.target.value)}
                    className="font-arabic"
                    rows={2}
                    placeholder="أي آثار جانبية ملاحظة..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">نمط الحياة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-arabic">النظام الغذائي المنصوح</Label>
                    <RadioGroup
                      value={formData.dietRecommended?.toString() || ""}
                      onValueChange={(value) => handleInputChange("dietRecommended", value === "true")}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="true" id="diet-yes" />
                        <Label htmlFor="diet-yes" className="font-arabic">
                          نعم
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="false" id="diet-no" />
                        <Label htmlFor="diet-no" className="font-arabic">
                          لا
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-arabic">النشاط البدني</Label>
                    <RadioGroup
                      value={formData.exercise?.toString() || ""}
                      onValueChange={(value) => handleInputChange("exercise", value === "true")}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="true" id="exercise-yes" />
                        <Label htmlFor="exercise-yes" className="font-arabic">
                          نعم
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="false" id="exercise-no" />
                        <Label htmlFor="exercise-no" className="font-arabic">
                          لا
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="font-arabic">التدخين</Label>
                    <RadioGroup value={formData.smoking} onValueChange={(value) => handleInputChange("smoking", value)}>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="none" id="smoking-none" />
                        <Label htmlFor="smoking-none" className="font-arabic">
                          لا
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="occasional" id="smoking-occasional" />
                        <Label htmlFor="smoking-occasional" className="font-arabic">
                          أحياناً
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="daily" id="smoking-daily" />
                        <Label htmlFor="smoking-daily" className="font-arabic">
                          يومياً
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-arabic">الكحول</Label>
                    <RadioGroup value={formData.alcohol} onValueChange={(value) => handleInputChange("alcohol", value)}>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="none" id="alcohol-none" />
                        <Label htmlFor="alcohol-none" className="font-arabic">
                          لا
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="occasional" id="alcohol-occasional" />
                        <Label htmlFor="alcohol-occasional" className="font-arabic">
                          أحياناً
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="regular" id="alcohol-regular" />
                        <Label htmlFor="alcohol-regular" className="font-arabic">
                          منتظم
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Evaluation */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">تقييم المريض</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="font-arabic">معرفة المرض</Label>
                  <RadioGroup
                    value={formData.diseaseKnowledge}
                    onValueChange={(value) => handleInputChange("diseaseKnowledge", value)}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="good" id="knowledge-good" />
                      <Label htmlFor="knowledge-good" className="font-arabic">
                        جيدة
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="medium" id="knowledge-medium" />
                      <Label htmlFor="knowledge-medium" className="font-arabic">
                        متوسطة
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="low" id="knowledge-low" />
                      <Label htmlFor="knowledge-low" className="font-arabic">
                        ضعيفة
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="font-arabic">فهم العلاج</Label>
                  <RadioGroup
                    value={formData.treatmentUnderstanding}
                    onValueChange={(value) => handleInputChange("treatmentUnderstanding", value)}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="good" id="understanding-good" />
                      <Label htmlFor="understanding-good" className="font-arabic">
                        جيد
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="medium" id="understanding-medium" />
                      <Label htmlFor="understanding-medium" className="font-arabic">
                        متوسط
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="low" id="understanding-low" />
                      <Label htmlFor="understanding-low" className="font-arabic">
                        ضعيف
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="font-arabic">الاستقلالية في الإدارة</Label>
                  <RadioGroup
                    value={formData.selfManagement}
                    onValueChange={(value) => handleInputChange("selfManagement", value)}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="autonomous" id="management-autonomous" />
                      <Label htmlFor="management-autonomous" className="font-arabic">
                        مستقل
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="needsHelp" id="management-help" />
                      <Label htmlFor="management-help" className="font-arabic">
                        يحتاج مساعدة
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="font-arabic">ملاحظات الصيدلي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacistNotes" className="font-arabic">
                    الملاحظات
                  </Label>
                  <Textarea
                    id="pharmacistNotes"
                    value={formData.pharmacistNotes}
                    onChange={(e) => handleInputChange("pharmacistNotes", e.target.value)}
                    className="font-arabic"
                    rows={4}
                    placeholder="ملاحظات إضافية حول حالة المريض..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="font-arabic">
                    معلومات إضافية
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    className="font-arabic"
                    rows={3}
                    placeholder="أي معلومات إضافية..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                <ArrowRight className="h-4 w-4 ml-2" />
                <span className="font-arabic">إلغاء</span>
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span className="font-arabic">جاري الحفظ...</span>
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    <span className="font-arabic">حفظ الزيارة</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
