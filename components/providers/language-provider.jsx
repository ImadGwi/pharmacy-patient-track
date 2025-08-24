"use client"

import { createContext, useContext, useEffect, useState } from "react"

const LanguageContext = createContext()

const translations = {
  ar: {
    // Navigation
    patients: "المرضى",
    newPatient: "مريض جديد",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",

    // Auth
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    fullName: "الاسم الكامل",

    // Settings
    theme: "المظهر",
    language: "اللغة",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الداكن",
    arabic: "العربية",
    french: "الفرنسية",

    // Patient Management
    patientProfile: "ملف المريض",
    newVisit: "زيارة جديدة",
    editPatient: "تعديل المريض",
    deletePatient: "حذف المريض",
    editVisit: "تعديل الزيارة",
    deleteVisit: "حذف الزيارة",

    // Forms
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    birthDate: "تاريخ الميلاد",
    phone: "رقم الهاتف",
    primaryPhysician: "الطبيب المعالج",
    specialists: "الأطباء المختصون",
    chronicConditions: "الأمراض المزمنة",
    allergies: "الحساسية",
    familyHistory: "التاريخ العائلي",

    // Visit Form
    medicalFollowup: "المتابعة الطبية",
    lastGPVisit: "آخر زيارة للطبيب العام",
    lastSpecialistVisit: "آخر زيارة للمختص",
    lastLabTests: "آخر فحوصات",
    nextAppointment: "الموعد القادم",
    currentTreatment: "العلاج الحالي",
    medications: "الأدوية",
    addMedication: "إضافة دواء",
    medicationName: "اسم الدواء",
    dosage: "الجرعة",
    treatmentDuration: "مدة العلاج",
    adherence: "الالتزام بالعلاج",
    organization: "تنظيم الأدوية",
    sideEffects: "الآثار الجانبية",
    lifestyle: "نمط الحياة",
    dietRecommended: "النظام الغذائي المنصوح",
    exercise: "النشاط البدني",
    smoking: "التدخين",
    alcohol: "الكحول",
    patientEvaluation: "تقييم المريض",
    diseaseKnowledge: "معرفة المرض",
    treatmentUnderstanding: "فهم العلاج",
    selfManagement: "الاستقلال في الإدارة",
    pharmacistNotes: "ملاحظات الصيدلي",
    additionalInfo: "معلومات إضافية",

    // Medical Tests
    medicalTests: "الفحوصات الطبية",
    addTest: "إضافة فحص",
    testName: "نوع الفحص",
    testValue: "القيمة",
    testUnit: "الوحدة",
    bloodSugar: "سكر الدم",
    bloodPressure: "ضغط الدم",
    value: "القيمة",
    unit: "الوحدة",
    date: "التاريخ",
    notes: "الملاحظات",

    // Actions
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    confirm: "تأكيد",
    yes: "نعم",
    no: "لا",
    good: "جيد",
    medium: "متوسط",
    poor: "ضعيف",
    autonomous: "مستقل",
    needsHelp: "يحتاج مساعدة",
  },
  fr: {
    // Navigation
    patients: "Patients",
    newPatient: "Nouveau Patient",
    settings: "Paramètres",
    logout: "Déconnexion",
    login: "Connexion",
    signup: "Inscription",

    // Auth
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    fullName: "Nom complet",

    // Settings
    theme: "Thème",
    language: "Langue",
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    arabic: "Arabe",
    french: "Français",

    // Patient Management
    patientProfile: "Profil Patient",
    newVisit: "Nouvelle Visite",
    editPatient: "Modifier Patient",
    deletePatient: "Supprimer Patient",
    editVisit: "Modifier Visite",
    deleteVisit: "Supprimer Visite",

    // Forms
    firstName: "Prénom",
    lastName: "Nom de famille",
    birthDate: "Date de naissance",
    phone: "Téléphone",
    primaryPhysician: "Médecin traitant",
    specialists: "Spécialistes",
    chronicConditions: "Pathologies chroniques",
    allergies: "Allergies",
    familyHistory: "Antécédents familiaux",

    // Visit Form
    medicalFollowup: "Suivi médical",
    lastGPVisit: "Dernière consultation médecin traitant",
    lastSpecialistVisit: "Dernière consultation spécialiste",
    lastLabTests: "Derniers examens biologiques",
    nextAppointment: "Prochain rendez-vous",
    currentTreatment: "Traitement actuel",
    medications: "Médicaments",
    addMedication: "Ajouter médicament",
    medicationName: "Nom du médicament",
    dosage: "Posologie",
    treatmentDuration: "Durée du traitement",
    adherence: "Observance",
    organization: "Organisation",
    sideEffects: "Effets indésirables",
    lifestyle: "Mode de vie",
    dietRecommended: "Régime alimentaire conseillé",
    exercise: "Activité physique",
    smoking: "Tabac",
    alcohol: "Alcool",
    patientEvaluation: "Évaluation patient",
    diseaseKnowledge: "Connaissance de sa maladie",
    treatmentUnderstanding: "Compréhension du traitement",
    selfManagement: "Autonomie dans la gestion",
    pharmacistNotes: "Notes pharmaceutiques",
    additionalInfo: "Informations supplémentaires",

    // Medical Tests
    medicalTests: "Tests médicaux",
    addTest: "Ajouter test",
    testName: "Type de test",
    testValue: "Valeur",
    testUnit: "Unité",
    bloodSugar: "Glycémie",
    bloodPressure: "Tension artérielle",
    value: "Valeur",
    unit: "Unité",
    date: "Date",
    notes: "Notes",

    // Actions
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    confirm: "Confirmer",
    yes: "Oui",
    no: "Non",
    good: "Bonne",
    medium: "Moyenne",
    poor: "Mauvaise",
    autonomous: "Autonome",
    needsHelp: "Aide nécessaire",
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("fr")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "fr"
    setLanguage(savedLanguage)
    document.documentElement.lang = savedLanguage
    document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"
  }, [])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    document.documentElement.lang = newLanguage
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
  }

  const t = (key) => {
    return translations[language]?.[key] || key
  }

  return <LanguageContext.Provider value={{ language, changeLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
