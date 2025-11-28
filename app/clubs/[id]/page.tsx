import { getClubById, getRelatedClubsByCategory } from "@/lib/data/clubs.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RelatedClubs } from "@/components/related-clubs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InscriptionClubModal } from "@/components/inscription-club-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, User, MapPin, Users, Tag, ChevronLeft, Heart, Share2, Info, Users2,
  Activity, MessageSquare, ShieldCheck
} from "lucide-react";


// --- Helpers ---

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Date de création inconnue";
  return "Créé le " + new Date(dateString).toLocaleDateString("fr-FR", {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

// --- Page Component (Redesigné) ---

export default async function ClubDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const { data: club, error } = await getClubById(resolvedParams.id);

  if (error || !club) {
    console.error("Failed to fetch club or club not found:", error);
    notFound();
  }

  const inscriptions = Array.isArray(club.inscriptions) ? club.inscriptions : [];
  const leader = club.leader;

  // Fetch related clubs
  const { data: relatedClubs } = await getRelatedClubsByCategory(club.id, club.categorie_id);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      {/* Mobile-only Header */}
      <div className="lg:hidden p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between">
        <Link href="/clubs" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <span className="font-bold text-lg truncate flex-1 text-center">{club.nom}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full"><Heart className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="h-5 w-5" /></Button>
        </div>
      </div>

      <main className="flex-1 pb-32 lg:pb-0">
        <div className="relative h-56 md:h-72 lg:h-80 w-full overflow-hidden">
          {club.image_url ? (
            <Image src={club.image_url} alt={club.nom || ''} layout="fill" objectFit="cover" className="bg-secondary" />
          ) : (
            <div className="h-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center">
              <Users2 className="h-20 w-20 text-white/80" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40" />
          {leader?.avatar_url && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
                <AvatarImage src={leader.avatar_url} alt={leader.full_name || ''} />
                <AvatarFallback className="text-4xl">{leader.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        <div className="container mx-auto mt-16 md:mt-20 relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">

            <div className="lg:col-span-2 space-y-6">

              <Card className="p-6 pt-10 md:pt-12 text-center bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-2xl rounded-2xl border-none">
                {club.categorie && (
                  <Link href={`/clubs?categorie=${club.categorie.slug}`} className="text-sm font-bold text-primary uppercase tracking-wider hover:underline">
                    {club.categorie.nom}
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-2">{club.nom}</h1>
                <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">{club.description}</p>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{inscriptions.length} Membres</span>
                  </div>
                  {club.statut === 'ouvert' && (
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="font-semibold">Ouvert aux inscriptions</span>
                    </div>
                  )}
                  {leader && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-semibold">Leader: {leader.full_name}</span>
                    </div>
                  )}
                </div>
              </Card>

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-muted/50 rounded-xl">
                  <TabsTrigger value="about"><Info className="h-4 w-4 mr-2" />À propos</TabsTrigger>
                  <TabsTrigger value="members"><Users2 className="h-4 w-4 mr-2" />Membres</TabsTrigger>
                  <TabsTrigger value="activities"><Activity className="h-4 w-4 mr-2" />Activités</TabsTrigger>
                  <TabsTrigger value="discussions"><MessageSquare className="h-4 w-4 mr-2" />Discussions</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Description du Club</h3>
                  <div className="prose dark:prose-invert max-w-none text-foreground/90">
                    {club.long_description || club.description || "Aucune description détaillée disponible."}
                  </div>
                </TabsContent>

                <TabsContent value="members" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Membres ({inscriptions.length})</h3>
                  {inscriptions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {inscriptions.map((member: any) => (
                        <Card key={member.id} className="p-3 flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">{member.prenom?.charAt(0)}{member.nom?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm">{member.prenom} {member.nom}</p>
                            <p className="text-xs text-muted-foreground">Inscrit le {formatDate(member.created_at)}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucun membre inscrit pour le moment.</p>
                  )}
                </TabsContent>

                <TabsContent value="activities" className="p-6 bg-background rounded-2xl shadow-lg text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Activités à venir</h3>
                  <p className="text-muted-foreground">Aucune activité n'est encore planifiée. Revenez bientôt !</p>
                </TabsContent>

                <TabsContent value="discussions" className="p-6 bg-background rounded-2xl shadow-lg text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Espace de discussion</h3>
                  <p className="text-muted-foreground">La fonctionnalité de discussion sera bientôt disponible.</p>
                </TabsContent>

              </Tabs>
            </div>

            <div className="hidden lg:block lg:col-span-1 mt-8 lg:mt-0">
              <Card className="lg:sticky lg:top-24 p-6 bg-background shadow-xl rounded-2xl border-none">
                <CardTitle className="text-2xl font-bold">
                  {club.statut === 'ouvert' ? 'Prêt à nous rejoindre ?' : 'Inscriptions fermées'}
                </CardTitle>
                <p className="text-muted-foreground text-sm mt-1">Devenez membre de notre communauté.</p>
                <CardContent className="p-0 mt-6 space-y-3">
                  {club.statut === 'ouvert' ? (
                    <InscriptionClubModal clubId={club.id} clubName={club.nom} />
                  ) : (
                    <Button size="lg" disabled className="w-full text-lg rounded-xl py-3">Inscriptions fermées</Button>
                  )}
                  <Button size="lg" variant="outline" className="w-full text-lg font-semibold rounded-xl py-3">
                    <Heart className="mr-2 h-5 w-5" /> Suivre ce club
                  </Button>
                </CardContent>
                <CardFooter className="p-0 border-t mt-6 pt-6 flex flex-col items-start gap-4">
                  <div className="flex items-start gap-4 text-sm"><Tag className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><p><span className="font-bold">Thème</span><br /><span className="text-muted-foreground">{club.theme_principal || 'Non défini'}</span></p></div>
                  <div className="flex items-start gap-4 text-sm"><MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><p><span className="font-bold">Lieu</span><br /><span className="text-muted-foreground">{club.lieu || 'Non spécifié'}</span></p></div>
                  <div className="flex items-start gap-4 text-sm"><Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><p><span className="font-bold">Création</span><br /><span className="text-muted-foreground">{formatDate(club.created_at)}</span></p></div>
                </CardFooter>
              </Card>
            </div>

          </div>
        </div>
      </main>

      {/* Related Clubs Section */}
      <RelatedClubs clubs={relatedClubs || []} />

      {/* Barre d'action "sticky" pour mobile */}
      {club.statut === 'ouvert' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t z-40">
          <InscriptionClubModal clubId={club.id} clubName={club.nom} buttonClass="w-full" buttonText="Rejoindre le Club" />
        </div>
      )}

    </div>
  );
}
