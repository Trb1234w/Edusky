import { getProfesseurById, getRelatedProfesseursBySpecialty } from "@/lib/data/professeurs.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RelatedProfesseurs } from "@/components/related-professeurs";
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
  const langues = Array.isArray(professeur.profile?.langues) ? professeur.profile.langues : [];
  const competences = Array.isArray(professeur.profile?.competences) ? professeur.profile.competences : [];
  const diplomes = Array.isArray(professeur.profile?.diplomes) ? professeur.profile.diplomes : [];
  const formationsParcours = Array.isArray(professeur.profile?.formations_parcours) ? professeur.profile.formations_parcours : [];

  // Fetch related professeurs
  const { data: relatedProfesseurs } = await getRelatedProfesseursBySpecialty(professeur.id, specialites);

  return (
    <div className="min-h-screen flex flex-col">
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
        <span className="font-semibold text-lg">{professeur.profile?.full_name}</span>
        {/* Placeholder for potential right-side actions if needed */}
        <div className="w-12"></div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-black">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 xl:gap-16">
            {/* Colonne de gauche : Contenu principal */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Fil d'ariane */}
              <nav className="hidden lg:flex text-sm text-muted-foreground items-center gap-2 lg:mt-6">
                <Link href="/professeurs" className="hover:text-primary transition-colors">Professeurs</Link>
                <span className="mx-2">/</span>
                <span className="font-medium text-foreground">{professeur.profile?.full_name}</span>
              </nav>

              {/* Section Hero du Professeur */}
              <Card className="p-6 md:p-8 lg:p-10 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border-none">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20 shadow-lg transition-transform duration-300 hover:scale-105">
                    <AvatarImage src={professeur.profile?.avatar_url || ''} alt={professeur.profile?.full_name || ''} />
                    <AvatarFallback className="text-5xl font-extrabold bg-primary text-primary-foreground">{professeur.profile?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left flex-1 space-y-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                      {professeur.profile?.full_name}
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground">{professeur.titre}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                      <StarRating rating={professeur.note_moyenne} />
                      <span className="text-sm text-muted-foreground">({professeur.nb_notes} avis)</span>
                    </div>
                    {/* Badges de statistiques */}
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
                      {(professeur.pays?.nom || professeur.ville?.nom) && (
                        <Badge variant="default" className="flex items-center gap-2 py-2 px-4 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full">
                          <MapPin className="h-4 w-4" />
                          <span>{[professeur.quartier?.nom, professeur.ville?.nom, professeur.pays?.nom].filter(Boolean).join(', ')}</span>
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
                <p className="text-base leading-relaxed text-foreground/90">{professeur.presentation || professeur.profile?.bio || "Ce professeur n'a pas encore rédigé de présentation détaillée."}</p>
              </Card>

              {/* Spécialités */}
              {specialites.length > 0 && (
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-primary" /> Spécialités
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {specialites.map((spec: string, index: number) => (
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
                    {langues.map((lang: string, index: number) => (
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
                    {competences.map((comp: string, index: number) => (
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
                      <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                        <Award className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <p className="font-bold text-lg">{diplome.titre || diplome.name}</p>
                          <p className="text-muted-foreground">{diplome.ecole || diplome.institution} - {diplome.annee || diplome.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Colonne de droite : Contact & Tarifs (Sticky) */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border-none">
                  <h3 className="text-xl font-bold mb-4">Tarifs indicatifs</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-muted-foreground">Taux horaire</span>
                      <span className="font-bold text-xl text-primary">
                        {professeur.tarif_horaire_min ? `${formatPrice(professeur.tarif_horaire_min)} - ${formatPrice(professeur.tarif_horaire_max)}` : formatPrice(professeur.tarif_indicatif)}
                        <span className="text-sm font-normal text-muted-foreground">/h</span>
                      </span>
                    </div>
                    <Button className="w-full text-lg py-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                      Contacter ce professeur
                    </Button>
                    <Button variant="outline" className="w-full text-lg py-6 rounded-xl font-bold">
                      Réserver un cours
                    </Button>
                  </div>
                </Card>

                {/* Coordonnées (si disponibles) */}
                <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">Coordonnées</h3>
                  <div className="space-y-3">
                    {professeur.profile?.email && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="truncate">{professeur.profile.email}</span>
                      </div>
                    )}
                    {professeur.profile?.telephone && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{professeur.profile.telephone}</span>
                      </div>
                    )}
                    {professeur.profile?.site_web && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Globe className="h-5 w-5 text-primary" />
                        <a href={professeur.profile.site_web} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Site web</a>
                      </div>
                    )}
                    {professeur.profile?.linkedin_url && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Linkedin className="h-5 w-5 text-primary" />
                        <a href={professeur.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">LinkedIn</a>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related Professeurs Section */}
      <div className="bg-white dark:bg-black py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RelatedProfesseurs professeurs={relatedProfesseurs || []} />
        </div>
      </div>
    </div>
  );
}