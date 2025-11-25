import { ProfesseursHero } from "@/components/professeurs/ProfesseursHero"
import { ProfesseursFilterWrapper } from "@/components/professeurs-filter-wrapper"

export default function ProfesseursPage() {
  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section (Desktop Only) */}
      <div className="hidden lg:block">
        <ProfesseursHero />
      </div>

      {/* Le wrapper gère maintenant toute la logique */}
      <ProfesseursFilterWrapper />

    </main>
  )
}