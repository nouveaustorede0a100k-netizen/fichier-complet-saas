import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navigation, MobileNavigation } from "@/components/navigation"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Drop Eazy - Création de Business Digitaux Automatisés",
  description: "SaaS IA pour identifier les opportunités de marché, créer des offres digitales rentables et lancer votre produit rapidement",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <MobileNavigation />
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
