"use client"

import { usePathname } from "next/navigation"
import { ModernHeader } from "@/components/modern/ModernHeader"
import { ModernFooter } from "@/components/modern-footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Use ModernHeader/Footer for home page, regular Header/Footer for others
    const isHomePage = pathname === "/"

    return (
        <>
            {/* Header : Visible sur mobile UNIQUEMENT pour Accueil et Feed */}
            <div className={pathname === '/' || pathname.startsWith('/feed') || pathname.startsWith('/about-us') ? "block" : "hidden lg:block"}>
                <ModernHeader />
            </div>

            {children}

            {/* Footer : Visible sur mobile UNIQUEMENT pour Accueil et Feed */}
            <div className={pathname === '/' || pathname.startsWith('/about-us') ? "block" : "hidden lg:block"}>
                <ModernFooter />
            </div>
        </>
    )
}
