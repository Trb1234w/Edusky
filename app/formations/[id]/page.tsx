
import { getFormationById } from "@/lib/data/formations.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewCard } from "@/components/review-card";
import { InscriptionModal } from "@/components/inscription-modal";
import { Clock, BarChart3, Star, BookOpen, Video, FileText, Award, Calendar, User, MapPin } from "lucide-react";

// --- Helpers ---

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return "Prix non disponible";
  if (price === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF" }).format(price);
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Date non spécifiée";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const StarRating = ({ rating, totalStars = 5 }: { rating: number, totalStars?: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
      {halfStar && <Star key="half" className="h-5 w-5 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />)}
    </div>
  );
};


// --- Page Component ---

export default async function FormationDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const { data: formation, error } = await getFormationById(resolvedParams.id);

  if (error || !formation) {
    console.error("Failed to fetch formation or formation not found:", error);
    notFound();
  }

  const curriculum = Array.isArray(formation.curriculum) ? formation.curriculum : [];
  const sessions = Array.isArray(formation.sessions) ? formation.sessions : [];
  const avis = Array.isArray(formation.avis) ? formation.avis : [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        
        {/* Colonne de gauche : Contenu principal */}
        <div className="lg:col-span-2 space-y-12">
          {/* Fil d'ariane */}
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/formations" className="hover:text-primary transition-colors">Formations</Link>
            {formation.categorie && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/formations?categorie=${formation.categorie.slug}`} className="hover:text-primary transition-colors">
                  {formation.categorie.nom}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="font-medium text-foreground">{formation.titre}</span>
          </nav>

          <header className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{formation.titre}</h1>
            <p className="text-xl text-muted-foreground">{formation.extrait}</p>
            
            {formation.professeur && (
              <div className="flex items-center space-x-4 pt-2">
                <Link href={`/professeurs/${formation.professeur.id}`} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={formation.professeur.profiles?.avatar_url || ''} alt={formation.professeur.profiles?.full_name || ''} />
                    <AvatarFallback>{formation.professeur.profiles?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{formation.professeur.profiles?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{formation.professeur.titre}</p>
                  </div>
                </Link>
              </div>
            )}
          </header>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Clock className="h-4 w-4" /><span>{formation.duree_texte || 'N/A'}</span></Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><BarChart3 className="h-4 w-4" /><span>Niveau {formation.niveau || 'Tous niveaux'}</span></Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Star className="h-4 w-4" /><span>{formation.note_moyenne} ({avis.length} avis)</span></Badge>
            {(formation.pays || formation.ville) && (
              <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3">
                <MapPin className="h-4 w-4" />
                <span>{[formation.quartier?.nom, formation.ville?.nom, formation.pays?.nom].filter(Boolean).join(', ')}</span>
              </Badge>
            )}
          </div>

          <div className="prose prose-lg max-w-none text-foreground/90">
            <h2 className="text-2xl font-semibold mb-4">À propos de cette formation</h2>
            <p>{formation.description}</p>
          </div>

          {/* NOUVEAU: Section Sessions */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Prochaines Sessions</h2>
            {sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map(session => (
                  <div key={session.id} className="p-4 border rounded-lg bg-background/50">
                    <div className="flex items-center gap-4 text-sm">
                      <Calendar className="h-5 w-5 text-primary"/>
                      <div>
                        <p className="font-semibold">Début: {formatDate(session.debut)}</p>
                        <p className="text-muted-foreground">Fin: {formatDate(session.fin)}</p>
                      </div>
                    </div>
                    {session.lieu && <div className="flex items-center gap-4 text-sm mt-2"><MapPin className="h-5 w-5 text-primary"/><p>{session.lieu}</p></div>}
                    {session.capacite && <div className="flex items-center gap-4 text-sm mt-2"><Users className="h-5 w-5 text-primary"/><p>{session.places_reservees || 0} / {session.capacite} places</p></div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune session n'est programmée pour le moment.</p>
            )}
          </div>

          {/* Section Curriculum (existante) */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contenu du cours</h2>
            {curriculum.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {curriculum.map((module: any, index: number) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-medium">{module.title || `Module ${index + 1}`}</AccordionTrigger>
                    <AccordionContent className="space-y-2 text-muted-foreground">
                      {module.lessons && module.lessons.map((lesson: any, lessonIndex: number) => (
                        <div key={lessonIndex} className="flex items-center gap-3 ml-4">
                          {lesson.type === 'video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          <span>{lesson.title}</span>
                          <span className="ml-auto text-xs">{lesson.duration}</span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground">Le curriculum de ce cours n'est pas encore disponible.</p>
            )}
          </div>

          {/* NOUVEAU: Section Avis */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Avis des participants ({avis.length})</h2>
            {avis.length > 0 ? (
              <div className="space-y-6">
                {avis.map(review => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.author?.avatar_url || ''} alt={review.author?.full_name || ''} />
                      <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{review.author?.full_name || "Utilisateur anonyme"}</p>
                        <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                      </div>
                      <div className="my-1"><StarRating rating={review.note} /></div>
                      <p className="text-muted-foreground">{review.commentaire}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Il n'y a pas encore d'avis pour cette formation.</p>
            )}
          </div>
        </div>

        {/* Colonne de droite : Carte d'achat */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <Card className="sticky top-24">
            <CardHeader className="p-0">
              {formation.image_url ? (
                <Image src={formation.image_url} alt={formation.titre || ''} width={500} height={300} className="object-cover rounded-t-lg w-full" />
              ) : (
                <div className="h-48 bg-secondary rounded-t-lg flex items-center justify-center"><BookOpen className="h-12 w-12 text-muted-foreground" /></div>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CardTitle className="text-3xl font-bold">{formatPrice(formation.prix_indicatif)}</CardTitle>
              <InscriptionModal formationId={formation.id} formationTitle={formation.titre} />
              <Button size="lg" variant="outline" className="w-full text-lg">Ajouter aux favoris</Button>
            </CardContent>
            <CardFooter className="p-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-5 w-5 text-primary"/>
                    <span>{formation.certificat ? "Certificat de fin de formation" : "Pas de certificat"}</span>
                </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
