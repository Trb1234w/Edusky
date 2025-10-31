import { getEvenementById } from "@/lib/data/evenements.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InscriptionEvenementModal } from "@/components/inscription-evenement-modal";
import { Calendar, User, MapPin, Users, Tag, Clock, BookOpen, Award } from "lucide-react";

// --- Helpers ---

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Date non spécifiée";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// --- Page Component ---

export default async function EvenementDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const { data: evenement, error } = await getEvenementById(resolvedParams.id);

  if (error || !evenement) {
    console.error("Failed to fetch evenement or evenement not found:", error);
    notFound();
  }

  const inscriptions = Array.isArray(evenement.inscriptions) ? evenement.inscriptions : [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        
        {/* Colonne de gauche : Contenu principal */}
        <div className="lg:col-span-2 space-y-12">
          {/* Fil d'ariane */}
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/evenements" className="hover:text-primary transition-colors">Événements</Link>
            {evenement.categorie && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/evenements?categorie=${evenement.categorie.slug}`} className="hover:text-primary transition-colors">
                  {evenement.categorie.nom}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="font-medium text-foreground">{evenement.titre}</span>
          </nav>

          <header className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{evenement.titre}</h1>
            <p className="text-xl text-muted-foreground">{evenement.extrait}</p>
            
            {evenement.organisateur && (
              <div className="flex items-center space-x-4 pt-2">
                <Link href={`/profiles/${evenement.organisateur.id}`} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={evenement.organisateur.avatar_url || ''} alt={evenement.organisateur.full_name || ''} />
                    <AvatarFallback>{evenement.organisateur.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{evenement.organisateur.full_name}</p>
                    <p className="text-sm text-muted-foreground">Organisateur</p>
                  </div>
                </Link>
              </div>
            )}
          </header>

          {/* Badges de statistiques */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Tag className="h-4 w-4" /><span>Statut: {evenement.statut || 'N/A'}</span></Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Clock className="h-4 w-4" /><span>Mode: {evenement.mode || 'N/A'}</span></Badge>
            {evenement.capacite && <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Users className="h-4 w-4" /><span>Capacité: {evenement.capacite}</span></Badge>}
            {evenement.type_evenement && <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><span>Type: {evenement.type_evenement}</span></Badge>}
            {(evenement.pays || evenement.ville || evenement.lieu) && (
              <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3">
                <MapPin className="h-4 w-4" />
                <span>{[evenement.lieu, evenement.quartier?.nom, evenement.ville?.nom, evenement.pays?.nom].filter(Boolean).join(', ')}</span>
              </Badge>
            )}
          </div>

          {/* Dates de l'événement */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Dates de l'événement</h2>
            <div className="flex items-center gap-4 text-sm">
              <Calendar className="h-5 w-5 text-primary"/>
              <div>
                <p className="font-semibold">Début: {formatDate(evenement.date_debut)}</p>
                <p className="text-muted-foreground">Fin: {formatDate(evenement.date_fin)}</p>
              </div>
            </div>
          </div>

          {/* Description détaillée */}
          <div className="prose prose-lg max-w-none text-foreground/90">
            <h2 className="text-2xl font-semibold mb-4">À propos de cet événement</h2>
            <p>{evenement.description}</p>
          </div>

          {/* NOUVEAU: Section Participants */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Participants inscrits ({inscriptions.length})</h2>
            {inscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inscriptions.map(participant => (
                  <Card key={participant.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{participant.nom} {participant.prenom}</p>
                        <p className="text-sm text-muted-foreground">{participant.email}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun participant inscrit pour le moment.</p>
            )}
          </div>
        </div>

        {/* Colonne de droite : Carte d'action */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <Card className="sticky top-24">
            <CardHeader className="p-0">
              {evenement.image_url ? (
                <Image src={evenement.image_url} alt={evenement.titre || ''} width={500} height={300} className="object-cover rounded-t-lg w-full" />
              ) : (
                <div className="h-48 bg-secondary rounded-t-lg flex items-center justify-center"><BookOpen className="h-12 w-12 text-muted-foreground" /></div>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CardTitle className="text-2xl font-bold">{evenement.titre}</CardTitle>
<InscriptionEvenementModal evenementId={evenement.id} evenementTitle={evenement.titre} />
            </CardContent>
            <CardFooter className="p-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-5 w-5 text-primary"/>
                    <span>{evenement.statut === 'publie' ? "Événement public" : "Statut: " + evenement.statut}</span>
                </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
