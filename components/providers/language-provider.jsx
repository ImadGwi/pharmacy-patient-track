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
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("ar")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "ar"
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
