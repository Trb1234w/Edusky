import { getEvenementById, getRelatedEvenementsByCategory } from "@/lib/data/evenements.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RelatedEvenements } from "@/components/related-evenements";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InscriptionEvenementModal } from "@/components/inscription-evenement-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar, User, MapPin, Users, Tag, Clock, ChevronLeft, Ticket,
    Info, Users2, Map, Handshake, Link as LinkIcon, Video, Award, Activity, Globe,
    ExternalLink, CheckCircle2, Book
} from "lucide-react";
import { ContentActions } from "@/components/content-actions";

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

const normalizeArray = (data: any) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data !== null) {
        return Object.values(data);
    }
    return [];
};

// --- Page Component (Redesigné) ---

export async function EvenementDetailsPageContent({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
    const { data: evenement, error } = await getEvenementById(resolvedParams.id);

    if (error || !evenement) {
        console.error("Failed to fetch evenement or evenement not found:", error);
        notFound();
    }

    const inscriptions = Array.isArray(evenement.inscriptions) ? evenement.inscriptions : [];

    // Normalize JSONB data
    const intervenants = normalizeArray(evenement.intervenants);
    const sponsors = normalizeArray(evenement.sponsors);
    const programme = evenement.programme;

    const lieuComplet = [evenement.lieu, evenement.quartier?.nom, evenement.ville?.nom, evenement.pays?.nom].filter(Boolean).join(', ');
    const hasLinks = evenement.lien_streaming || evenement.lien_billetterie || evenement.code_acces_streaming;

    // Fetch related evenements
    const { data: relatedEvenements } = await getRelatedEvenementsByCategory(evenement.id, evenement.categorie_id);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Mobile-only Header */}
            <div className="lg:hidden p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between">
                <Link href="/evenements" className="p-2 -ml-2 rounded-full hover:bg-muted">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <span className="font-bold text-lg truncate flex-1 text-center">{evenement.titre}</span>
                <ContentActions
                    itemId={evenement.id}
                    itemTitle={evenement.titre}
                    itemType="evenement"
                    initialIsFavorited={evenement.is_favorited}
                    variant="mobile"
                />
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

                            <Card className="p-6 md:p-8 bg-white backdrop-blur-sm shadow-2xl rounded-2xl border-none">
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
                                <TabsList className="flex w-full overflow-x-auto justify-start md:grid md:grid-cols-7 gap-2 bg-transparent md:bg-muted/50 p-0 md:p-1 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Info className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">À propos</span></TabsTrigger>
                                    <TabsTrigger value="infos" className="lg:hidden flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><MapPin className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Infos</span></TabsTrigger>
                                    {programme && (
                                        <TabsTrigger value="programme" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Book className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Programme</span></TabsTrigger>
                                    )}
                                    {intervenants.length > 0 && (
                                        <TabsTrigger value="speakers" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Users2 className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Intervenants</span></TabsTrigger>
                                    )}
                                    {sponsors.length > 0 && (
                                        <TabsTrigger value="sponsors" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Handshake className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Sponsors</span></TabsTrigger>
                                    )}
                                    {hasLinks && (
                                        <TabsTrigger value="liens" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><LinkIcon className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Liens</span></TabsTrigger>
                                    )}
                                    {inscriptions.length > 0 && (
                                        <TabsTrigger value="attendees" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Users className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Participants</span></TabsTrigger>
                                    )}
                                </TabsList>

                                <TabsContent value="details" className="p-6 bg-background rounded-2xl shadow-lg">
                                    <h3 className="text-xl font-bold mb-4">À propos de cet événement</h3>
                                    <div className="prose dark:prose-invert max-w-none text-foreground/90 mb-6">
                                        {evenement.description || "Aucune description disponible."}
                                    </div>

                                    {/* Additional Event Information */}
                                    <div className="space-y-6 border-t pt-6">


                                        {/* Heure d'ouverture des portes */}
                                        {evenement.heure_ouverture_portes && (
                                            <div className="flex items-center gap-2 text-sm bg-muted/30 p-3 rounded-lg">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <span className="font-medium">Ouverture des portes:</span>
                                                <span className="text-muted-foreground">{evenement.heure_ouverture_portes}</span>
                                            </div>
                                        )}



                                        {/* Contact */}
                                        {(evenement.email_contact || evenement.telephone_contact) && (
                                            <div>
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">Contact organisateur</h4>
                                                <div className="space-y-1 text-sm">
                                                    {evenement.email_contact && (
                                                        <p className="text-muted-foreground">
                                                            Email: <a href={`mailto:${evenement.email_contact}`} className="text-primary hover:underline">{evenement.email_contact}</a>
                                                        </p>
                                                    )}
                                                    {evenement.telephone_contact && (
                                                        <p className="text-muted-foreground">
                                                            Tél: <a href={`tel:${evenement.telephone_contact}`} className="text-primary hover:underline">{evenement.telephone_contact}</a>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Informations pratiques */}
                                        {(evenement.dress_code || evenement.conditions_annulation || evenement.politique_remboursement) && (
                                            <div className="bg-muted/20 p-4 rounded-lg border">
                                                <h4 className="font-semibold mb-3 flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> Informations pratiques</h4>
                                                <div className="space-y-3 text-sm">
                                                    {evenement.dress_code && (
                                                        <div>
                                                            <span className="font-medium block mb-1">Dress Code:</span>
                                                            <p className="text-muted-foreground">{evenement.dress_code}</p>
                                                        </div>
                                                    )}
                                                    {evenement.conditions_annulation && (
                                                        <div>
                                                            <span className="font-medium block mb-1">Conditions d'annulation:</span>
                                                            <p className="text-muted-foreground">{evenement.conditions_annulation}</p>
                                                        </div>
                                                    )}
                                                    {evenement.politique_remboursement && (
                                                        <div>
                                                            <span className="font-medium block mb-1">Politique de remboursement:</span>
                                                            <p className="text-muted-foreground">{evenement.politique_remboursement}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Age minimum */}
                                        {evenement.age_minimum && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-primary" />
                                                <span className="font-medium">Âge minimum:</span>
                                                <span className="text-muted-foreground">{evenement.age_minimum} ans</span>
                                            </div>
                                        )}

                                        {/* Type d'événement */}
                                        {evenement.type_evenement && (
                                            <div>
                                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Ticket className="h-4 w-4 text-primary" /> Type d'événement</h4>
                                                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">{evenement.type_evenement}</Badge>
                                            </div>
                                        )}

                                        {/* Tags */}
                                        {evenement.tags && evenement.tags.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> Tags</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {evenement.tags.map((tag: string, i: number) => (
                                                        <Badge key={i} variant="secondary">{tag}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Event Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground border-t pt-4">
                                            {evenement.created_at && (
                                                <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Créé le : {formatDate(evenement.created_at)}</div>
                                            )}
                                            {evenement.updated_at && (
                                                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Mis à jour le : {formatDate(evenement.updated_at)}</div>
                                            )}
                                            {evenement.mode && (
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Mode : {evenement.mode === 'en_ligne' ? 'En ligne' : evenement.mode === 'presentiel' ? 'Présentiel' : 'Hybride'}</div>
                                            )}
                                            {evenement.capacite && (
                                                <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Capacité totale : {evenement.capacite} places</div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Onglet Infos - Visible uniquement sur mobile */}
                                <TabsContent value="infos" className="lg:hidden p-6 bg-background rounded-2xl shadow-lg">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Info className="h-6 w-6 text-primary" /> Informations de l'événement</h3>
                                    <div className="space-y-4">
                                        {/* Date et heure */}
                                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                                            <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="font-bold text-sm block mb-1">Date et heure</span>
                                                <span className="text-muted-foreground text-sm block">
                                                    Du {formatDate(evenement.date_debut)} à {formatTime(evenement.date_debut)}
                                                </span>
                                                {evenement.date_fin && (
                                                    <span className="text-muted-foreground text-sm block">
                                                        Au {formatDate(evenement.date_fin)} à {formatTime(evenement.date_fin)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Lieu */}
                                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                                            <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="font-bold text-sm block mb-1">
                                                    {evenement.mode === 'en_ligne' ? 'Événement en ligne' : 'Lieu'}
                                                </span>
                                                <span className="text-muted-foreground text-sm">
                                                    {evenement.mode === 'en_ligne' ? 'Le lien sera partagé aux inscrits' : lieuComplet || 'À définir'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Prix */}
                                        <div className="flex items-start gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                                            <Ticket className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="font-bold text-sm block mb-1">Tarif</span>
                                                <span className="text-primary text-lg font-bold">
                                                    {evenement.prix > 0 ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF", minimumFractionDigits: 0 }).format(evenement.prix) : "Gratuit"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Capacité */}
                                        {evenement.capacite && (
                                            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                                                <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <span className="font-bold text-sm block mb-1">Places</span>
                                                    <span className="text-muted-foreground text-sm">
                                                        {inscriptions.length} / {evenement.capacite} inscrits
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Mode */}
                                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                                            <Activity className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="font-bold text-sm block mb-1">Mode</span>
                                                <Badge variant="outline" className="capitalize">
                                                    {evenement.mode === 'en_ligne' ? '💻 En ligne' : evenement.mode === 'presentiel' ? '📍 Présentiel' : '🔄 Hybride'}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Statut */}
                                        {evenement.statut_evenement && (
                                            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                                                <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <span className="font-bold text-sm block mb-1">Statut</span>
                                                    <Badge
                                                        variant={evenement.statut_evenement === 'ouvert' ? 'default' : 'secondary'}
                                                        className="capitalize"
                                                    >
                                                        {evenement.statut_evenement === 'ouvert' ? '✅ Ouvert' :
                                                            evenement.statut_evenement === 'complet' ? '🔒 Complet' :
                                                                evenement.statut_evenement === 'annule' ? '❌ Annulé' :
                                                                    evenement.statut_evenement === 'reporte' ? '⏰ Reporté' : '✔️ Terminé'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                {/* Onglet Programme */}
                                {programme && (
                                    <TabsContent value="programme" className="p-6 bg-background rounded-2xl shadow-lg">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Book className="h-6 w-6 text-primary" /> Programme de l'événement</h3>
                                        {programme.agenda && programme.agenda.length > 0 ? (
                                            <div className="space-y-4">
                                                {programme.agenda.map((item: any, index: number) => (
                                                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-20 text-center">
                                                                <div className="bg-primary/10 rounded-lg p-2">
                                                                    <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                                                                    <span className="text-sm font-bold text-primary block">{item.heure}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-lg mb-1">{item.titre}</h4>
                                                                {item.description && <p className="text-sm text-muted-foreground mb-2">{item.description}</p>}
                                                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                                    {item.intervenant && (
                                                                        <span className="flex items-center gap-1">
                                                                            <User className="h-3 w-3" />
                                                                            {item.intervenant}
                                                                        </span>
                                                                    )}
                                                                    {item.duree_minutes && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            {item.duree_minutes} min
                                                                        </span>
                                                                    )}
                                                                    {item.lieu && (
                                                                        <span className="flex items-center gap-1">
                                                                            <MapPin className="h-3 w-3" />
                                                                            {item.lieu}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : typeof programme === 'string' ? (
                                            <div className="prose dark:prose-invert max-w-none">
                                                <p className="whitespace-pre-line text-muted-foreground">{programme}</p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Book className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                                                <p className="text-muted-foreground">Programme détaillé à venir.</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                )}

                                {/* Onglet Intervenants */}
                                {intervenants.length > 0 && (
                                    <TabsContent value="speakers" className="p-6 bg-background rounded-2xl shadow-lg">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Users2 className="h-6 w-6 text-primary" /> Intervenants</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {intervenants.map((intervenant: any, index: number) => {
                                                const isString = typeof intervenant === 'string';
                                                const nom = isString ? intervenant : (intervenant.nom || 'Intervenant');
                                                const titre = !isString && intervenant.titre ? intervenant.titre : null;
                                                const bio = !isString && intervenant.bio ? intervenant.bio : null;
                                                const photo = !isString && intervenant.photo_url ? intervenant.photo_url : null;
                                                const expertise = !isString && intervenant.expertise ? intervenant.expertise : [];
                                                const linkedin = !isString && intervenant.linkedin ? intervenant.linkedin : null;
                                                const twitter = !isString && intervenant.twitter ? intervenant.twitter : null;

                                                return (
                                                    <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                                                        <div className="flex items-start gap-4">
                                                            {photo ? (
                                                                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                                                    <Image src={photo} alt={nom} fill className="object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <User className="h-8 w-8 text-primary" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-base truncate">{nom}</h4>
                                                                {titre && <p className="text-xs text-muted-foreground mb-2">{titre}</p>}
                                                                {bio && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{bio}</p>}
                                                                {expertise.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                                        {expertise.slice(0, 3).map((exp: string, i: number) => (
                                                                            <Badge key={i} variant="secondary" className="text-xs">{exp}</Badge>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {(linkedin || twitter) && (
                                                                    <div className="flex gap-2">
                                                                        {linkedin && (
                                                                            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                                                                                <Globe className="h-3 w-3" /> LinkedIn
                                                                            </a>
                                                                        )}
                                                                        {twitter && (
                                                                            <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                                                                                <Globe className="h-3 w-3" /> Twitter
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </TabsContent>
                                )}

                                {/* Onglet Sponsors */}
                                {sponsors.length > 0 && (
                                    <TabsContent value="sponsors" className="p-6 bg-background rounded-2xl shadow-lg">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Handshake className="h-6 w-6 text-primary" /> Nos Partenaires et Sponsors</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {sponsors.map((sponsor: any, index: number) => {
                                                const isString = typeof sponsor === 'string';
                                                const nom = isString ? sponsor : (sponsor.nom || sponsor.name || 'Sponsor');
                                                const logo = !isString && sponsor.logo_url ? sponsor.logo_url : null;
                                                const description = !isString && sponsor.description ? sponsor.description : null;
                                                const siteWeb = !isString && sponsor.site_web ? sponsor.site_web : null;
                                                const categorie = !isString && sponsor.categorie ? sponsor.categorie : null;
                                                const niveau = !isString && sponsor.niveau ? sponsor.niveau : null;

                                                // Emoji selon le niveau
                                                const niveauEmoji = niveau === 1 ? '🥇' : niveau === 2 ? '🥈' : niveau === 3 ? '🥉' : '';
                                                const categorieEmoji = categorie === 'platine' ? '🥇' : categorie === 'or' ? '🥈' : categorie === 'argent' ? '🥉' : '';

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
                                                                <h4 className="font-bold text-base mb-1">
                                                                    {niveauEmoji || categorieEmoji} {nom}
                                                                </h4>
                                                                {categorie && (
                                                                    <Badge variant="outline" className="capitalize mb-2 text-xs">
                                                                        {categorie}
                                                                    </Badge>
                                                                )}
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
                                    </TabsContent>
                                )}

                                {/* Onglet Liens */}
                                {hasLinks && (
                                    <TabsContent value="liens" className="p-6 bg-background rounded-2xl shadow-lg">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><LinkIcon className="h-6 w-6 text-primary" /> Liens utiles</h3>
                                        <div className="space-y-4">
                                            {/* Lien de streaming */}
                                            {evenement.lien_streaming && (
                                                <Card className="p-4 bg-blue-50 border-blue-200 dark:border-blue-800">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Video className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-base mb-1">Lien de streaming</h4>
                                                            <p className="text-sm text-muted-foreground mb-3">Rejoignez l'événement en ligne</p>
                                                            <Button asChild size="sm" className="w-full sm:w-auto">
                                                                <a href={evenement.lien_streaming} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                                    Accéder au streaming
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )}

                                            {/* Code d'accès streaming */}
                                            {evenement.code_acces_streaming && (
                                                <Card className="p-4 bg-purple-50 border-purple-200 dark:border-purple-800">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Tag className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-base mb-1">Code d'accès</h4>
                                                            <p className="text-sm text-muted-foreground mb-2">Utilisez ce code pour rejoindre</p>
                                                            <code className="bg-white px-4 py-2 rounded-lg text-lg font-mono font-bold block text-center">
                                                                {evenement.code_acces_streaming}
                                                            </code>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )}

                                            {/* Lien billetterie */}
                                            {evenement.lien_billetterie && (
                                                <Card className="p-4 bg-green-50 border-green-200 dark:border-green-800">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Ticket className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-base mb-1">Billetterie</h4>
                                                            <p className="text-sm text-muted-foreground mb-3">Réservez vos billets en ligne</p>
                                                            <Button asChild size="sm" variant="default" className="w-full sm:w-auto">
                                                                <a href={evenement.lien_billetterie} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                                    Acheter un billet
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )}
                                        </div>
                                    </TabsContent>
                                )}



                                {inscriptions.length > 0 && (
                                    <TabsContent value="attendees" className="p-6 bg-background rounded-2xl shadow-lg">
                                        <h3 className="text-xl font-bold mb-4">Participants inscrits ({inscriptions.length})</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {inscriptions.map((participant: any) => (
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
                                    <ContentActions
                                        itemId={evenement.id}
                                        itemTitle={evenement.titre}
                                        itemType="evenement"
                                        initialIsFavorited={evenement.is_favorited}
                                    />
                                </CardContent>
                                <CardFooter className="p-0 border-t mt-6 pt-6 flex flex-col items-start gap-4">
                                    <div className="flex items-start gap-4 text-sm">
                                        <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                        <p>
                                            <span className="font-bold">Date et heure</span><br />
                                            <span className="text-muted-foreground">
                                                Du {formatDate(evenement.date_debut)} à {formatTime(evenement.date_debut)}
                                                {evenement.date_fin && (
                                                    <>
                                                        <br />
                                                        Au {formatDate(evenement.date_fin)} à {formatTime(evenement.date_fin)}
                                                    </>
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4 text-sm"><MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><p><span className="font-bold">{evenement.mode === 'en_ligne' ? 'Événement en ligne' : evenement.lieu || 'Lieu à définir'}</span><br /><span className="text-muted-foreground">{evenement.mode === 'en_ligne' ? 'Le lien sera partagé aux inscrits' : lieuComplet}</span></p></div>
                                    {evenement.capacite && <div className="flex items-start gap-4 text-sm"><Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><p><span className="font-bold">{inscriptions.length} / {evenement.capacite} places</span><br /><span className="text-muted-foreground">Réservez votre place dès maintenant !</span></p></div>}
                                </CardFooter>
                            </Card>
                        </div>

                    </div>
                </div>

                {/* Related Evenements Section */}
                <RelatedEvenements evenements={relatedEvenements || []} />
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

        </div>
    );
}
