import { createClient } from "@/lib/supabase/server";
import { getUserProfileByUsername } from "@/lib/data/users.server";
import { getPostsByAuthorId } from "@/lib/data/posts.server";
import { getRegisteredEventsByUserId } from "@/lib/data/evenements.server";
import { getRegisteredFormationsByUserId } from "@/lib/data/formations.server";
import { getRegisteredClubsByUserId } from "@/lib/data/clubs.server";
import { getFavoritesByUserId } from "@/lib/data/favorites.server";
import { getFollowers, getFollowing } from "@/lib/data/suivis.server"; // Added import
import { notFound, redirect } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SharedPostCard } from "@/components/shared-post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile-header";
import { EventCard } from "@/components/event-card";
import { CourseCard } from "@/components/course-card";
import { ClubCard } from "@/components/club-card";
import { Card } from "@/components/ui/card"; // Added for empty states
import { Skeleton } from "@/components/ui/skeleton"; // Added for loading states
import { FollowersList } from "@/components/FollowersList"; // Added import
import { FavoritesList } from "@/app/dashboard/favorites-list"; // Import the new component

// On force le rendu dynamique pour que la page soit toujours à jour
export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Next.js avec Turbopack peut passer les params comme une promesse. Il faut la résoudre.
  const resolvedParams = await params;
  const { username } = resolvedParams;
  const supabase = await createClient();

  // Récupérer l'utilisateur actuellement connecté
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  // Récupérer les données du profil visité
  const { data: profile, error: profileError } = await getUserProfileByUsername(username, currentUser?.id);

  if (profileError || !profile) {
    notFound(); // Affiche une page 404 si le profil n'est pas trouvé
  }

  // Si l'utilisateur visite son propre profil via /profile/[username], on le redirige vers la page /dashboard
  if (currentUser && currentUser.id === profile.id) {
    redirect('/dashboard');
  }

  // Récupérer les posts de l'auteur du profil
  const { data: posts, error: postsError } = await getPostsByAuthorId(profile.id, currentUser?.id);

  if (postsError) {
    // On peut choisir d'afficher une erreur ou simplement de ne pas afficher de posts
    console.error("Error fetching posts for profile:", postsError);
  }

  // Récupérer les événements auxquels l'utilisateur du profil est inscrit
  let { data: registeredEvents, error: registeredEventsError } = await getRegisteredEventsByUserId(profile.id);
  if (registeredEventsError) {
    console.error("Error fetching registered events for profile:", registeredEventsError);
    registeredEvents = []; // Ensure it's an array even on error
  } else {
    // Dédupliquer les registeredEventsData basés sur leur 'id'
    registeredEvents = Array.from(new Map(registeredEvents.map(event => [event.id, event])).values());
  }

  // Récupérer les formations auxquelles l'utilisateur du profil est inscrit
  const { data: registeredFormations, error: registeredFormationsError } = await getRegisteredFormationsByUserId(profile.id);
  if (registeredFormationsError) {
    console.error("Error fetching registered formations for profile:", registeredFormationsError);
  }

  // Récupérer les clubs auxquels l'utilisateur du profil est inscrit
  const { data: registeredClubs, error: registeredClubsError } = await getRegisteredClubsByUserId(profile.id);
  if (registeredClubsError) {
    console.error("Error fetching registered clubs for profile:", registeredClubsError);
  }

  // Récupérer les favoris de l'utilisateur du profil via la nouvelle fonction RPC
  const { data: favorites, error: favoritesError } = await supabase.rpc('get_user_favorites', { p_user_id: profile.id });
  if (favoritesError) {
    console.error("Error fetching favorites for profile:", favoritesError);
  }

  // Récupérer les abonnés du profil
  const { data: followers, error: followersError } = await getFollowers(profile.id);
  if (followersError) {
    console.error("Error fetching followers for profile:", followersError);
  }

  // Récupérer les abonnements du profil
  const { data: following, error: followingError } = await getFollowing(profile.id);
  if (followingError) {
    console.error("Error fetching following for profile:", followingError);
  }

  const renderPost = (post: any) => {
    const props = {
      ...post,
      currentUserId: currentUser?.id,
      followingIds: [], // Cette information n'est pas cruciale ici, on peut la laisser vide
      authorUsername: post.authorUsername, // Corrigé
    };
    if (post.sharedPost) {
      return <SharedPostCard key={post.id} {...props} />;
    }
    return <PostCard key={post.id} {...props} />;
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container mx-auto px-4 py-8">
        {/* Section de l'en-tête du profil gérée par le composant client */}
        <ProfileHeader profile={profile} currentUserId={currentUser?.id} />

        {/* Section des contenus du profil */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="flex w-full overflow-x-auto whitespace-nowrap justify-start gap-2 pb-2">
            <TabsTrigger value="posts">Publications</TabsTrigger>
            <TabsTrigger value="abonnements">Abonnements</TabsTrigger>
            <TabsTrigger value="abonnes">Abonnés</TabsTrigger>
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="formations">Formations</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {posts && posts.length > 0 ? (
                posts.map(renderPost)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Cet utilisateur n'a encore rien publié.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="abonnements" className="mt-6">
            {followingError ? (
              <Card className="p-8 text-center text-destructive-foreground bg-destructive/10 border-destructive">
                Erreur lors du chargement des abonnements.
              </Card>
            ) : following && following.length > 0 ? (
              <FollowersList profiles={following} currentUserId={currentUser?.id} />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Cet utilisateur ne suit personne.
              </Card>
            )}
          </TabsContent>
          <TabsContent value="abonnes" className="mt-6">
            {followersError ? (
              <Card className="p-8 text-center text-destructive-foreground bg-destructive/10 border-destructive">
                Erreur lors du chargement des abonnés.
              </Card>
            ) : followers && followers.length > 0 ? (
              <FollowersList profiles={followers} currentUserId={currentUser?.id} />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Cet utilisateur n'a aucun abonné.
              </Card>
            )}
          </TabsContent>
          <TabsContent value="events" className="mt-6">
            {registeredEventsError ? (
              <Card className="p-8 text-center text-destructive-foreground bg-destructive/10 border-destructive">
                Erreur lors du chargement des événements.
              </Card>
            ) : registeredEvents && registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.titre || ""}
                    description={event.extrait || event.description || ""}
                    date={new Date(event.date_debut || "").toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    time={new Date(event.date_debut || "").toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    location={event.lieu || event.mode || ""}
                    category={event.categorie?.nom || ""}
                    participants={0} // Placeholder
                    maxParticipants={event.capacite || 0}
                    organizer={event.organisateur?.full_name || "Inconnu"}
                    image={event.image_url || "/placeholder.png"}
                    status={new Date(event.date_debut) > new Date() ? "upcoming" : "past"}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Cet utilisateur n'est inscrit à aucun événement.
              </Card>
            )}
          </TabsContent>
          <TabsContent value="formations" className="mt-6">
            {registeredFormationsError ? (
              <Card className="p-8 text-center text-destructive-foreground bg-destructive/10 border-destructive">
                Erreur lors du chargement des formations.
              </Card>
            ) : registeredFormations && registeredFormations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredFormations.map(formation => (
                  <CourseCard
                    key={formation.id}
                    id={formation.id}
                    title={formation.titre || ""}
                    description={formation.extrait || ""}
                    instructor={formation.professeur?.profiles?.full_name || "Inconnu"}
                    category={formation.categorie?.nom || ""}
                    level={formation.niveau || ""}
                    duration={formation.duree_texte || ""}
                    students={formation.nb_avis || 0}
                    rating={formation.note_moyenne || 0}
                    price={formation.prix_indicatif ? `${formation.prix_indicatif} GNF` : "Gratuit"}
                    image={formation.image_url || "/placeholder.png"}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Cet utilisateur n'est inscrit à aucune formation.
              </Card>
            )}
          </TabsContent>
          <TabsContent value="clubs" className="mt-6">
            {registeredClubsError ? (
              <Card className="p-8 text-center text-destructive-foreground bg-destructive/10 border-destructive">
                Erreur lors du chargement des clubs.
              </Card>
            ) : registeredClubs && registeredClubs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredClubs.map(club => (
                  <ClubCard
                    key={club.id}
                    id={club.id}
                    name={club.nom || ""}
                    description={club.description || ""}
                    category={club.club?.categorie?.nom || ""} // Adjusted to access nested category name
                    members={club.club?.capacite || 0} // Using capacite as a proxy for members
                    activities="Activités non spécifiées" // Placeholder
                    president={club.club?.leader?.full_name || "Inconnu"}
                    image={club.club?.image_url || "/placeholder.png"}
                    verified={false} // Placeholder
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Cet utilisateur n'est inscrit à aucun club.
              </Card>
            )}
          </TabsContent>
          <TabsContent value="favorites" className="mt-6">
            {favoritesError ? (
              <Card className="p-8 text-center text-destructive-foreground bg-destructive/10 border-destructive">
                Erreur lors du chargement des favoris.
              </Card>
            ) : favorites && favorites.length > 0 ? (
              <FavoritesList favorites={favorites} isLoading={false} />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Cet utilisateur n'a aucun favori.
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
