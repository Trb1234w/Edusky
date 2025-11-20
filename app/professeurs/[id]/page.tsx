import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getProfesseurById } from "@/lib/data/professeurs.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, Briefcase, CheckCircle, Award, Mail, Phone, Globe, Linkedin, BookOpen, GraduationCap, Languages, Lightbulb, MapPin, User } from "lucide-react";

// --- Helpers ---

const formatPrice = (price: number | null | undefined) => {
  if (price === null || price === undefined) return "Prix non disponible";
  if (price === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF" }).format(price);
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

export default async function ProfesseurDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const { data: professeur, error } = await getProfesseurById(resolvedParams.id);

  if (error || !professeur) {
    console.error("Failed to fetch professeur or professeur not found:", error);
    notFound();
  }

  const specialites = Array.isArray(professeur.specialites) ? professeur.specialites : [];
  const certifications = Array.isArray(professeur.certifications) ? professeur.certifications : [];
  const langues = Array.isArray(professeur.profile_langues) ? professeur.profile_langues : [];
  const competences = Array.isArray(professeur.profile_competences) ? professeur.profile_competences : [];
  const diplomes = Array.isArray(professeur.profile_diplomes) ? professeur.profile_diplomes : [];
  const formationsParcours = Array.isArray(professeur.profile_formations_parcours) ? professeur.profile_formations_parcours : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header className="hidden lg:block" /> {/* Show Header on desktop only */}

      {/* Mobile-only "header" with back button */}
      <div className="lg:hidden p-4 border-b bg-background flex items-center justify-between">
        <Link href="/professeurs" className="flex items-center text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left h-6 w-6"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <span className="font-semibold text-lg">{professeur.profile_full_name}</span>
        {/* Placeholder for potential right-side actions if needed */}
        <div className="w-12"></div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-black">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 xl:gap-16">
            {/* Colonne de gauche : Contenu principal */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Fil d'ariane - Visible sur Desktop, peut-être caché sur Mobile si le "Retour" suffit */}
              <nav className="hidden lg:flex text-sm text-muted-foreground items-center gap-2 lg:mt-6">
                <Link href="/professeurs" className="hover:text-primary transition-colors">Professeurs</Link>
                <span className="mx-2">/</span>
                <span className="font-medium text-foreground">{professeur.profile_full_name}</span>
              </nav>

              {/* Section Hero du Professeur */}
              <Card className="p-6 md:p-8 lg:p-10 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border-none">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20 shadow-lg transition-transform duration-300 hover:scale-105">
                    <AvatarImage src={professeur.profile_avatar_url || ''} alt={professeur.profile_full_name || ''} />
                    <AvatarFallback className="text-5xl font-extrabold bg-primary text-primary-foreground">{professeur.profile_full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left flex-1 space-y-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                      {professeur.profile_full_name}
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground">{professeur.titre}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                      <StarRating rating={professeur.note_moyenne} />
                      <span className="text-sm text-muted-foreground">({professeur.nb_notes} avis)</span>
                    </div>
                    {/* Badges de statistiques - Plus visuels */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                      <Badge variant="default" className="flex items-center gap-2 py-2 px-4 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                        <Briefcase className="h-4 w-4" /><span>{professeur.annees_experience || 0} ans d'expérience</span>
                      </Badge>
                      <Badge variant="default" className="flex items-center gap-2 py-2 px-4 text-sm bg-green-500 hover:bg-green-600 text-white rounded-full">
                        <Users className="h-4 w-4" /><span>{professeur.nb_etudiants_formes || 0} étudiants formés</span>
                      </Badge>
                      {professeur.is_publie && (
                        <Badge variant="default" className="flex items-center gap-2 py-2 px-4 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-full">
                          <CheckCircle className="h-4 w-4" /><span>Profil vérifié</span>
                        </Badge>
                      )}
                      {professeur.certifications && certifications.length > 0 && (
                        <Badge variant="default" className="flex items-center gap-2 py-2 px-4 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-full">
                          <Award className="h-4 w-4" /><span>Certifié</span>
                        </Badge>
                      )}
                      {(professeur.pays_nom || professeur.ville_nom) && (
                        <Badge variant="default" className="flex items-center gap-2 py-2 px-4 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full">
                          <MapPin className="h-4 w-4" />
                          <span>{[professeur.quartier_nom, professeur.ville_nom, professeur.pays_nom].filter(Boolean).join(', ')}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Présentation */}
              <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                  <User className="h-6 w-6 text-primary" /> Présentation
                </h2>
                <p className="text-base leading-relaxed text-foreground/90">{professeur.presentation || professeur.profile_bio || "Ce professeur n'a pas encore rédigé de présentation détaillée."}</p>
              </Card>

              {/* Spécialités */}
              {specialites.length > 0 && (
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-primary" /> Spécialités
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {specialites.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="py-2 px-4 text-base rounded-full border border-primary/20">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Langues */}
              {langues.length > 0 && (
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <Languages className="h-6 w-6 text-primary" /> Langues parlées
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {langues.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="py-2 px-4 text-base rounded-full border border-primary/20">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Compétences */}
              {competences.length > 0 && (
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-primary" /> Compétences
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {competences.map((comp, index) => (
                      <Badge key={index} variant="secondary" className="py-2 px-4 text-base rounded-full border border-primary/20">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Diplômes */}
              {diplomes.length > 0 && (
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-primary" /> Diplômes
                  </h2>
                  <div className="space-y-4">
                    {diplomes.map((diplome: any, index: number) => (
                      <Card key={index} className="p-4 md:p-5 bg-background dark:bg-gray-900 border border-primary/10 rounded-xl shadow-sm">
                        <p className="font-semibold text-lg md:text-xl text-foreground">{diplome.titre}</p>
                        <p className="text-sm md:text-base text-muted-foreground">{diplome.institution} ({diplome.annee})</p>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* Formations/Parcours */}
              {formationsParcours.length > 0 && (
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-primary" /> Parcours Professionnel
                  </h2>
                  <div className="space-y-4">
                    {formationsParcours.map((parcours: any, index: number) => (
                      <Card key={index} className="p-4 md:p-5 bg-background dark:bg-gray-900 border border-primary/10 rounded-xl shadow-sm">
                        <p className="font-semibold text-lg md:text-xl text-foreground">{parcours.poste} chez {parcours.entreprise}</p>
                        <p className="text-sm md:text-base text-muted-foreground">{parcours.periode} - {parcours.description}</p>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" /> Certifications
                  </h2>
                  <div className="space-y-4">
                    {certifications.map((cert: any, index: number) => (
                      <Card key={index} className="p-4 md:p-5 bg-background dark:bg-gray-900 border border-primary/10 rounded-xl shadow-sm">
                        <p className="font-semibold text-lg md:text-xl text-foreground">{cert.nom}</p>
                        <p className="text-sm md:text-base text-muted-foreground">{cert.organisme} ({cert.annee})</p>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Colonne de droite : Carte d'action et Contact */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <Card className="lg:sticky lg:top-28 p-6 md:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border-none">
                <CardContent className="p-0 space-y-6">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">Tarifs indicatifs</CardTitle>
                  <p className="text-3xl md:text-4xl font-extrabold text-primary">{formatPrice(professeur.tarif_indicatif)}</p>
                  {professeur.tarif_horaire_min && professeur.tarif_horaire_max && (
                    <p className="text-sm md:text-base text-muted-foreground">({formatPrice(professeur.tarif_horaire_min)} - {formatPrice(professeur.tarif_horaire_max)} / heure)</p>
                  )}
                  <Button size="lg" className="w-full text-lg md:text-xl py-3 rounded-xl font-bold">
                    Contacter ce professeur
                  </Button>
                </CardContent>
                <CardFooter className="p-0 border-t mt-6 pt-6 space-y-4 flex flex-col items-start">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">Coordonnées</h3>
                  {professeur.profile_email && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors w-full">
                      <Mail className="h-4 w-4"/>
                      <a href={`mailto:${professeur.profile_email}`} className="text-sm font-medium break-all">{professeur.profile_email}</a>
                    </div>
                  )}
                  {professeur.profile_phone && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors w-full">
                      <Phone className="h-4 w-4"/>
                      <a href={`tel:${professeur.profile_phone}`} className="text-sm font-medium break-all">{professeur.profile_phone}</a>
                    </div>
                  )}
                  {professeur.profile_site_web && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors w-full">
                      <Globe className="h-4 w-4"/>
                      <a href={professeur.profile_site_web} target="_blank" rel="noopener noreferrer" className="text-sm font-medium break-all">Site Web</a>
                    </div>
                  )}
                  {professeur.profile_linkedin_url && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors w-full">
                      <Linkedin className="h-4 w-4"/>
                      <a href={professeur.profile_linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium break-all">LinkedIn</a>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer className="hidden lg:block" /> {/* Show Footer on desktop only */}
    </div>
  );
}