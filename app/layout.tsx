import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import AOSInitializer from "./components/AOSInitializer"
import { Toaster } from "@/components/ui/toaster"
import { MobileNav } from "@/components/mobile-nav"
import { LayoutWrapper } from "@/components/layout-wrapper"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "EduSky - Plateforme Éducative Sociale",
  description: "Découvrez des professeurs, formations, événements et clubs éducatifs en Guinée",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${poppins.className} font-sans antialiased`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <MobileNav />
        <Toaster />
        <AOSInitializer />
        <Analytics />
      </body>
    </html>
  )
}