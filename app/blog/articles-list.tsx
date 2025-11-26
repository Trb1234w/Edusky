'use client'

import { BlogCard } from "@/components/blog-card"

interface ArticleListItem {
  id: string;
  titre?: string;
  extrait?: string;
  auteur_full_name?: string;
  auteur_avatar_url?: string;
  category_nom?: string;
  publie_at?: string;
  image_couverture?: string;
  vues?: number;
  likes_count?: number;
  comment_count?: number;
  is_favorited?: boolean;
}

interface ArticlesListProps {
  articles: ArticleListItem[]; // Use the new interface
  isLoading: boolean;
}

export function ArticlesList({ articles, isLoading }: ArticlesListProps) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <BlogCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return <p className="text-center text-lg text-muted-foreground mt-10">Aucun article trouvé.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
      {articles.map((article) => (
        <BlogCard
          key={article.id}
          id={article.id}
          title={article.titre || ""}
          excerpt={article.extrait || ""}
          author={article.auteur_full_name || "Inconnu"}
          authorRole="Auteur"
          authorAvatar={article.auteur_avatar_url || "/placeholder.svg"}
          category={article.category_nom || ""}
          date={new Date(article.publie_at || "").toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          readTime="5 min de lecture" // Placeholder
          image={article.image_couverture || "/placeholder.png"}
          views={article.vues || 0}
          likes={article.likes_count || 0}
          comments={article.comment_count || 0}
          is_favorited={article.is_favorited || false} // Pass the new prop
        />
      ))}
    </div>
  );
}
