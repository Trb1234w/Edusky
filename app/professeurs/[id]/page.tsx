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
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        
        {/* Colonne de gauche : Contenu principal */}
        <div className="lg:col-span-2 space-y-12">
          {/* Fil d'ariane */}
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/professeurs" className="hover:text-primary transition-colors">Professeurs</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-foreground">{professeur.profile_full_name}</span>
          </nav>

          <header className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-background shadow-lg">
                <AvatarImage src={professeur.profile_avatar_url || ''} alt={professeur.profile_full_name || ''} />
                <AvatarFallback className="text-3xl lg:text-4xl font-bold">{professeur.profile_full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{professeur.profile_full_name}</h1>
                <p className="text-xl text-muted-foreground">{professeur.titre}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={professeur.note_moyenne} />
                  <span className="text-sm text-muted-foreground">({professeur.nb_notes} avis)</span>
                </div>
              </div>
            </div>
          </header>

          {/* Badges de statistiques */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Briefcase className="h-4 w-4" /><span>{professeur.annees_experience || 0} ans d'exp.</span></Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Users className="h-4 w-4" /><span>{professeur.nb_etudiants_formes || 0} étudiants formés</span></Badge>
            {professeur.is_publie && <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><CheckCircle className="h-4 w-4" /><span>Profil vérifié</span></Badge>}
            {professeur.certifications && professeur.certifications.length > 0 && <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Award className="h-4 w-4" /><span>Certifié</span></Badge>}
            {(professeur.pays_nom || professeur.ville_nom) && (
              <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3">
                <MapPin className="h-4 w-4" />
                <span>{[professeur.quartier_nom, professeur.ville_nom, professeur.pays_nom].filter(Boolean).join(', ')}</span>
              </Badge>
            )}
          </div>

          {/* Présentation */}
          <div className="prose prose-lg max-w-none text-foreground/90">
            <h2 className="text-2xl font-semibold mb-4">Présentation</h2>
            <p>{professeur.presentation || professeur.profile_bio || "Ce professeur n'a pas encore rédigé de présentation."}</p>
          </div>

          {/* Spécialités */}
          {specialites.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Spécialités</h2>
              <div className="flex flex-wrap gap-2">
                {specialites.map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-base py-2 px-4">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {langues.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Langues parlées</h2>
              <div className="flex flex-wrap gap-2">
                {langues.map((lang, index) => (
                  <Badge key={index} variant="outline" className="text-base py-2 px-4">
                    <Languages className="h-4 w-4 mr-2"/>{lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Compétences */}
          {competences.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {competences.map((comp, index) => (
                  <Badge key={index} variant="outline" className="text-base py-2 px-4">
                    <Lightbulb className="h-4 w-4 mr-2"/>{comp}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Diplômes */}
          {diplomes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Diplômes</h2>
              <div className="space-y-3">
                {diplomes.map((diplome: any, index: number) => (
                  <Card key={index} className="p-4">
                    <p className="font-semibold">{diplome.titre}</p>
                    <p className="text-sm text-muted-foreground">{diplome.institution} ({diplome.annee})</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Formations/Parcours */}
          {formationsParcours.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Parcours Professionnel / Formations</h2>
              <div className="space-y-3">
                {formationsParcours.map((parcours: any, index: number) => (
                  <Card key={index} className="p-4">
                    <p className="font-semibold">{parcours.poste} chez {parcours.entreprise}</p>
                    <p className="text-sm text-muted-foreground">{parcours.periode} - {parcours.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Certifications</h2>
              <div className="space-y-3">
                {certifications.map((cert: any, index: number) => (
                  <Card key={index} className="p-4">
                    <p className="font-semibold">{cert.nom}</p>
                    <p className="text-sm text-muted-foreground">{cert.organisme} ({cert.annee})</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne de droite : Carte d'action et Contact */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <Card className="sticky top-24">
            <CardHeader className="p-0">
              <div className="h-48 bg-secondary rounded-t-lg flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CardTitle className="text-2xl font-bold">Tarifs indicatifs</CardTitle>
              <p className="text-lg">{formatPrice(professeur.tarif_indicatif)}</p>
              {professeur.tarif_horaire_min && professeur.tarif_horaire_max && (
                <p className="text-sm text-muted-foreground">({formatPrice(professeur.tarif_horaire_min)} - {formatPrice(professeur.tarif_horaire_max)} / heure)</p>
              )}
              <Button size="lg" className="w-full text-lg">
                Contacter ce professeur
              </Button>
            </CardContent>
            <CardFooter className="p-6 border-t space-y-4 flex flex-col items-start">
              <h3 className="text-lg font-semibold">Contact</h3>
              {professeur.profile_email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-5 w-5"/>
                  <a href={`mailto:${professeur.profile_email}`} className="hover:text-primary transition-colors">{professeur.profile_email}</a>
                </div>
              )}
              {professeur.profile_phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-5 w-5"/>
                  <a href={`tel:${professeur.profile_phone}`} className="hover:text-primary transition-colors">{professeur.profile_phone}</a>
                </div>
              )}
              {professeur.profile_site_web && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-5 w-5"/>
                  <a href={professeur.profile_site_web} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Site Web</a>
                </div>
              )}
              {professeur.profile_linkedin_url && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Linkedin className="h-5 w-5"/>
                  <a href={professeur.profile_linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
