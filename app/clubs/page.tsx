import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { ClubsHero } from "@/components/clubs/ClubsHero"
import { ClubsFilterWrapper } from "@/components/clubs-filter-wrapper"

export default async function ClubsPage() {
  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section */}
      <div className="hidden lg:block">
        <ClubsHero />
      </div>

      {/* Le wrapper gère maintenant toute la logique de filtrage et d'affichage */}
      <ClubsFilterWrapper />

    </main>
  )
}