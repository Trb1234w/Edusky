import { getEvenementById } from "@/lib/data/evenements.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InscriptionEvenementModal } from "@/components/inscription-evenement-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, User, MapPin, Users, Tag, Clock, ChevronLeft, Heart, Share2, Ticket,
  Info, Users2, Map, Handshake
} from "lucide-react";

// --- Helpers ---

const formatDate = (date: string | null | undefined, options?: Intl.DateTimeFormatOptions) => {
  if (!date) return "N/A";
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'long', day: 'numeric',
    ...options
  };
  return new Date(date).toLocaleDateString("fr-FR", defaultOptions);
};

const formatTime = (date: string | null | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: '2-digit', minute: '2-digit'
  });
};


// --- Page Component (Redesigné) ---

export default async function EvenementDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const { data: evenement, error } = await getEvenementById(resolvedParams.id);

  if (error || !evenement) {
    console.error("Failed to fetch evenement or evenement not found:", error);
    notFound();
  }

  const inscriptions = Array.isArray(evenement.inscriptions) ? evenement.inscriptions : [];
  const intervenants = Array.isArray(evenement.intervenants) ? evenement.intervenants : []; // Assumant que cette donnée puisse exister
  const lieuComplet = [evenement.lieu, evenement.quartier?.nom, evenement.ville?.nom, evenement.pays?.nom].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <Header className="hidden lg:block" />

      {/* Mobile-only Header */}
      <div className="lg:hidden p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between">
        <Link href="/evenements" className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <span className="font-bold text-lg truncate flex-1 text-center">{evenement.titre}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full"><Heart className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="h-5 w-5" /></Button>
        </div>
      </div>

      <main className="flex-1 pb-32 lg:pb-0">
        <div className="relative h-64 md:h-96 lg:h-[450px] w-full overflow-hidden">
          {evenement.image_url ? (
            <Image src={evenement.image_url} alt={evenement.titre || ''} layout="fill" objectFit="cover" className="bg-secondary" />
          ) : (
            <div className="h-full bg-gradient-to-br from-teal-200 to-cyan-200 flex items-center justify-center">
              <Calendar className="h-20 w-20 text-white/80" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto -mt-24 md:-mt-32 lg:-mt-48 relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">
            
            <div className="lg:col-span-2 space-y-6">
              
              <Card className="p-6 md:p-8 bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-2xl rounded-2xl border-none">
                {evenement.categorie && (
                   <Link href={`/evenements?categorie=${evenement.categorie.slug}`} className="text-sm font-bold text-primary uppercase tracking-wider hover:underline">
                    {evenement.categorie.nom}
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-2">{evenement.titre}</h1>
                <p className="text-lg text-muted-foreground mt-3">{evenement.extrait}</p>
              
                {evenement.organisateur && (
                  <Link href={`/profiles/${evenement.organisateur.id}`} className="flex items-center space-x-4 pt-6 group">
                    <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary transition-colors">
                      <AvatarImage src={evenement.organisateur.avatar_url || ''} alt={evenement.organisateur.full_name || ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{evenement.organisateur.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-muted-foreground text-sm">Organisé par</p>
                      <p className="font-bold text-lg text-foreground">{evenement.organisateur.full_name}</p>
                    </div>
                  </Link>
                )}
              </Card>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-muted/50 rounded-xl">
                  <TabsTrigger value="details"><Info className="h-4 w-4 mr-2"/>Détails</TabsTrigger>
                  {intervenants.length > 0 && <TabsTrigger value="speakers"><Users2 className="h-4 w-4 mr-2"/>Intervenants</TabsTrigger>}
                  <TabsTrigger value="location"><Map className="h-4 w-4 mr-2"/>Lieu</TabsTrigger>
                  {inscriptions.length > 0 && <TabsTrigger value="attendees"><Handshake className="h-4 w-4 mr-2"/>Participants</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="details" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">À propos de cet événement</h3>
                  <div className="prose dark:prose-invert max-w-none text-foreground/90">
                    {evenement.description || "Aucune description disponible."}
                  </div>
                </TabsContent>

                {intervenants.length > 0 && (
                  <TabsContent value="speakers" className="p-6 bg-background rounded-2xl shadow-lg">
                     <h3 className="text-xl font-bold mb-4">Intervenants</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {intervenants.map((speaker: any) => (
                        <Card key={speaker.id} className="p-4 flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={speaker.avatar_url || ''} alt={speaker.full_name || ''} />
                            <AvatarFallback>{speaker.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{speaker.full_name}</p>
                            <p className="text-sm text-muted-foreground">{speaker.titre}</p>
                          </div>
                        </Card>
                      ))}
                     </div>
                  </TabsContent>
                )}

                <TabsContent value="location" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Lieu de l'événement</h3>
                  <p className="text-lg text-foreground mb-4">{lieuComplet}</p>
                  <div className="aspect-video bg-secondary rounded-lg">
                    {/* Placeholder pour une carte Google Maps ou OpenStreetMap */}
                    <div className="h-full w-full flex items-center justify-center">
                      <p className="text-muted-foreground">Carte à venir</p>
                    </div>
                  </div>
                </TabsContent>

                {inscriptions.length > 0 && (
                  <TabsContent value="attendees" className="p-6 bg-background rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Participants inscrits ({inscriptions.length})</h3>
                    <div className="flex flex-wrap gap-4">
                      {inscriptions.map(participant => (
                        <div key={participant.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                           <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{participant.prenom.charAt(0)}{participant.nom.charAt(0)}</AvatarFallback>
                          </Avatar>
                           <p className="font-semibold text-sm">{participant.prenom} {participant.nom}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>

            <div className="hidden lg:block lg:col-span-1 mt-8 lg:mt-0">
              <Card className="lg:sticky lg:top-24 p-6 bg-background shadow-xl rounded-2xl border-none">
                <CardTitle className="text-3xl font-extrabold text-primary">
                  {evenement.prix > 0 ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(evenement.prix) : "Gratuit"}
                </CardTitle>
                <CardContent className="p-0 mt-6 space-y-3">
                  <InscriptionEvenementModal evenementId={evenement.id} evenementTitle={evenement.titre} />
                  <Button size="lg" variant="outline" className="w-full text-lg font-semibold rounded-xl py-3">
                    <Heart className="mr-2 h-5 w-5"/> Ajouter au calendrier
                  </Button>
                </CardContent>
                <CardFooter className="p-0 border-t mt-6 pt-6 flex flex-col items-start gap-4">
                  <div className="flex items-start gap-4 text-sm"><Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><p><span className="font-bold">{formatDate(evenement.date_debut, {weekday: 'long'})}</span><br/><span className="text-muted-foreground">{formatDate(evenement.date_debut)} à {formatTime(evenement.date_debut)}</span></p></div>
                  <div className="flex items-start gap-4 text-sm"><MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><p><span className="font-bold">{evenement.mode === 'en_ligne' ? 'Événement en ligne' : evenement.lieu || 'Lieu à définir'}</span><br/><span className="text-muted-foreground">{evenement.mode === 'en_ligne' ? 'Le lien sera partagé aux inscrits' : lieuComplet}</span></p></div>
                  {evenement.capacite && <div className="flex items-start gap-4 text-sm"><Users className="h-5 w-5 text-primary mt-1 flex-shrink-0"/><p><span className="font-bold">{inscriptions.length} / {evenement.capacite} places</span><br/><span className="text-muted-foreground">Réservez votre place dès maintenant !</span></p></div>}
                </CardFooter>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Prix</p>
            <p className="text-2xl font-bold text-primary">{evenement.prix > 0 ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(evenement.prix) : "Gratuit"}</p>
          </div>
          <div className="flex-1">
             <InscriptionEvenementModal evenementId={evenement.id} evenementTitle={evenement.titre} buttonClass="w-full" buttonText="S'inscrire" />
          </div>
        </div>
      </div>
      
      <Footer className="hidden lg:block" />
    </div>
  );
}
