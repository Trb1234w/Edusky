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
  nb_avis?: number;
  note_moyenne?: number;
  prix_indicatif?: number;
  image_url?: string;
  is_favorited?: boolean;
  langue_enseignement?: string;
  certificat?: boolean;
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
      {formations.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.titre || ""}
          description={course.extrait || ""}
          instructor={course.professeur_full_name || "Inconnu"}
          category={course.category_nom || ""}
          level={course.niveau || ""}
          duration={course.duree_texte || ""}
          students={course.nb_avis || 0}
          rating={course.note_moyenne || 0}
          price={course.prix_indicatif ? `${course.prix_indicatif} GNF` : "Gratuit"}
          image={course.image_url || "/placeholder.png"}
          is_favorited={course.is_favorited || false}
          language={course.langue_enseignement}
          certificate={course.certificat}
        />
      ))}
    </div>
  );
}
