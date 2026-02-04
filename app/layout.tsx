import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import AOSInitializer from "@/components/providers/AOSInitializer"
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/mobile-nav"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { OneSignalProvider } from "@/components/providers/onesignal-provider"


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: "EduSky - Plateforme Éducative Sociale",
  description: "Découvrez des professeurs, formations, événements et clubs éducatifs en Guinée",
  generator: "v0.app",
  manifest: "/manifest.json",
  keywords: ["éducation", "formation", "événements", "clubs", "professeurs", "Guinée", "apprentissage"],
  authors: [{ name: "Edusky" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Edusky",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Edusky",
    title: "EduSky - Plateforme Éducative Sociale",
    description: "Découvrez des professeurs, formations, événements et clubs éducatifs en Guinée",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSky - Plateforme Éducative Sociale",
    description: "Découvrez des professeurs, formations, événements et clubs éducatifs en Guinée",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${poppins.className} font-sans antialiased`}>
        <OneSignalProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <MobileNav />
          <Toaster />
          <AOSInitializer />
          <Analytics />
        </OneSignalProvider>
      </body>
    </html>
  )
}