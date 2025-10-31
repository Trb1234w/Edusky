'use client'

import { CourseCard } from "@/components/course-card"

interface FormationsListProps {
  formations: any[];
  isLoading: boolean;
}

export function FormationsList({ formations, isLoading }: FormationsListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 lg:gap-6">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 lg:gap-6">
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
        />
      ))}
    </div>
  );
}
