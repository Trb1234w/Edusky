import { getArticleById, getRelatedArticlesByCategory } from "@/lib/data/blog.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RelatedArticles } from "@/components/related-articles";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, ChevronLeft } from "lucide-react";
import { ContentActions } from "@/components/content-actions";
import { incrementArticleViews, getArticleComments, checkUserLiked } from "@/app/blog/actions";
import { ArticleInteractions } from "@/components/blog/ArticleInteractions";
import { CommentsList } from "@/components/blog/CommentsList";
import { CommentForm } from "@/components/blog/CommentForm";
import { createClient } from "@/lib/supabase/server";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// --- Helpers ---

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Date non spécifiée";
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

const calculateReadingTime = (content: string): number => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const textLength = content.split(/\s+/).length;
    return Math.ceil(textLength / wordsPerMinute);
};

// --- Page Component ---

async function RelatedArticlesSection({ articleId, categoryId }: { articleId: string, categoryId: number }) {
    const { data: relatedArticles } = await getRelatedArticlesByCategory(articleId, categoryId);
    return <RelatedArticles articles={relatedArticles || []} />;
}

export async function ArticleDetailsPageContent({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
    const { data: article, error } = await getArticleById(resolvedParams.id);

    if (error || !article) {
        console.error("Failed to fetch article or article not found:", error);
        notFound();
    }

    const readingTime = calculateReadingTime(article.contenu);

    // Incrémenter les vues (server-side)
    await incrementArticleViews(resolvedParams.id);

    // Récupérer les commentaires
    const { data: comments } = await getArticleComments(resolvedParams.id);

    // Vérifier si l'utilisateur a liké
    const { liked: userLiked } = await checkUserLiked(resolvedParams.id);

    // Récupérer l'utilisateur connecté pour le formulaire
    // Récupérer l'utilisateur connecté pour le formulaire
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch profile only if user exists
    let userProfile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();
        userProfile = data;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="hidden lg:block">
                <Header />
            </div>

            {/* Mobile-only Header */}
            <div className="lg:hidden p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between">
                <Link href="/blog" className="p-2 -ml-2 rounded-full hover:bg-muted">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                {article.auteur && (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={article.auteur.avatar_url || ''} alt={article.auteur.full_name || ''} />
                            <AvatarFallback>{article.auteur.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-bold text-sm truncate">{article.auteur.full_name}</p>
                    </div>
                )}
                <ContentActions
                    itemId={article.id}
                    itemTitle={article.titre}
                    itemType="article"
                    initialIsFavorited={article.is_favorited}
                    variant="mobile"
                />
            </div>

            <main className="flex-1 lg:pt-24">
                <div className="relative">
                    {/* Article Interactions Component (Desktop Sidebar + Mobile Sticky Bar) */}
                    <ArticleInteractions
                        articleId={resolvedParams.id}
                        initialLikesCount={article.likes_count || 0}
                        initialCommentsCount={article.comment_count || 0}
                        initialViews={article.vues || 0}
                        initialUserLiked={userLiked}
                        initialIsFavorited={article.is_favorited}
                    />

                    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                        <header className="mb-12 text-center">
                            {article.categorie && (
                                <Link href={`/blog?categorie=${article.categorie.slug}`} className="text-sm font-bold text-primary uppercase tracking-wider hover:underline">
                                    {article.categorie.nom}
                                </Link>
                            )}
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mt-4 leading-tight">{article.titre}</h1>
                            <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-3xl mx-auto">{article.extrait}</p>
                            <div className="flex items-center justify-center space-x-6 mt-8">
                                {article.auteur && (
                                    <Link href={`/profiles/${article.auteur.id}`} className="flex items-center space-x-3 group">
                                        <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary transition-colors">
                                            <AvatarImage src={article.auteur.avatar_url || ''} alt={article.auteur.full_name || ''} />
                                            <AvatarFallback>{article.auteur.full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-lg text-foreground">{article.auteur.full_name}</p>
                                            <p className="text-sm text-muted-foreground">{formatDate(article.publie_at)} · {readingTime} min de lecture</p>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </header>

                        {article.image_url && (
                            <div className="relative h-64 md:h-96 lg:h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl mb-12">
                                <Image src={article.image_url} alt={article.titre || ''} layout="fill" objectFit="cover" className="bg-secondary" />
                            </div>
                        )}

                        <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto text-foreground/90">
                            <div dangerouslySetInnerHTML={{ __html: article.contenu || 'Contenu de l\'article à venir.' }} />
                        </div>

                        {/* Article Metadata */}
                        {(article.tags && article.tags.length > 0) && (
                            <div className="max-w-3xl mx-auto mt-12">
                                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-sm">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Article Dates */}
                        <div className="max-w-3xl mx-auto mt-8 text-sm text-muted-foreground">
                            <div className="flex flex-wrap gap-4">
                                {article.created_at && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Créé le {formatDate(article.created_at)}</span>
                                    </div>
                                )}
                                {article.updated_at && article.updated_at !== article.created_at && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Mis à jour le {formatDate(article.updated_at)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator className="my-16" />

                        {/* Comments Section */}
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8">{article.comment_count || 0} Commentaires</h2>

                            {/* Liste des commentaires */}
                            <CommentsList comments={comments || []} />

                            {/* Formulaire pour ajouter un commentaire */}
                            <CommentForm
                                articleId={resolvedParams.id}
                                userAvatar={userProfile?.avatar_url}
                                userFullName={userProfile?.full_name}
                            />
                        </div>

                    </article>
                </div>

                {/* Related Articles Section */}
                <Suspense fallback={
                    <div className="container mx-auto px-4 py-8 max-w-7xl">
                        <Skeleton className="h-8 w-48 mb-6" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-96 w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>
                }>
                    <RelatedArticlesSection articleId={article.id} categoryId={article.categorie_id} />
                </Suspense>

            </main>

            <div className="hidden lg:block">
                <Footer />
            </div>
        </div>
    );
}
