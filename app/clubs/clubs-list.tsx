'use client'

import { ClubCard } from "@/components/club-card"

interface ClubListItem {
  id: string;
  nom?: string;
  description?: string;
  category_nom?: string;
  capacite?: number;
  theme_principal?: string;
  leader_full_name?: string;
  leader_avatar_url?: string;
  image_url?: string;
  is_favorited?: boolean;
}

interface ClubsListProps {
  clubs: ClubListItem[]; // Use the new interface
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
      {clubs.map((club) => (
        <ClubCard
          key={club.id}
          id={club.id}
          name={club.nom || ""}
          description={club.description || ""}
          category={club.category_nom || ""}
          members={club.capacite || 0} // Using capacite as a proxy for members
          activities="Activités non spécifiées" // Placeholder
          president={club.leader_full_name || "Inconnu"}
          image={club.image_url || "/placeholder.png"}
          verified={false} // Placeholder
          is_favorited={club.is_favorited || false} // Pass the new prop
        />
      ))}
    </div>
  );
}
