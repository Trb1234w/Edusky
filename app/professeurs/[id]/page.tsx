import { getProfesseurById, getRelatedProfesseursBySpecialty, getReservationsByProfesseurId } from "@/lib/data/professeurs.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RelatedProfesseurs } from "@/components/related-professeurs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Users, Briefcase, CheckCircle, Award, Mail, Phone, Globe, Linkedin, BookOpen, GraduationCap, Languages, Lightbulb, MapPin, User } from "lucide-react";
import { ReservationDialog } from "@/components/professeurs/reservation-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReservationForm } from "@/components/professeurs/reservation-form";

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

  const { data: reservations, error: reservationsError } = await getReservationsByProfesseurId(professeur.id);

  if (reservationsError) {
    console.error("Failed to fetch reservations:", reservationsError);
  }

  const specialites = Array.isArray(professeur.specialites) ? professeur.specialites : [];
  const certifications = Array.isArray(professeur.certifications) ? professeur.certifications : [];
  const langues = Array.isArray(professeur.langues_enseignement) ? professeur.langues_enseignement : [];
  const diplomes = Array.isArray(professeur.diplomes) ? professeur.diplomes : [];
  const formationsParcours = Array.isArray(professeur.formations_parcours) ? professeur.formations_parcours : [];

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
        <span className="font-semibold text-lg">{professeur.full_name}</span>
        {/* Placeholder for potential right-side actions if needed */}
        <div className="w-12"></div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 xl:gap-16">
            {/* Colonne de gauche : Contenu principal */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Fil d'ariane */}
              <nav className="hidden lg:flex text-sm text-muted-foreground items-center gap-2 lg:mt-6">
                <Link href="/professeurs" className="hover:text-primary transition-colors">Professeurs</Link>
                <span className="mx-2">/</span>
                <span className="font-medium text-foreground">{professeur.full_name}</span>
              </nav>

              {/* Section Hero du Professeur */}
              <Card className="p-6 md:p-8 lg:p-10 bg-white shadow-xl rounded-2xl border-none">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20 shadow-lg transition-transform duration-300 hover:scale-105">
                    <AvatarImage src={professeur.image_url || ''} alt={professeur.full_name || ''} />
                    <AvatarFallback className="text-5xl font-extrabold bg-primary text-primary-foreground">{professeur.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left flex-1 space-y-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                      {professeur.full_name}
                    </h1>
                    {professeur.presentation && (
                      <p className="text-muted-foreground mt-2">{professeur.presentation}</p>
                    )}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                      {specialites.map((spec: any, i: number) => (
                        <Badge key={i} variant="secondary">{typeof spec === 'string' ? spec : spec.nom}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tabs Section */}
              <Tabs defaultValue="parcours" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="parcours">Parcours</TabsTrigger>
                  <TabsTrigger value="availability">Disponibilités</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList>

                <TabsContent value="parcours" className="space-y-6">
                  {/* Expérience Professionnelle */}
                  <Card className="p-6 md:p-8 bg-white shadow-lg rounded-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                      <Briefcase className="h-6 w-6 text-primary" /> Expérience
                    </h2>
                    {formationsParcours.length > 0 ? (
                      <div className="space-y-6">
                        {formationsParcours.map((item: any, index: number) => (
                          <div key={index} className="flex gap-4 relative pl-6 border-l-2 border-primary/20 last:border-0 pb-6 last:pb-0">
                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-white dark:ring-gray-800" />
                            <div>
                              <h3 className="font-bold text-lg">{item.titre || item.role || "Poste"}</h3>
                              <p className="text-primary font-medium">{item.institution || item.company}</p>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.date_debut || item.startDate} - {item.date_fin || item.endDate || "Présent"}
                              </p>
                              {item.description && <p className="text-muted-foreground">{item.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Aucune expérience professionnelle renseignée.</p>
                      </div>
                    )}
                  </Card>

                  {/* Diplômes */}
                  <Card className="p-6 md:p-8 bg-white shadow-lg rounded-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                      <GraduationCap className="h-6 w-6 text-primary" /> Diplômes
                    </h2>
                    {diplomes.length > 0 ? (
                      <div className="space-y-4">
                        {diplomes.map((diplome: any, index: number) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Award className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-lg">{diplome.titre || diplome.name}</p>
                              <p className="text-muted-foreground">{diplome.ecole || diplome.institution}</p>
                              <p className="text-sm text-primary font-medium mt-1">{diplome.annee || diplome.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Aucun diplôme renseigné.</p>
                      </div>
                    )}
                  </Card>

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <Card className="p-6 md:p-8 bg-white shadow-lg rounded-2xl space-y-4">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <Award className="h-6 w-6 text-primary" /> Certifications
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {certifications.map((cert: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-4 border rounded-xl bg-card">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="font-medium">{typeof cert === 'string' ? cert : cert.nom || cert.name}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="availability" className="space-y-6">
                  <Card className="p-6 md:p-8 bg-white shadow-lg rounded-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" /> Disponibilités
                    </h2>
                    {professeur.disponibilite ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(professeur.disponibilite).map(([day, hours]: [string, any], idx) => (
                          <div key={idx} className="p-4 border rounded-xl bg-muted/20">
                            <h3 className="font-bold capitalize mb-2">{day}</h3>
                            <p className="text-sm text-muted-foreground">{Array.isArray(hours) ? hours.join(', ') : String(hours)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/20 rounded-xl">
                        <p className="text-muted-foreground">Les disponibilités détaillées ne sont pas renseignées. Veuillez contacter le professeur directement.</p>
                      </div>
                    )}
                  </Card>
                  <Card className="p-6 md:p-8 bg-white shadow-lg rounded-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" /> Réservations
                    </h2>
                    {reservations && reservations.length > 0 ? (
                      <div className="space-y-4">
                        {reservations.map((reservation: any) => (
                          <div key={reservation.id} className="p-4 border rounded-xl bg-muted/20">
                            <h3 className="font-bold">{new Date(reservation.date_heure_debut).toLocaleString()} - {new Date(reservation.date_heure_fin).toLocaleString()}</h3>
                            <p className="text-sm text-muted-foreground">{reservation.message_utilisateur}</p>
                            <Badge className="mt-2" variant={reservation.statut === 'confirme' ? 'default' : 'secondary'}>{reservation.statut}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/20 rounded-xl">
                        <p className="text-muted-foreground">Aucune réservation pour le moment.</p>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-6">
                  <Card className="p-6 md:p-8 bg-white shadow-lg rounded-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground flex items-center gap-3">
                      <Briefcase className="h-6 w-6 text-primary" /> Portfolio
                    </h2>
                    {professeur.portfolio ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.isArray(professeur.portfolio) ? (
                          professeur.portfolio.map((item: any, idx: number) => (
                            <a key={idx} href={item.url || '#'} target="_blank" rel="noopener noreferrer" className="block p-4 border rounded-xl hover:shadow-md transition-all group">
                              <h3 className="font-bold group-hover:text-primary transition-colors">{item.titre || "Projet " + (idx + 1)}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            </a>
                          ))
                        ) : (
                          <div className="col-span-full">
                            <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">{JSON.stringify(professeur.portfolio, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/20 rounded-xl">
                        <p className="text-muted-foreground">Aucun élément de portfolio renseigné.</p>
                      </div>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Colonne de droite : Contact & Tarifs (Sticky) */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="p-6 bg-white shadow-xl rounded-2xl border-none">
                  <h3 className="text-xl font-bold mb-4">Tarifs indicatifs</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-muted-foreground">Taux horaire</span>
                      <span className="font-bold text-xl text-primary">
                        {professeur.tarif_horaire_min ? `${formatPrice(professeur.tarif_horaire_min)} - ${formatPrice(professeur.tarif_horaire_max)}` : formatPrice(professeur.tarif_indicatif)}
                        <span className="text-sm font-normal text-muted-foreground">/h</span>
                      </span>
                    </div>
<ReservationDialog professeurId={professeur.id} professeurName={professeur.full_name} />
                  </div>
                </Card>

                {/* Coordonnées (si disponibles) */}
                <Card className="p-6 bg-white shadow-lg rounded-2xl">
                  <h3 className="text-lg font-bold mb-4">Coordonnées</h3>
                  <div className="space-y-3">
                    {professeur.email_contact && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="truncate">{professeur.email_contact}</span>
                      </div>
                    )}
                    {professeur.telephone_professionnel && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{professeur.telephone_professionnel}</span>
                      </div>
                    )}
                    {professeur.site_web && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Globe className="h-5 w-5 text-primary" />
                        <a href={professeur.site_web} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">Site web</a>
                      </div>
                    )}
                    {professeur.linkedin_url && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Linkedin className="h-5 w-5 text-primary" />
                        <a href={professeur.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">LinkedIn</a>
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
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RelatedProfesseurs professeurs={relatedProfesseurs || []} />
        </div>
      </div>
    </div>
  );
}