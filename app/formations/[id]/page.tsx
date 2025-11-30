import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Icons
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Globe,
  Share2,
  Heart,
  ChevronLeft,
  BookOpen,
  BarChart3,
  Computer,
  GraduationCap,
  Info,
  Accessibility,
  Book,
  Briefcase,
  Building2,
  FileText,
  List,
  ListVideo,
  Star,
} from 'lucide-react';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Server Data
import {
  getFormationById,
  getRelatedFormationsByCategory,
} from '@/lib/data/formations.server';

// Utils
import { normalizeArray } from '@/lib/utils/data-format';

// Modals / Components
import { InscriptionModal } from '@/components/inscription-modal';
import { RelatedFormations } from '@/components/related-formations';

// Formation Tabs
import { PrerequisTab } from '@/components/formations/tabs/PrerequisTab';
import { PublicCibleTab } from '@/components/formations/tabs/PublicCibleTab';
import { JobsTab } from '@/components/formations/tabs/JobsTab';
import { RessourcesTab } from '@/components/formations/tabs/RessourcesTab';
import { ModalitesTab } from '@/components/formations/tabs/ModalitesTab';
import { AccessibiliteTab } from '@/components/formations/tabs/AccessibiliteTab';
import { CurriculumTab } from '@/components/formations/tabs/CurriculumTab';
import { ProgrammeTab } from '@/components/formations/tabs/ProgrammeTab';
import { HorairesTab } from '@/components/formations/tabs/HorairesTab';
import { InfosTab } from '@/components/formations/tabs/InfosTab';
import { SessionsTab } from '@/components/formations/tabs/SessionsTab';


const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return "Gratuit";
  if (price === 0) return "Gratuit";
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
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

