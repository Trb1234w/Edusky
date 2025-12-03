import { ClubsHero } from "@/components/clubs/ClubsHero"
import { getAllClubs } from "./get-data"
import { ClubsFilterWrapper } from "@/components/clubs-filter-wrapper"

export default async function ClubsPage() {
  const { data: clubs } = await getAllClubs()

  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section */}
      <div className="hidden lg:block">
        <ClubsHero />
      </div>

      {/* Le wrapper gère maintenant toute la logique de filtrage et d'affichage */}
      <ClubsFilterWrapper initialClubs={clubs || []} />

    </main>
  )
}