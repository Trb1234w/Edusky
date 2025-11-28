'use client'

import { CourseCard } from "@/components/course-card";

interface Formation {
    id: string;
    titre: string;
    extrait: string | null;
    prix_indicatif: number | null;
    duree_texte: string | null;
    niveau: string | null;
    nb_etudiants_inscrits: number | null;
    note_moyenne: number;
    image_url: string | null;
    professeur?: {
        profiles?: {
            full_name: string | null;
        };
    };
    categorie?: {
        nom: string;
    };
}

interface RelatedFormationsProps {
    formations: Formation[];
}

const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return "N/A";
    if (price === 0) return "Gratuit";
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(price);
};

export function RelatedFormations({ formations }: RelatedFormationsProps) {
    if (!formations || formations.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/50 dark:bg-gray-900/20">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Autres formations</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                {formations.map((formation) => (
                    <div key={formation.id} className="flex-none w-[280px] md:w-[320px] snap-start">
                        <CourseCard
                            id={formation.id}
                            title={formation.titre}
                            description={formation.extrait || ''}
                            instructor={formation.professeur?.profiles?.full_name || 'Non spécifié'}
                            category={formation.categorie?.nom || 'Général'}
                            level={formation.niveau || 'Tous niveaux'}
                            duration={formation.duree_texte || 'N/A'}
                            students={formation.nb_etudiants_inscrits || 0}
                            rating={formation.note_moyenne || 0}
                            price={formatPrice(formation.prix_indicatif)}
                            image={formation.image_url || '/placeholder.jpg'}
                            is_favorited={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
