import { Inter, Amiri } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { LanguageProvider } from "@/components/providers/language-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
})

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <title>Tenes Pharmacy - Patient Management</title>
        <meta name="description" content="Professional pharmacy patient follow-up system" />
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
  --font-arabic: ${amiri.variable};
}
        `}</style>
      </head>
      <body className={`${inter.variable} ${amiri.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
