import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import { ProfesseursFilterWrapper } from "@/components/professeurs-filter-wrapper"

export default function ProfesseursPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-1 lg:pt-20">
        {/* Hero Section */}
        <section className="hidden lg:block bg-gradient-to-br from-blue-500 via-purple-600 to-pink-700 py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                <Briefcase size={32} className="text-white" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-balance">
                Trouvez votre professeur idéal
              </h1>
              <p className="text-lg text-white/90 leading-relaxed text-pretty">
                Découvrez des experts passionnés et certifiés pour vous
                accompagner dans votre parcours d'apprentissage.
              </p>
            </div>
          </div>
        </section>

        {/* Le wrapper gère maintenant toute la logique */}
        <ProfesseursFilterWrapper />


      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}