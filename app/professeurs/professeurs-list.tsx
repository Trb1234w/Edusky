'use client'

import { ProfesseurCard } from "@/components/professeur-card"

interface ProfesseursListProps {
  professeurs: any[];
  isLoading: boolean;
}

export function ProfesseursList({ professeurs, isLoading }: ProfesseursListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProfesseurCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  if (professeurs.length === 0) {
    return <p className="text-center text-lg text-muted-foreground mt-10">Aucun professeur trouvé.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 lg:gap-6">
      {professeurs.map((professeur) => (
        <ProfesseurCard
          key={professeur.id}
          id={professeur.id}
          name={professeur.profiles?.full_name || "Inconnu"}
          title={professeur.titre || ""}
          specialties={professeur.specialites || []}
          rating={professeur.note_moyenne || 0}
          students={professeur.nb_etudiants_formes || 0}
          experience={professeur.annees_experience || 0}
          avatarUrl={professeur.profiles?.avatar_url || "/placeholder.svg"}
          isVerified={professeur.is_publie} // Assuming is_publie means verified for display
          hasCertifications={professeur.certifications && professeur.certifications.length > 0}
        />
      ))}
    </div>
  );
}