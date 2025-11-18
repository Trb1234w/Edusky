import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Users, Award } from "lucide-react"
import { FormationsFilterWrapper } from "@/components/formations-filter-wrapper"

export default async function FormationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-1 lg:pt-20">
        {/* Hero Section */}
        <section className="hidden lg:block bg-gradient-to-br from-green-500 via-teal-500 to-cyan-600 py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                <BookOpen size={32} className="text-white" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                Explorez nos formations
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                Des cours adaptés à tous les niveaux pour développer vos compétences et atteindre vos objectifs.
              </p>
            </div>
          </div>
        </section>

        {/* Le composant wrapper gère maintenant toute la logique de filtrage et d'affichage */}
        <FormationsFilterWrapper />

        {/* Section d'appel à l’action */}
        <section className="bg-muted/30 py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Prêt à commencer votre apprentissage ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Inscrivez-vous dès aujourd’hui et accédez à des centaines de formations de qualité.
            </p>
            <Button size="lg" className="font-semibold text-lg px-8 py-6 rounded-xl">
              Créer un compte gratuit
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
