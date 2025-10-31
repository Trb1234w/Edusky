import { getClubById } from "@/lib/data/clubs.server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InscriptionClubModal } from "@/components/inscription-club-modal";
import { Calendar, User, MapPin, Users, Tag, BookOpen, Award } from "lucide-react";

// --- Helpers ---

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Date non spécifiée";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// --- Page Component ---

export default async function ClubDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const { data: club, error } = await getClubById(resolvedParams.id);

  if (error || !club) {
    console.error("Failed to fetch club or club not found:", error);
    notFound();
  }

  const inscriptions = Array.isArray(club.inscriptions) ? club.inscriptions : [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        
        {/* Colonne de gauche : Contenu principal */}
        <div className="lg:col-span-2 space-y-12">
          {/* Fil d'ariane */}
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/clubs" className="hover:text-primary transition-colors">Clubs</Link>
            {club.categorie && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/clubs?categorie=${club.categorie.slug}`} className="hover:text-primary transition-colors">
                  {club.categorie.nom}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="font-medium text-foreground">{club.nom}</span>
          </nav>

          <header className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{club.nom}</h1>
            <p className="text-xl text-muted-foreground">{club.description}</p>
            
            {club.leader && (
              <div className="flex items-center space-x-4 pt-2">
                <Link href={`/profiles/${club.leader.id}`} className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={club.leader.avatar_url || ''} alt={club.leader.full_name || ''} />
                    <AvatarFallback>{club.leader.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{club.leader.full_name}</p>
                    <p className="text-sm text-muted-foreground">Leader du club</p>
                  </div>
                </Link>
              </div>
            )}
          </header>

          {/* Badges de statistiques */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Tag className="h-4 w-4" /><span>Statut: {club.statut || 'N/A'}</span></Badge>
            {club.capacite && <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><Users className="h-4 w-4" /><span>Capacité: {club.capacite}</span></Badge>}
            {club.lieu && <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><MapPin className="h-4 w-4" /><span>Lieu: {club.lieu}</span></Badge>}
            {club.theme_principal && <Badge variant="secondary" className="flex items-center gap-1.5 py-1.5 px-3"><span>Thème: {club.theme_principal}</span></Badge>}
          </div>

          {/* Description détaillée */}
          <div className="prose prose-lg max-w-none text-foreground/90">
            <h2 className="text-2xl font-semibold mb-4">À propos de ce club</h2>
            <p>{club.description}</p>
          </div>

          {/* NOUVEAU: Section Membres */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Membres inscrits ({inscriptions.length})</h2>
            {inscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inscriptions.map(member => (
                  <Card key={member.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{member.nom} {member.prenom}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun membre inscrit pour le moment.</p>
            )}
          </div>
        </div>

        {/* Colonne de droite : Carte d'action */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <Card className="sticky top-24">
            <CardHeader className="p-0">
              {club.image_url ? (
                <Image src={club.image_url} alt={club.nom || ''} width={500} height={300} className="object-cover rounded-t-lg w-full" />
              ) : (
                <div className="h-48 bg-secondary rounded-t-lg flex items-center justify-center"><BookOpen className="h-12 w-12 text-muted-foreground" /></div>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CardTitle className="text-2xl font-bold">{club.nom}</CardTitle>
              <InscriptionClubModal clubId={club.id} clubName={club.nom} />
            </CardContent>
            <CardFooter className="p-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-5 w-5 text-primary"/>
                    <span>{club.statut === 'ouvert' ? "Club ouvert aux inscriptions" : "Club fermé"}</span>
                </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
