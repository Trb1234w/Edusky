'use client'

import { ClubCard } from "@/components/club-card"

interface ClubListItem {
  id: string;
  nom?: string;
  description?: string;
  categories?: { nom?: string }; // Assuming categories is an object with a nom property
  capacite?: number;
  theme_principal?: string;
  leader?: { full_name?: string }; // Assuming leader is an object with full_name
  image_url?: string;
  is_favorited?: boolean; // Add this prop
}

interface ClubsListProps {
  clubs: ClubListItem[]; // Use the new interface
  isLoading: boolean;
}

export function ClubsList({ clubs, isLoading }: ClubsListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 lg:gap-6">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 lg:gap-6">
      {clubs.map((club) => (
        <ClubCard
          key={club.id}
          id={club.id}
          name={club.nom || ""}
          description={club.description || ""}
          category={club.categories?.nom || ""}
          members={club.capacite || 0} // Using capacite as a proxy for members
          activities="Activités non spécifiées" // Placeholder
          president={club.leader?.full_name || "Inconnu"}
          image={club.image_url || "/placeholder.png"}
          verified={false} // Placeholder
          is_favorited={club.is_favorited || false} // Pass the new prop
        />
      ))}
    </div>
  );
}
