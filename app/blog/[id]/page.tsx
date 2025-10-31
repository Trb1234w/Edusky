import { getArticleById } from "@/lib/data/blog.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Eye, Heart, MessageSquare, BookOpen } from "lucide-react";

// --- Helpers ---

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Date non spécifiée";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

// --- Page Component ---

export default async function ArticleDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const { data: article, error } = await getArticleById(resolvedParams.id);

  if (error || !article) {
    console.error("Failed to fetch article or article not found:", error);
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        
        {/* Colonne de gauche : Contenu principal */}
        <div className="lg:col-span-2 space-y-12">
          {/* Fil d'ariane */}
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            {article.categorie && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/blog?categorie=${article.categorie.slug}`} className="hover:text-primary transition-colors">
                  {article.categorie.nom}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="font-medium text-foreground">{article.titre}</span>
          </nav>

          <header className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{article.titre}</h1>
            <p className="text-xl text-muted-foreground">{article.extrait}</p>
            
            {article.auteur && (
              <div className="flex items-center space-x-4 pt-2">
                <Link href={`/profiles/${article.auteur.id}`} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={article.auteur.avatar_url || ''} alt={article.auteur.full_name || ''} />
                    <AvatarFallback>{article.auteur.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{article.auteur.full_name}</p>
                    <p className="text-sm text-muted-foreground">Auteur</p>
                  </div>
                </Link>
                {article.publie_at && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Publié le {formatDate(article.publie_at)}</span>
                  </div>
                )}
              </div>
            )}
          </header>

          {/* Badges de statistiques */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Eye className="h-4 w-4" /><span>{article.vues || 0} vues</span></Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Heart className="h-4 w-4" /><span>{article.likes_count || 0} likes</span></Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><MessageSquare className="h-4 w-4" /><span>{article.comment_count || 0} commentaires</span></Badge>
          </div>

          {/* Contenu de l'article */}
          <div className="prose prose-lg max-w-none text-foreground/90">
            <h2 className="text-2xl font-semibold mb-4">Contenu de l'article</h2>
            <div dangerouslySetInnerHTML={{ __html: article.contenu || '' }} />
          </div>
        </div>

        {/* Colonne de droite : Carte d'action */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <Card className="sticky top-24">
            <CardHeader className="p-0">
              {article.image_url ? (
                <Image src={article.image_url} alt={article.titre || ''} width={500} height={300} className="object-cover rounded-t-lg w-full" />
              ) : (
                <div className="h-48 bg-secondary rounded-t-lg flex items-center justify-center"><BookOpen className="h-12 w-12 text-muted-foreground" /></div>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CardTitle className="text-2xl font-bold">{article.titre}</CardTitle>
              <Button size="lg" className="w-full text-lg">
                Partager cet article
              </Button>
            </CardContent>
            <CardFooter className="p-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-5 w-5 text-primary"/>
                    <span>Par {article.auteur?.full_name || "Inconnu"}</span>
                </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
