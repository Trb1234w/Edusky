import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { EvenementsFilterWrapper } from "@/components/evenements-filter-wrapper"

export default async function EvenementsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-1 lg:pt-20">
        {/* Hero Section */}
        <section className="hidden lg:block bg-gradient-to-r from-primary to-secondary py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background/60 backdrop-blur-sm mb-6">
                <Calendar size={32} className="text-primary" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-secondary-foreground mb-4 text-balance">
                Découvrez nos événements
              </h1>
              <p className="text-lg text-secondary-foreground leading-relaxed text-pretty">
                Participez à des hackathons, conférences et concours éducatifs pour
                enrichir votre parcours
              </p>
            </div>
          </div>
        </section>

        {/* Le wrapper gère maintenant toute la logique de filtrage et d'affichage */}
        <EvenementsFilterWrapper
          gradient="from-orange-500 to-red-500"
        />


      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}