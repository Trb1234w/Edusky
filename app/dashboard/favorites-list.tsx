'use client'

import { CourseCard } from "@/components/course-card"
import { EventCard } from "@/components/event-card"
import { ClubCard } from "@/components/club-card"
import { BlogCard } from "@/components/blog-card"
import { ProfesseurCard } from "@/components/professeur-card"
import { Card } from "@/components/ui/card"

interface FavoriteItem {
  id: string;
  type: 'formation' | 'evenement' | 'club' | 'article' | 'professeur' | string;
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
}

export function FavoritesList({ favorites, isLoading }: FavoritesListProps) {
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
    // We need to map the generic favorite item to specific card props
    // This is a simplified mapping, it might need adjustments based on card prop requirements
    const commonProps = {
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      image: item.image_url || "/placeholder.png",
      is_favorited: true, // All items in this list are favorites
    };

    switch (item.type) {
      case 'formation':
        return <CourseCard {...commonProps} instructor={item.author || "N/A"} category={item.category || ""} {...item} />;
      case 'evenement':
        return <EventCard {...commonProps} organizer={item.author || "N/A"} category={item.category || ""} {...item} />;
      case 'club':
        return <ClubCard {...commonProps} name={item.title || ""} president={item.author || "N/A"} category={item.category || ""} {...item} />;
      case 'article':
        return <BlogCard {...commonProps} excerpt={item.description || ""} author={item.author || "N/A"} category={item.category || ""} {...item} />;
      case 'professeur':
        return <ProfesseurCard {...commonProps} name={item.title || ""} title={item.category || ""} avatarUrl={item.image_url || "/placeholder.svg"} {...item} />;
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
