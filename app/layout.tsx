import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"


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
            <main>
              {children}
            </main>
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
