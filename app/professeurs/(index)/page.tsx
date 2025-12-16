
import { ProfesseursHero } from "@/components/professeurs/ProfesseursHero"
import { ProfesseursFilterWrapper } from "@/components/professeurs-filter-wrapper"
import {
  getAllProfesseurs,
  getDistinctProfesseurLocations,
  getDistinctProfesseurTypes,
  getDistinctProfesseurSpecialties,
  getDistinctProfesseurLangues
} from "../get-locations"

export default async function ProfesseursPage() {
  // Parallel data fetching on the server
  const [
    professeursResult,
    locationsResult,
    typesResult,
    specialtiesResult,
    languesResult
  ] = await Promise.all([
    getAllProfesseurs(),
    getDistinctProfesseurLocations(),
    getDistinctProfesseurTypes(),
    getDistinctProfesseurSpecialties(),
    getDistinctProfesseurLangues()
  ]);

  const initialProfesseurs = professeursResult.data || [];
  const initialLocations = locationsResult.data || { countries: [], villes: [], quartiers: [] };
  const initialTypes = typesResult.data || [];
  const initialSpecialties = specialtiesResult.data || [];
  const initialLangues = languesResult.data || [];

  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section (Desktop Only) */}
      <div className="hidden lg:block">
        <ProfesseursHero />
      </div>

      {/* Le wrapper gère maintenant toute la logique avec les données initiales */}
      <ProfesseursFilterWrapper
        initialProfesseurs={initialProfesseurs}
        initialLocations={initialLocations}
        initialTypes={initialTypes}
        initialSpecialties={initialSpecialties}
        initialLangues={initialLangues}
      />

    </main>
  )
}