'use client'

import { ClubCard } from "@/components/club-card"

interface ClubListItem {
  id: string;
  nom?: string;
  description?: string;
  category_nom?: string;
  capacite?: number;
  theme_principal?: string;
  langues?: string[];
  leader_full_name?: string;
  leader_avatar_url?: string;
  image_url?: string;
  is_favorited?: boolean;
  cotisation_mensuelle?: number;
  cotisation_annuelle?: number;
  prix_inscription?: number;
  lieu?: string;
  pays_nom?: string;
  ville_nom?: string;
  quartier_nom?: string;
  age_minimum?: number;
  age_maximum?: number;
}

interface ClubsListProps {
  clubs: ClubListItem[];
  isLoading: boolean;
}

export function ClubsList({ clubs, isLoading }: ClubsListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ClubCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  if (clubs.length === 0) {
    return <p className="text-center text-lg text-muted-foreground mt-10">Aucun club trouvé.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
      {clubs.map((club) => {
        const location = [club.quartier_nom, club.ville_nom, club.pays_nom].filter(Boolean).join(', ');
        return (
          <ClubCard
            key={club.id}
            id={club.id}
            name={club.nom || ""}
            description={club.description || ""}
            category={club.category_nom || ""}
            members={club.capacite || 0}
            activities="Activités non spécifiées"
            president={club.leader_full_name || "Inconnu"}
            image={club.image_url || "/placeholder.png"}
            verified={false}
            is_favorited={club.is_favorited || false}
            prix_inscription={club.prix_inscription}
            cotisation_mensuelle={club.cotisation_mensuelle}
            lieu={club.lieu}
            pays_nom={club.pays_nom}
            ville_nom={club.ville_nom}
            quartier_nom={club.quartier_nom}
            age_min={club.age_minimum}
            age_max={club.age_maximum}
          />
        )
      })}
    </div>
  );
}
