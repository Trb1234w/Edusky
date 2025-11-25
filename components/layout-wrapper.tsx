"use client"

import { usePathname } from "next/navigation"
import { ModernHeader } from "@/components/modern/ModernHeader"
import { Header } from "@/components/header"
import { ModernFooter } from "@/components/modern-footer"
import { Footer } from "@/components/footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Use ModernHeader/Footer for home page, regular Header/Footer for others
    const isHomePage = pathname === "/"

    return (
        <>
            {isHomePage ? <ModernHeader /> : <Header />}
            {children}
            {isHomePage ? <ModernFooter /> : <Footer />}
        </>
    )
}
