import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Users, Award } from "lucide-react"
import { FormationsFilterWrapper } from "@/components/formations-filter-wrapper"
import { FormationsHero } from "@/components/formations/FormationsHero"

import { getAllFormations } from "./get-locations"

export default async function FormationsPage() {
  const { data: formations } = await getAllFormations()

  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section (Desktop Only) */}
      <div className="hidden lg:block">
        <FormationsHero />
      </div>

      {/* Le composant wrapper gère maintenant toute la logique de filtrage et d'affichage */}
      <FormationsFilterWrapper initialFormations={formations || []} />

    </main>
  )
}
