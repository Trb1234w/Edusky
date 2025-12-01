'use client'

import { EventCard } from "@/components/event-card"

interface EventListItem {
  id: string;
  titre?: string;
  extrait?: string;
  description?: string;
  date_debut?: string;
  lieu?: string;
  mode?: string;
  category_nom?: string;
  capacite?: number;
  organisateur_full_name?: string;
  organisateur_avatar_url?: string;
  image_url?: string;
  is_favorited?: boolean;
  prix?: number;
  est_gratuit?: boolean;
}

interface EvenementsListProps {
  events: EventListItem[];
  isLoading: boolean;
}

export function EvenementsList({ events, isLoading }: EvenementsListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <EventCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return <p className="text-center text-lg text-muted-foreground mt-10">Aucun événement trouvé.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.titre || ""}
          description={event.extrait || event.description || ""}
          date={new Date(event.date_debut || "").toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          time={new Date(event.date_debut || "").toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          location={event.lieu || event.mode || ""}
          category={event.category_nom || ""}
          participants={0} // Placeholder
          maxParticipants={event.capacite || 0}
          organizer={event.organisateur_full_name || "Inconnu"}
          image={event.image_url || "/placeholder.png"}
          status={new Date(event.date_debut || "") > new Date() ? "upcoming" : "past"}
          is_favorited={event.is_favorited || false}
          price={event.prix}
          isFree={event.est_gratuit}
        />
      ))}
    </div>
  );
}
