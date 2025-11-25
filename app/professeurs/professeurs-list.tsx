'use client'

import { ProfesseurCard } from "@/components/professeur-card"

interface ProfesseurListItem {
  id: string;
  profile_full_name?: string;
  profile_avatar_url?: string;
  titre?: string;
  type?: string;
  specialites?: string[];
  note_moyenne?: number;
  nb_etudiants_formes?: number;
  annees_experience?: number;
  tarif_indicatif?: number;
  profile_is_verified?: boolean;
  pays_nom?: string;
  ville_nom?: string;
}

interface ProfesseursListProps {
  professeurs: ProfesseurListItem[];
  isLoading: boolean;
}

export function ProfesseursList({ professeurs, isLoading }: ProfesseursListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
      {professeurs.map((professeur) => (
        <ProfesseurCard
          key={professeur.id}
          id={professeur.id}
          full_name={professeur.profile_full_name || "Inconnu"}
          avatar_url={professeur.profile_avatar_url || "/placeholder.svg"}
          titre={professeur.titre || "Professeur"}
          type={professeur.type}
          specialites={professeur.specialites || []}
          note_moyenne={professeur.note_moyenne || 0}
          nb_etudiants_formes={professeur.nb_etudiants_formes || 0}
          annees_experience={professeur.annees_experience}
          tarif_indicatif={professeur.tarif_indicatif}
          is_verified={professeur.profile_is_verified}
          pays_nom={professeur.pays_nom}
          ville_nom={professeur.ville_nom}
        />
      ))}
    </div>
  );
}