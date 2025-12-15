'use client'

import { ProfesseurCard } from "@/components/professeur-card";

interface Professeur {
    id: string;
    titre: string;
    type?: string;
    specialites: string[];
    note_moyenne: number;
    nb_etudiants_formes: number;
    annees_experience?: number;
    tarif_indicatif?: number;
    is_publie?: boolean;
    pays_nom?: string;
    ville_nom?: string;
    profile_full_name: string;
    profile_avatar_url: string;
}

interface RelatedProfesseursProps {
    professeurs: Professeur[];
}

export function RelatedProfesseurs({ professeurs }: RelatedProfesseursProps) {
    if (!professeurs || professeurs.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
            <h2 className="text-1xl md:text-3xl font-bold text-foreground mb-6">Autres professeurs</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                {professeurs.map((professeur) => (
                    <div key={professeur.id} className="flex-none w-[280px] md:w-[320px] snap-start">
                        <ProfesseurCard
                            id={professeur.id}
                            full_name={professeur.profile_full_name}
                            avatar_url={professeur.profile_avatar_url}
                            titre={professeur.titre}
                            type={professeur.type}
                            specialites={professeur.specialites || []}
                            note_moyenne={professeur.note_moyenne}
                            nb_etudiants_formes={professeur.nb_etudiants_formes}
                            annees_experience={professeur.annees_experience}
                            tarif_indicatif={professeur.tarif_indicatif}
                            is_verified={professeur.is_publie}
                            pays_nom={professeur.pays_nom}
                            ville_nom={professeur.ville_nom}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
