import { getAllEvenements } from "./get-data"
import { EvenementsFilterWrapper } from "@/components/evenements-filter-wrapper"
import { EvenementsHero } from "@/components/evenements/EvenementsHero"

export default async function EvenementsPage() {
  const { data: events } = await getAllEvenements()

  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section */}
      <div className="hidden lg:block">
        <EvenementsHero />
      </div>

      {/* Le wrapper gère maintenant toute la logique de filtrage et d'affichage */}
      <EvenementsFilterWrapper initialEvents={events || []} />

    </main>
  )
}