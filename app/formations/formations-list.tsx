'use client'

import { CourseCard } from "@/components/course-card"

interface FormationListItem {
  id: string;
  titre?: string;
  extrait?: string;
  professeur_full_name?: string;
  category_nom?: string;
  niveau?: string;
  duree_texte?: string;
  nombre_jours?: number;
  nb_avis?: number;
  note_moyenne?: number;
  prix_indicatif?: number;
  prix_inscription?: number;
  lieu?: string;
  pays_nom?: string;
  ville_nom?: string;
  quartier_nom?: string;
  image_url?: string;
  is_favorited?: boolean;
  langue_enseignement?: string;
  certificat?: boolean;
  duree_heures?: number;
  nombre_jours?: number;
}

interface FormationsListProps {
  formations: FormationListItem[];
  isLoading: boolean;
}

export function FormationsList({ formations, isLoading }: FormationsListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  if (formations.length === 0) {
    return <p className="text-center text-lg text-muted-foreground mt-10">Aucune formation trouvée.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
      {formations.map((course) => {
        const hoursPerDay =
          course.duree_heures
            ? `${course.duree_heures}h/j`
            : undefined;

        return (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.titre || ""}
            description={course.extrait || ""}
            instructor={course.professeur_full_name || "Inconnu"}
            category={course.category_nom || ""}
            level={course.niveau || ""}
            duration={course.nombre_jours ? `${course.nombre_jours} jours` : course.duree_texte || ""}
            students={course.nb_avis || 0}
            rating={course.note_moyenne || 0}
            price={course.prix_indicatif ? `${course.prix_indicatif.toLocaleString()} GNF` : "N/A"}
            inscriptionPrice={course.prix_inscription ? `${course.prix_inscription.toLocaleString()} GNF` : "Gratuit"}
            image={course.image_url || "/placeholder.png"}
            is_favorited={course.is_favorited || false}
            language={course.langue_enseignement}
            certificate={course.certificat}
            lieu={course.lieu}
            pays_nom={course.pays_nom}
            ville_nom={course.ville_nom}
            quartier_nom={course.quartier_nom}
            hoursPerDay={hoursPerDay}
          />
        );
      })}
    </div>
  );
}
