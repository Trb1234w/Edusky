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
  Activity, MessageSquare, ShieldCheck, Clock, FileText, Globe, Handshake, Award,
  Book, Target, CheckCircle2, Share
} from "lucide-react";


// --- Helpers ---

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Date de création inconnue";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const normalizeArray = (data: any) => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data !== null) {
    return Object.values(data);
  }
  return [];
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

  // Normalize data
  const partenaires = normalizeArray(club.partenaires);
  const realisations = normalizeArray(club.realisations);
  const objectifs = normalizeArray(club.objectifs);
  const equipement_requis = normalizeArray(club.equipement_requis);

  // Handle activites: check if it's an array directly or an object with an 'activites' key
  let activites = [];
  if (Array.isArray(club.activites)) {
    activites = club.activites;
  } else if (club.activites?.activites) {
    activites = normalizeArray(club.activites.activites);
  }

  const calendrier = normalizeArray(club.calendrier);

  console.log("--- DEBUG CLUB DATA ---");
  console.log("Club ID:", club.id);
  console.log("Partenaires (Raw):", club.partenaires, typeof club.partenaires);
  console.log("Realisations (Raw):", club.realisations, typeof club.realisations);
  console.log("Activites (Raw):", club.activites, typeof club.activites);
  console.log("Calendrier (Raw):", club.calendrier, typeof club.calendrier);
  console.log("Normalized Partenaires:", partenaires);
  console.log("Normalized Activites:", activites);
  console.log("-----------------------");

  return (
    <div className="min-h-screen flex flex-col bg-white">
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

              <Card className="p-6 pt-10 md:pt-12 text-center bg-white backdrop-blur-sm shadow-2xl rounded-2xl border-none">
                {club.categorie && (
                  <Link href={`/clubs?categorie=${club.categorie.slug}`} className="text-sm font-bold text-primary uppercase tracking-wider hover:underline">
                    {club.categorie.nom}
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-2">{club.nom}</h1>
                <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">{club.description}</p>

                {club.tags && club.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {club.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="bg-background/50 backdrop-blur-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

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
                <TabsList className="flex w-full overflow-x-auto justify-between md:grid md:grid-cols-7 gap-2 bg-transparent md:bg-muted/50 p-0 md:p-1 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <TabsTrigger value="about" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Info className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">À propos</span></TabsTrigger>
                  <TabsTrigger value="infos" className="lg:hidden flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><MapPin className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Infos</span></TabsTrigger>
                  <TabsTrigger value="calendrier" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Calendar className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Calendrier</span></TabsTrigger>
                  <TabsTrigger value="realisations" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Award className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Réalisations</span></TabsTrigger>
                  <TabsTrigger value="partenaires" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Handshake className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Partenaires</span></TabsTrigger>
                  <TabsTrigger value="objectifs" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Target className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Objectifs</span></TabsTrigger>
                  <TabsTrigger value="reseaux_sociaux" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Share className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Réseaux</span></TabsTrigger>
                  <TabsTrigger value="horaires" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Clock className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Horaires</span></TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Description du Club</h3>
                  <div className="prose dark:prose-invert max-w-none text-foreground/90">
                    {club.long_description || club.description || "Aucune description détaillée disponible."}
                  </div>

                  <div className="space-y-6 border-t pt-6 mt-6">
                    {/* Tarifs */}
                    {(club.prix_inscription !== null && club.prix_inscription !== undefined) || club.cotisation_mensuelle || club.cotisation_annuelle ? (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary"><Tag className="h-4 w-4" /> Tarifs</h4>
                        <div className="space-y-2">
                          {club.prix_inscription !== null && club.prix_inscription !== undefined && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Inscription:</span>
                              <span className="text-lg font-bold text-primary">
                                {club.prix_inscription === 0 ? "Gratuit" : new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(club.prix_inscription)}
                              </span>
                            </div>
                          )}
                          {club.cotisation_mensuelle && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Cotisation mensuelle:</span>
                              <span className="text-lg font-bold text-primary">
                                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(club.cotisation_mensuelle)}
                              </span>
                            </div>
                          )}
                          {club.cotisation_annuelle && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Cotisation annuelle:</span>
                              <span className="text-lg font-bold text-primary">
                                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(club.cotisation_annuelle)}
                              </span>
                            </div>
                          )}
                          {club.type_cotisation && (
                            <div className="mt-2">
                              <Badge variant="outline" className="capitalize">{club.type_cotisation}</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {/* Membres */}
                    {(club.nombre_membres !== null && club.nombre_membres !== undefined) && (
                      <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">Membres actuels:</span>
                        <span className="text-muted-foreground font-bold">{club.nombre_membres}</span>
                        {club.capacite && <span className="text-muted-foreground">/ {club.capacite} places</span>}
                      </div>
                    )}

                    {/* Conditions d'adhésion */}
                    {club.conditions_adhesion && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">Conditions d'adhésion</h4>
                        <p className="text-sm text-muted-foreground">{club.conditions_adhesion}</p>
                      </div>
                    )}

                    {/* Niveau et âge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {club.niveau_requis && (
                        <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded">
                          <span className="font-medium">Niveau requis:</span>
                          <Badge variant="outline" className="capitalize">{club.niveau_requis}</Badge>
                        </div>
                      )}
                      {(club.age_minimum || club.age_maximum) && (
                        <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-medium">Âge:</span>
                          <span className="text-muted-foreground">
                            {club.age_minimum && club.age_maximum ? `${club.age_minimum} - ${club.age_maximum} ans` :
                              club.age_minimum ? `${club.age_minimum}+ ans` :
                                club.age_maximum ? `Jusqu'à ${club.age_maximum} ans` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Équipement requis */}
                    {equipement_requis.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">Équipement requis</h4>
                        <div className="flex flex-wrap gap-2">
                          {equipement_requis.map((equipement: string, i: number) => (
                            <Badge key={i} variant="secondary">{equipement}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Langues */}
                    {club.langues && club.langues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" /> Langues
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {club.langues.map((langue: string, i: number) => (
                            <Badge key={i} variant="outline" className="capitalize">{langue}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact */}
                    {club.email_contact && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Email:</span>
                        <a href={`mailto:${club.email_contact}`} className="text-primary hover:underline">{club.email_contact}</a>
                      </div>
                    )}

                    {/* Réseaux sociaux */}
                    {club.reseaux_sociaux && Object.keys(club.reseaux_sociaux).length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">Réseaux sociaux</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(club.reseaux_sociaux).map(([platform, url]: [string, any]) => (
                            url && (
                              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline capitalize">
                                {platform}
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Règlement intérieur */}
                    {club.reglement_interieur && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Règlement intérieur</h4>
                        <div className="bg-muted/30 p-4 rounded-lg border text-sm text-muted-foreground whitespace-pre-line">
                          {club.reglement_interieur}
                        </div>
                      </div>
                    )}

                    {/* Site Web */}
                    {club.site_web && (
                      <div className="flex items-center gap-2 text-sm bg-muted/30 p-3 rounded-lg">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="font-medium">Site Web:</span>
                        <a href={club.site_web} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-xs">
                          {club.site_web}
                        </a>
                      </div>
                    )}

                    <div className="mt-8 pt-6 border-t flex flex-wrap gap-6 text-sm text-muted-foreground">
                      {club.created_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Créé le {formatDate(club.created_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Infos - Visible uniquement sur mobile */}
                <TabsContent value="infos" className="lg:hidden p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Info className="h-6 w-6 text-primary" /> Informations du Club</h3>
                  <div className="space-y-4">
                    {/* Thème */}
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <Tag className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Thème</span>
                        <span className="text-muted-foreground text-sm">{club.theme_principal || 'Non défini'}</span>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Localisation</span>
                        <span className="text-muted-foreground text-sm">
                          {[
                            club.lieu,
                            club.quartier?.nom,
                            club.ville?.nom,
                            club.pays?.nom
                          ].filter(Boolean).join(', ') || 'Non spécifié'}
                        </span>
                      </div>
                    </div>

                    {/* Capacité */}
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Capacité</span>
                        <span className="text-muted-foreground text-sm">
                          {club.capacite ? `${club.capacite} membres max` : 'Illimitée'}
                        </span>
                      </div>
                    </div>

                    {/* Visibilité */}
                    {club.visibilite && (
                      <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                        <ShieldCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="font-bold text-sm block mb-1">Visibilité</span>
                          <Badge variant="outline" className="capitalize mt-1">
                            {club.visibilite === 'sur_invitation' ? 'Sur invitation' : club.visibilite}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Date de création */}
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Création</span>
                        <span className="text-muted-foreground text-sm">{formatDate(club.created_at)}</span>
                      </div>
                    </div>

                    {/* Statut */}
                    <div className="flex items-start gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <Activity className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Statut</span>
                        <Badge variant={club.statut === 'ouvert' ? 'default' : 'secondary'} className="capitalize">
                          {club.statut === 'ouvert' ? '✅ Ouvert aux inscriptions' : '🔒 Inscriptions fermées'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="calendrier" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" /> Calendrier des Activités</h3>
                  {calendrier.length > 0 ? (
                    <div className="space-y-4">
                      {calendrier.map((event: any, index: number) => {
                        const isString = typeof event === 'string';
                        const eventTitle = isString ? event : (event.titre || event.nom || 'Événement');
                        const eventDate = !isString && event.date ? event.date : null;
                        const eventDescription = !isString && event.description ? event.description : null;
                        const eventTime = !isString && event.heure ? event.heure : null;
                        const eventLocation = !isString && event.lieu ? event.lieu : null;

                        return (
                          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                                <Calendar className="h-6 w-6 text-primary mb-1" />
                                {eventDate && (
                                  <span className="text-xs font-bold text-primary">
                                    {new Date(eventDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-1">{eventTitle}</h4>
                                {eventDescription && <p className="text-sm text-muted-foreground mb-2">{eventDescription}</p>}
                                {!isString && (eventTime || eventLocation) && (
                                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    {eventTime && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {eventTime}
                                      </span>
                                    )}
                                    {eventLocation && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {eventLocation}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun événement programmé pour le moment.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="realisations" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="h-6 w-6 text-primary" /> Nos Réalisations</h3>
                  {realisations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {realisations.map((realisation: any, index: number) => {
                        const isString = typeof realisation === 'string';
                        const title = isString ? realisation : (realisation.titre || realisation.nom || 'Réalisation');
                        const date = !isString && realisation.date ? realisation.date : null;
                        const description = !isString && realisation.description ? realisation.description : null;

                        return (
                          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <h4 className="font-bold text-lg mb-2">{title}</h4>
                              {date && (
                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                                </p>
                              )}
                              {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Award className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune réalisation enregistrée pour le moment.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="partenaires" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Handshake className="h-6 w-6 text-primary" /> Nos Partenaires</h3>
                  {partenaires.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {partenaires.map((partenaire: any, index: number) => {
                        const isString = typeof partenaire === 'string';
                        const nom = isString ? partenaire : (partenaire.nom || partenaire.name || 'Partenaire');
                        const logo = !isString && partenaire.logo_url ? partenaire.logo_url : null;
                        const description = !isString && partenaire.description ? partenaire.description : null;
                        const siteWeb = !isString && partenaire.site_web ? partenaire.site_web : null;

                        return (
                          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col items-center text-center gap-3">
                              {logo ? (
                                <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden">
                                  <Image src={logo} alt={nom} fill className="object-contain p-2" />
                                </div>
                              ) : (
                                <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <Handshake className="h-12 w-12 text-primary" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-base mb-1">{nom}</h4>
                                {description && <p className="text-xs text-muted-foreground mb-2">{description}</p>}
                                {siteWeb && (
                                  <a href={siteWeb} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center justify-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    Visiter le site
                                  </a>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Handshake className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun partenaire enregistré pour le moment.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="objectifs" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="h-6 w-6 text-primary" /> Nos Objectifs</h3>
                  {objectifs.length > 0 ? (
                    <div className="space-y-3">
                      {objectifs.map((objectif: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm flex-1">{objectif}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun objectif défini pour le moment.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reseaux_sociaux" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Share className="h-6 w-6 text-primary" /> Réseaux Sociaux</h3>
                  {club.reseaux_sociaux && Object.keys(club.reseaux_sociaux).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(club.reseaux_sociaux).map(([platform, url]: [string, any]) => {
                        if (!url) return null;

                        const platformIcons: Record<string, string> = {
                          facebook: '📘',
                          twitter: '🐦',
                          instagram: '📷',
                          linkedin: '💼',
                          youtube: '📺',
                          tiktok: '🎵',
                          whatsapp: '💬',
                        };

                        const icon = platformIcons[platform.toLowerCase()] || '🔗';

                        return (
                          <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="group">
                            <Card className="p-4 hover:shadow-lg hover:border-primary/50 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="text-4xl">{icon}</div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-base capitalize group-hover:text-primary transition-colors">
                                    {platform}
                                  </h4>
                                  <p className="text-xs text-muted-foreground truncate">{url}</p>
                                </div>
                                <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </Card>
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Share className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun réseau social configuré pour le moment.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="horaires" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="h-6 w-6 text-primary" /> Horaires d'ouverture</h3>
                  {club.horaires_ouverture && Object.keys(club.horaires_ouverture).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(club.horaires_ouverture).map(([jour, horaire]: [string, any]) => (
                        <div key={jour} className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                          <span className="font-bold capitalize flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" /> {jour}
                          </span>
                          <span className={`font-medium ${horaire?.ouvert ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                            {horaire?.ouvert ? `${horaire.debut} - ${horaire.fin}` : 'Fermé'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Les horaires d'ouverture ne sont pas spécifiés.</p>
                  )}
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

                  <div className="flex items-start gap-4 text-sm">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Localisation</span><br />
                      <span className="text-muted-foreground">
                        {[
                          club.lieu,
                          club.quartier?.nom,
                          club.ville?.nom,
                          club.pays?.nom
                        ].filter(Boolean).join(', ') || 'Non spécifié'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-sm">
                    <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold">Capacité</span><br />
                      <span className="text-muted-foreground">
                        {club.capacite ? `${club.capacite} membres max` : 'Illimitée'}
                      </span>
                    </div>
                  </div>

                  {club.visibilite && (
                    <div className="flex items-start gap-4 text-sm">
                      <ShieldCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Visibilité</span><br />
                        <Badge variant="outline" className="capitalize mt-1">
                          {club.visibilite === 'sur_invitation' ? 'Sur invitation' : club.visibilite}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 text-sm"><Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><p><span className="font-bold">Création</span><br /><span className="text-muted-foreground">{formatDate(club.created_at)}</span></p></div>
                </CardFooter>
              </Card>
            </div>

          </div>

          {/* Related Clubs Section - Moved inside main container and adjusted spacing */}
          <div className="mt-8 md:mt-16">
            <RelatedClubs clubs={relatedClubs || []} />
          </div>

        </div>
      </main>

      {/* Barre d'action "sticky" pour mobile */}
      {club.statut === 'ouvert' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t z-40">
          <InscriptionClubModal clubId={club.id} clubName={club.nom} buttonClass="w-full" buttonText="Rejoindre le Club" />
        </div>
      )}

    </div>
  );
}
