import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { ClubsFilterWrapper } from "@/components/clubs-filter-wrapper"

export default async function ClubsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-1 lg:pt-20">
        {/* Hero Section */}
        <section className="hidden lg:block bg-gradient-to-r from-primary to-secondary py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background/60 backdrop-blur-sm mb-6">
                <Users size={32} className="text-primary" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-secondary-foreground mb-4 text-balance">
                Rejoignez nos clubs
              </h1>
              <p className="text-lg text-secondary-foreground leading-relaxed text-pretty">
                Intégrez des clubs et activités extrascolaires pour enrichir votre
                expérience et développer de nouvelles passions
              </p>
            </div>
          </div>
        </section>

        {/* Le wrapper gère maintenant toute la logique */}
        <ClubsFilterWrapper
          gradient="from-blue-500 to-cyan-500"
        />


      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}