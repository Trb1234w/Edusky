'use client'

import { BlogCard } from "@/components/blog-card";

interface Article {
    id: string;
    titre: string;
    extrait: string | null;
    contenu: string;
    image_url: string | null;
    publie_at: string;
    vues: number | null;
    likes_count: number | null;
    comment_count: number | null;
    auteur?: {
        full_name: string | null;
        avatar_url: string | null;
    };
    categorie?: {
        nom: string;
    };
}

interface RelatedArticlesProps {
    articles: Article[];
}

const calculateReadingTime = (content: string): number => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const textLength = content.split(/\s+/).length;
    return Math.ceil(textLength / wordsPerMinute);
};

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
        return 'Date inconnue';
    }
};

export function RelatedArticles({ articles }: RelatedArticlesProps) {
    if (!articles || articles.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Autres articles de blog</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                {articles.map((article) => (
                    <div key={article.id} className="flex-none w-[320px] md:w-[360px] snap-start">
                        <BlogCard
                            id={article.id}
                            title={article.titre}
                            excerpt={article.extrait || ''}
                            author={article.auteur?.full_name || 'Anonyme'}
                            authorRole="Contributeur"
                            authorAvatar={article.auteur?.avatar_url || ''}
                            category={article.categorie?.nom || 'Général'}
                            date={formatDate(article.publie_at)}
                            readTime={`${calculateReadingTime(article.contenu)} min`}
                            views={article.vues || 0}
                            likes={article.likes_count || 0}
                            comments={article.comment_count || 0}
                            image={article.image_url || '/placeholder.jpg'}
                            is_favorited={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
