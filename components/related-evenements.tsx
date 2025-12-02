'use client'

import { EventCard } from "@/components/event-card";

interface Evenement {
    id: string;
    titre: string;
    extrait: string | null;
    date_debut: string;
    capacite: number | null;
    image_url: string | null;
    organisateur?: {
        full_name: string | null;
    };
    categorie?: {
        nom: string;
    };
    pays?: {
        nom: string;
    };
    ville?: {
        nom: string;
    };
}

interface RelatedEvenementsProps {
    evenements: Evenement[];
}

const formatTime = (date: string) => {
    try {
        return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '00:00';
    }
};

export function RelatedEvenements({ evenements }: RelatedEvenementsProps) {
    if (!evenements || evenements.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-12 bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Autres événements</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-4">
                {evenements.map((evenement) => (
                    <div key={evenement.id} className="flex-none w-[280px] snap-start md:w-auto">
                        <EventCard
                            id={evenement.id}
                            title={evenement.titre}
                            description={evenement.extrait || ''}
                            date={evenement.date_debut}
                            time={formatTime(evenement.date_debut)}
                            location={`${evenement.ville?.nom || ''}, ${evenement.pays?.nom || ''}`.trim().replace(/^,\s*/, '') || 'Lieu non spécifié'}
                            organizer={evenement.organisateur?.full_name || 'Non spécifié'}
                            category={evenement.categorie?.nom || 'Général'}
                            participants={0}
                            maxParticipants={evenement.capacite || 0}
                            status="upcoming"
                            image={evenement.image_url || '/placeholder.jpg'}
                            is_favorited={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
