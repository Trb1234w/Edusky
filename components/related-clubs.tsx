'use client'

import { ClubCard } from "@/components/club-card";

interface Club {
    id: string;
    nom: string;
    description: string | null;
    theme_principal: string | null;
    statut: string;
    image_url: string | null;
    leader?: {
        full_name: string | null;
    };
    categorie?: {
        nom: string;
    };
    inscriptions?: any[];
}

interface RelatedClubsProps {
    clubs: Club[];
}

export function RelatedClubs({ clubs }: RelatedClubsProps) {
    if (!clubs || clubs.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 bg-white">
            <h2 className="text-1xl md:text-3xl font-bold text-foreground mb-6">Autres clubs</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                {clubs.map((club) => (
                    <div key={club.id} className="flex-none w-[280px] md:w-[320px] snap-start">
                        <ClubCard
                            id={club.id}
                            name={club.nom}
                            description={club.description || ''}
                            category={club.categorie?.nom || 'Général'}
                            members={club.inscriptions?.length || 0}
                            activities={club.theme_principal || 'Activités variées'}
                            president={club.leader?.full_name || 'Non spécifié'}
                            image={club.image_url || '/placeholder.jpg'}
                            verified={club.statut === 'actif'}
                            is_favorited={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
