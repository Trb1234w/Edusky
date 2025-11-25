import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { EvenementsHero } from "@/components/evenements/EvenementsHero"
import { EvenementsFilterWrapper } from "@/components/evenements-filter-wrapper"

export default async function EvenementsPage() {
  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section */}
      <div className="hidden lg:block">
        <EvenementsHero />
      </div>

      {/* Le wrapper gère maintenant toute la logique de filtrage et d'affichage */}
      <EvenementsFilterWrapper />

    </main>
  )
}