
import { getFormationById } from "@/lib/data/formations.server";

import { notFound } from "next/navigation";

import Image from "next/image";

import Link from "next/link";

import { Header } from "@/components/header"; 

import { Footer } from "@/components/footer";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { InscriptionModal } from "@/components/inscription-modal";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {

  Clock, BarChart3, Star, BookOpen, Video, FileText, Award, Calendar, User, MapPin, Users,

  ChevronLeft, Heart, Share2, Info, Book, MessageSquare, VideoIcon, FileTextIcon, ListVideo, GraduationCap

} from "lucide-react";



// --- Helpers (conservés) ---



const formatPrice = (price: number | null | undefined) => {

  if (price === null || price === undefined) return "N/A";

  if (price === 0) return "Gratuit";

  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(price);

};



const formatDate = (dateString: string | null | undefined) => {

  if (!dateString) return "Date non spécifiée";

  return new Date(dateString).toLocaleDateString("fr-FR", {

    year: 'numeric', month: 'long', day: 'numeric'

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





// --- Page Component (Redesigné) ---



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

  const nbModules = curriculum.length;

  const nbLecons = curriculum.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0);



  return (

    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">

      <Header className="hidden lg:block" />



      {/* Mobile-only Header */}

      <div className="lg:hidden p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between">

        <Link href="/formations" className="p-2 -ml-2 rounded-full hover:bg-muted">

          <ChevronLeft className="h-6 w-6" />

        </Link>

        <span className="font-bold text-lg truncate flex-1 text-center">{formation.titre}</span>

        <div className="flex items-center gap-1">

          <Button variant="ghost" size="icon" className="rounded-full">

            <Heart className="h-5 w-5" />

          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">

            <Share2 className="h-5 w-5" />

          </Button>

        </div>

      </div>



      <main className="flex-1 pb-32 lg:pb-0">

        {/* Section Média (Image/Vidéo) - plus proéminente */}

        <div className="relative h-56 md:h-80 lg:h-96 w-full overflow-hidden">

          {formation.image_url ? (

            <Image src={formation.image_url} alt={formation.titre || ''} layout="fill" objectFit="cover" className="bg-secondary" />

          ) : (

            <div className="h-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">

              <BookOpen className="h-16 w-16 text-white/80" />

            </div>

          )}

          <div className="absolute inset-0 bg-black/30" />

        </div>



        <div className="container mx-auto -mt-24 md:-mt-32 lg:-mt-40 relative z-10 px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">

            

            {/* Colonne de gauche : Contenu principal */}

            <div className="lg:col-span-2 space-y-6">

              

              {/* Carte Hero */}

              <Card className="p-6 md:p-8 bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-2xl rounded-2xl border-none">

                {formation.categorie && (

                   <Link href={`/formations?categorie=${formation.categorie.slug}`} className="text-sm font-bold text-primary uppercase tracking-wider hover:underline">

                    {formation.categorie.nom}

                  </Link>

                )}

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-2">{formation.titre}</h1>

                <p className="text-lg text-muted-foreground mt-3">{formation.extrait}</p>

                

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">

                  <div className="flex items-center gap-2">

                    <StarRating rating={formation.note_moyenne} />

                    <span className="text-sm font-medium text-muted-foreground">{formation.note_moyenne.toFixed(1)} ({avis.length} avis)</span>

                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">

                    <Users className="h-4 w-4 text-primary" />

                    <span>{formation.nb_etudiants_inscrits || 0} participants</span>

                  </div>

                </div>



                {formation.professeur && (

                  <Link href={`/professeurs/${formation.professeur.id}`} className="flex items-center space-x-4 pt-6 group">

                    <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary transition-colors">

                      <AvatarImage src={formation.professeur.profiles?.avatar_url || ''} alt={formation.professeur.profiles?.full_name || ''} />

                      <AvatarFallback className="bg-primary text-primary-foreground">{formation.professeur.profiles?.full_name?.charAt(0)}</AvatarFallback>

                    </Avatar>

                    <div>

                      <p className="font-bold text-lg text-foreground">{formation.professeur.profiles?.full_name}</p>

                      <p className="text-sm text-muted-foreground">{formation.professeur.titre}</p>

                    </div>

                  </Link>

                )}

              </Card>



              {/* Barre de statistiques rapide (Desktop) */}

              <Card className="hidden lg:grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border-none">

                <div className="flex items-center gap-3">

                  <Clock className="h-8 w-8 text-primary"/>

                  <div><p className="text-sm text-muted-foreground">Durée</p><p className="font-bold">{formation.duree_texte || 'N/A'}</p></div>

                </div>

                <div className="flex items-center gap-3">

                  <BarChart3 className="h-8 w-8 text-primary"/>

                  <div><p className="text-sm text-muted-foreground">Niveau</p><p className="font-bold">{formation.niveau || 'Tous'}</p></div>

                </div>

                <div className="flex items-center gap-3">

                  <ListVideo className="h-8 w-8 text-primary"/>

                  <div><p className="text-sm text-muted-foreground">Contenu</p><p className="font-bold">{nbLecons} leçons</p></div>

                </div>

                <div className="flex items-center gap-3">

                  <GraduationCap className="h-8 w-8 text-primary"/>

                  <div><p className="text-sm text-muted-foreground">Certificat</p><p className="font-bold">{formation.certificat ? 'Oui' : 'Non'}</p></div>

                </div>

              </Card>



              {/* Contenu principal avec onglets */}

              <Tabs defaultValue="about" className="w-full">

                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-muted/50 rounded-xl">

                  <TabsTrigger value="about"><Info className="h-4 w-4 mr-2"/>À propos</TabsTrigger>

                  <TabsTrigger value="curriculum"><Book className="h-4 w-4 mr-2"/>Programme</TabsTrigger>

                  <TabsTrigger value="sessions"><Calendar className="h-4 w-4 mr-2"/>Sessions</TabsTrigger>

                  <TabsTrigger value="reviews"><MessageSquare className="h-4 w-4 mr-2"/>Avis</TabsTrigger>

                </TabsList>

                

                <TabsContent value="about" className="p-6 bg-background rounded-2xl shadow-lg">

                  <h3 className="text-xl font-bold mb-4">Description de la formation</h3>

                  <div className="prose dark:prose-invert max-w-none text-foreground/90">

                    {formation.description || "Aucune description disponible."}

                  </div>

                </TabsContent>



                <TabsContent value="curriculum" className="p-0">

                  <Accordion type="single" collapsible className="w-full" defaultValue="item-0">

                    {curriculum.length > 0 ? curriculum.map((module: any, index: number) => (

                      <AccordionItem value={`item-${index}`} key={index} className="border-b-0 mb-3">

                        <Card className="shadow-md rounded-xl">

                          <AccordionTrigger className="text-lg font-semibold p-5 hover:no-underline">

                            {module.title || `Module ${index + 1}`}

                          </AccordionTrigger>

                          <AccordionContent className="px-5 pb-5 space-y-3">

                            {module.lessons && module.lessons.map((lesson: any, lessonIndex: number) => (

                              <div key={lessonIndex} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">

                                {lesson.type === 'video' ? <VideoIcon className="h-5 w-5 text-primary" /> : <FileTextIcon className="h-5 w-5 text-primary" />}

                                <span className="flex-1 font-medium text-foreground/90">{lesson.title}</span>

                                <span className="text-sm text-muted-foreground">{lesson.duration}</span>

                              </div>

                            ))}

                          </AccordionContent>

                        </Card>

                      </AccordionItem>

                    )) : <p className="text-muted-foreground p-6">Le programme détaillé n'est pas encore disponible.</p>}

                  </Accordion>

                </TabsContent>



                <TabsContent value="sessions" className="p-6 bg-background rounded-2xl shadow-lg">

                   {sessions.length > 0 ? (

                    <div className="space-y-4">

                      {sessions.map(session => (

                        <div key={session.id} className="p-4 border rounded-xl bg-background/50">

                          <p className="font-bold text-lg">Session du {formatDate(session.debut)} au {formatDate(session.fin)}</p>

                          {session.lieu && <div className="flex items-center gap-3 text-sm mt-2 text-muted-foreground"><MapPin className="h-4 w-4 text-primary"/><p>{session.lieu}</p></div>}

                          {session.capacite && <div className="flex items-center gap-3 text-sm mt-1 text-muted-foreground"><Users className="h-4 w-4 text-primary"/><p>{session.places_reservees || 0} / {session.capacite} places</p></div>}

                        </div>

                      ))}

                    </div>

                  ) : (

                    <p className="text-muted-foreground">Aucune session n'est programmée pour le moment.</p>

                  )}

                </TabsContent>



                <TabsContent value="reviews" className="p-6 bg-background rounded-2xl shadow-lg">

                  {avis.length > 0 ? (

                    <div className="space-y-6">

                      {avis.map(review => (

                        <div key={review.id} className="flex gap-4 border-b pb-4 last:border-b-0">

                          <Avatar>

                            <AvatarImage src={review.author?.avatar_url || ''} alt={review.author?.full_name || ''} />

                            <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>

                          </Avatar>

                          <div className="flex-1">

                            <div className="flex items-center justify-between">

                              <p className="font-bold">{review.author?.full_name || "Anonyme"}</p>

                              <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>

                            </div>

                            <div className="my-1.5"><StarRating rating={review.note} /></div>

                            <p className="text-muted-foreground text-sm">{review.commentaire}</p>

                          </div>

                        </div>

                      ))}

                    </div>

                  ) : (

                    <p className="text-muted-foreground">Il n'y a pas encore d'avis pour cette formation.</p>

                  )}

                </TabsContent>

              </Tabs>

            </div>



            {/* Colonne de droite : Carte d'achat (Desktop) */}

            <div className="hidden lg:block lg:col-span-1 mt-8 lg:mt-0">

              <Card className="lg:sticky lg:top-24 p-6 bg-background shadow-xl rounded-2xl border-none">

                <CardTitle className="text-3xl font-extrabold text-primary">{formatPrice(formation.prix_indicatif)}</CardTitle>

                <CardContent className="p-0 mt-6 space-y-3">

                  <InscriptionModal formationId={formation.id} formationTitle={formation.titre} />

                  <Button size="lg" variant="outline" className="w-full text-lg font-semibold rounded-xl py-3">

                    <Heart className="mr-2 h-5 w-5"/> Ajouter aux favoris

                  </Button>

                </CardContent>

                <CardFooter className="p-0 border-t mt-6 pt-6 flex flex-col items-start gap-3">

                  <h3 className="font-bold text-lg mb-2">Ce cours inclut :</h3>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-primary"/><span>Durée de {formation.duree_texte || 'N/A'}</span></div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground"><ListVideo className="h-4 w-4 text-primary"/><span>{nbLecons} leçons dans {nbModules} modules</span></div>

                  {formation.certificat && <div className="flex items-center gap-3 text-sm text-muted-foreground"><Award className="h-4 w-4 text-primary"/><span>Certificat de fin de formation</span></div>}

                  <div className="flex items-center gap-3 text-sm text-muted-foreground"><Users className="h-4 w-4 text-primary"/><span>Accès aux sessions de groupe</span></div>

                </CardFooter>

              </Card>

            </div>



          </div>

        </div>

      </main>



      {/* Barre d'action "sticky" pour mobile */}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t z-40">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-xs text-muted-foreground">Prix</p>

            <p className="text-2xl font-bold text-primary">{formatPrice(formation.prix_indicatif)}</p>

          </div>

          <div className="flex-1">

             <InscriptionModal formationId={formation.id} formationTitle={formation.titre} buttonClass="w-full" />

          </div>

        </div>

      </div>

      

      <Footer className="hidden lg:block" />

    </div>

  );

}