const dayMap: { [key: string]: string } = {
  lu: 'Lundi', ma: 'Mardi', me: 'Mercredi', je: 'Jeudi', ve: 'Vendredi', sa: 'Samedi', di: 'Dimanche',
  lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi', jeudi: 'Jeudi', vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche'
};

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

  // Fetch related formations
  const { data: relatedFormations } = await getRelatedFormationsByCategory(formation.id, formation.categorie_id);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
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
        {/* Section Média (Image/Vidéo) */}
        <div className="relative h-56 md:h-80 lg:h-96 w-full overflow-hidden">
          {formation.video_intro_url ? (
            <div className="h-full w-full bg-black flex items-center justify-center">
              <video
                src={formation.video_intro_url}
                controls
                className="h-full w-full object-contain"
                poster={formation.image_url || undefined}
              >
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
          ) : formation.image_url ? (
            <Image src={formation.image_url} alt={formation.titre || ''} layout="fill" objectFit="cover" className="bg-secondary" />
          ) : (
            <div className="h-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-white/80" />
            </div>
          )}
          {!formation.video_intro_url && <div className="absolute inset-0 bg-black/30" />}
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
                  {formation.capacite && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{formation.capacite} places</span>
                    </div>
                  )}
                  {(formation.lieu || formation.pays) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>
                        {[
                          formation.lieu,
                          formation.quartier?.nom,
                          formation.ville?.nom,
                          formation.pays?.nom
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {formation.professeur && (
                  <Link href={`/professeurs/${formation.professeur.id}`} className="flex items-center space-x-4 pt-6 group">
                    <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary transition-colors">
                      <AvatarImage src={formation.professeur.profiles?.avatar_url || ''} alt={formation.professeur.profiles?.full_name || ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{formation.professeur.profiles?.full_name?.charAt(0) || 'P'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg text-foreground">{formation.professeur.profiles?.full_name || "Professeur"}</p>
                      <p className="text-sm text-muted-foreground">{formation.professeur.titre}</p>
                    </div>
                  </Link>
                )}
              </Card>

              {/* Barre de statistiques rapide (Mobile/Tablet) - Visible only on small screens if needed, but here we keep it as part of the flow or move to right col */}
              <Card className="lg:hidden grid grid-cols-2 gap-4 p-4 bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border-none">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-primary" />
                  <div><p className="text-sm text-muted-foreground">Durée</p><p className="font-bold">{formation.duree_texte || 'N/A'}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div><p className="text-sm text-muted-foreground">Niveau</p><p className="font-bold">{formation.niveau || 'Tous'}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <Computer className="h-8 w-8 text-primary" />
                  <div><p className="text-sm text-muted-foreground">Mode</p><p className="font-bold capitalize">{formation.mode?.replace('_', ' ') || 'Non spécifié'}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <div><p className="text-sm text-muted-foreground">Certificat</p><p className="font-bold">{formation.certificat ? 'Oui' : 'Non'}</p></div>
                </div>
              </Card>

              {/* Contenu principal avec onglets */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="flex w-full overflow-x-auto justify-start md:flex md:flex-wrap gap-2 bg-transparent md:bg-muted/50 p-0 md:p-1 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <TabsTrigger value="about" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Info className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">À propos</span></TabsTrigger>
                  <TabsTrigger value="infos" className="lg:hidden flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Info className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Infos</span></TabsTrigger>
                  {curriculum.length > 0 && <TabsTrigger value="curriculum" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Book className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Curriculum</span></TabsTrigger>}
                  {formation.programme && <TabsTrigger value="programme" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><List className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Programme</span></TabsTrigger>}
                  {(formation.horaires || formation.jours_formation) && <TabsTrigger value="horaires" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Calendar className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Horaires</span></TabsTrigger>}
                  {sessions.length > 0 && <TabsTrigger value="sessions" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Calendar className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Sessions</span></TabsTrigger>}
                  {formation.ressources && <TabsTrigger value="ressources" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><FileText className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Ressources</span></TabsTrigger>}
                  {formation.prerequis && <TabsTrigger value="prerequis" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><CheckCircle2 className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Prérequis</span></TabsTrigger>}
                  {formation.public_cible && <TabsTrigger value="public_cible" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Users className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Public</span></TabsTrigger>}
                  {formation.jobs_relies && <TabsTrigger value="jobs" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Briefcase className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Débouchés</span></TabsTrigger>}
                  {formation.modalites_evaluation && <TabsTrigger value="modalites" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Award className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Modalités</span></TabsTrigger>}
                  {formation.accessibilite && <TabsTrigger value="accessibilite" className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full md:rounded-sm px-4 py-2 border md:border-none whitespace-nowrap"><Accessibility className="h-4 w-4 mr-0 md:mr-2" /><span className="hidden md:inline">Accessibilité</span></TabsTrigger>}
                </TabsList>

                <TabsContent value="infos">
                  <InfosTab formation={formation} formatPrice={formatPrice} formatDate={formatDate} />
                </TabsContent>

                <TabsContent value="about" className="p-6 bg-background rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Description de la formation</h3>
                  <div className="prose dark:prose-invert max-w-none text-foreground/90 mb-6">
                    {formation.description || "Aucune description disponible."}
                  </div>

                  {/* Infos supplémentaires non couvertes par les autres onglets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground border-t pt-4 mt-6">
                    {formation.date_publication && (
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Publié le : {formatDate(String(formation.date_publication))}</div>
                    )}
                    {formation.updated_at && (
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Mis à jour le : {formatDate(String(formation.updated_at))}</div>
                    )}
                    {formation.ville && (
                      <div className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Ville : {formation.ville.nom}</div>
                    )}
                    {formation.pays && (
                      <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Pays : {formation.pays.nom}</div>
                    )}
                    {formation.capacite && (
                      <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Capacité totale : {formation.capacite} places</div>
                    )}
                    {formation.langue_enseignement && (
                      <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Langue : <span className="capitalize">{formation.langue_enseignement}</span></div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="curriculum">
                  <CurriculumTab curriculum={curriculum} />
                </TabsContent>

                <TabsContent value="programme">
                  <ProgrammeTab programme={formation.programme} />
                </TabsContent>

                <TabsContent value="horaires">
                  <HorairesTab horaires={formation.horaires} joursFormation={formation.jours_formation} />
                </TabsContent>

                <TabsContent value="sessions">
                  <SessionsTab sessions={sessions} formatDate={formatDate} />
                </TabsContent>

                <TabsContent value="ressources">
                  <RessourcesTab ressources={formation.ressources} />
                </TabsContent>

                <TabsContent value="prerequis">
                  <PrerequisTab prerequis={formation.prerequis} />
                </TabsContent>

                <TabsContent value="public_cible">
                  <PublicCibleTab publicCible={formation.public_cible} />
                </TabsContent>

                <TabsContent value="jobs">
                  <JobsTab jobs={formation.jobs_relies} />
                </TabsContent>

                <TabsContent value="modalites">
                  <ModalitesTab modalites={formation.modalites_evaluation} />
                </TabsContent>

                <TabsContent value="accessibilite">
                  <AccessibiliteTab accessibilite={formation.accessibilite} />
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
                    <Heart className="mr-2 h-5 w-5" /> Ajouter aux favoris
                  </Button>
                </CardContent>
                <CardFooter className="p-0 border-t mt-6 pt-6 flex flex-col items-start gap-3">
                  <h3 className="font-bold text-lg mb-2">Ce cours inclut :</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground"><Clock className="h-4 w-4 text-primary" /><span>Durée de {formation.duree_texte || 'N/A'}</span></div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground"><ListVideo className="h-4 w-4 text-primary" /><span>{nbLecons} leçons dans {nbModules} modules</span></div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground"><BarChart3 className="h-4 w-4 text-primary" /><span>Niveau {formation.niveau || 'Tous'}</span></div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground"><Computer className="h-4 w-4 text-primary" /><span>Mode {formation.mode?.replace('_', ' ') || 'Non spécifié'}</span></div>
                  {formation.certificat && <div className="flex items-center gap-3 text-sm text-muted-foreground"><Award className="h-4 w-4 text-primary" /><span>Certificat de fin de formation</span></div>}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground"><Users className="h-4 w-4 text-primary" /><span>Accès aux sessions de groupe</span></div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Formations Section */}
        <RelatedFormations formations={relatedFormations || []} />

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

    </div>
  );
}