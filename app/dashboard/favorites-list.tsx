'use client'

import { CourseCard } from "@/components/course-card"
import { EventCard } from "@/components/event-card"
import { ClubCard } from "@/components/club-card"
import { BlogCard } from "@/components/blog-card"
import { ProfesseurCard } from "@/components/professeur-card"
import { Card } from "@/components/ui/card"

interface FavoriteItem {
  id: string;
  type: 'formation' | 'club' | 'article' | 'professeur' | string;
  // All potential properties from the UNION in the SQL function
  title?: string;
  description?: string;
  image_url?: string;
  href?: string;
  category?: string;
  author?: string;
  // Make sure all card props are optional or have defaults
  [key: string]: any;
}

interface FavoritesListProps {
  favorites: FavoriteItem[];
  isLoading: boolean;
  onFavoriteToggle?: (itemId: string, itemType: string, isFavorited: boolean) => void;
}

export function FavoritesList({ favorites, isLoading, onFavoriteToggle }: FavoritesListProps) {
  const handleToggle = (id: string, type: string, newStatus: boolean) => {
    if (onFavoriteToggle) {
      onFavoriteToggle(id, type, newStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <CourseCard.Skeleton key={i} /> // Use a generic skeleton
        ))}
      </div>
    )
  }

  if (favorites.length === 0) {
    return <Card className="p-8 text-center text-muted-foreground">Vous n'avez encore aucun favori.</Card>;
  }

  const renderCard = (item: FavoriteItem) => {
    const commonProps = {
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      image: item.image_url || "/placeholder.png",
      is_favorited: true,
      onToggle: (newStatus: boolean) => handleToggle(item.id, item.type, newStatus),
    };

    switch (item.type) {
      case 'formation':
        const hoursPerDay = item.duree_heures ? `${item.duree_heures}h/j` : undefined;
        return (
          <CourseCard
            {...commonProps}
            instructor={item.author || "N/A"}
            category={item.category || ""}
            level={item.level || "N/A"}
            duration={item.nombre_jours ? `${item.nombre_jours} jours` : item.duree_texte || "N/A"}
            students={item.students || 0}
            rating={item.rating || 0}
            price={item.price || "Gratuit"}
            hoursPerDay={hoursPerDay}
            {...item}
          />
        );

      case 'club':
        return (
          <ClubCard
            {...commonProps}
            name={item.title || ""}
            president={item.author || "N/A"}
            category={item.category || ""}
            members={item.members || 0}
            activities={item.activities ? JSON.stringify(item.activities) : "Activités diverses"}
            prix_inscription={item.prix_inscription}
            cotisation_mensuelle={item.cotisation_mensuelle}
            lieu={item.lieu}
            pays_nom={item.pays?.nom}
            ville_nom={item.ville?.nom}
            quartier_nom={item.quartier?.nom}
            age_min={item.age_minimum}
            age_max={item.age_maximum}
            verified={item.is_verified}
          />
        );
      case 'article':
        return (
          <BlogCard
            {...commonProps}
            excerpt={item.description || ""}
            author={item.author || "N/A"}
            category={item.category || ""}
            authorRole={item.authorRole || "Auteur"}
            authorAvatar={item.authorAvatar || ""}
            date={item.date || new Date().toISOString()}
            readTime={item.readTime || "5 min"}
            views={item.views || 0}
            likes={item.likes || 0}
            comments={item.comments || 0}
            {...item}
          />
        );
      case 'professeur':
        return (
          <ProfesseurCard
            full_name={item.title || "Professeur"}
            avatar_url={item.image_url || "/placeholder.svg"}
            titre={item.category || "Enseignant"}
            specialites={item.specialites || []}
            note_moyenne={item.note_moyenne || 0}
            nb_etudiants_formes={item.nb_etudiants_formes || 0}
            {...item}
          />
        );
      default:
        return (
          <Card className="p-4">
            <h4 className="font-bold">{item.title}</h4>
            <p className="text-sm text-muted-foreground">Type de favori non supporté: {item.type}</p>
          </Card>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((item) => (
        <div key={`${item.type}-${item.id}`}>
          {renderCard(item)}
        </div>
      ))}
    </div>
  );
}
