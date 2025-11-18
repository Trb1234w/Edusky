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
        <section className="hidden lg:block bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                <Calendar size={32} className="text-white" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-balance">
                Découvrez nos événements
              </h1>
              <p className="text-lg text-white/90 leading-relaxed text-pretty">
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

        {/* CTA Section */}
        <section className="bg-muted/30 py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground text-balance">
              Organisez votre événement
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
              Vous souhaitez organiser un événement éducatif ? Contactez-nous pour
              en discuter
            </p>
            <Button
              size="lg"
              className="font-semibold text-lg px-8 py-6 rounded-xl"
            >
              Proposer un événement
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}