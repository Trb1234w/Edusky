'use client'; // <-- Convert to Client Component

import { useEffect, useState } from "react";
import { notFound, redirect, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // <-- Use CLIENT client

// Import components
import { PostCard } from "@/components/post-card";
import { SharedPostCard } from "@/components/shared-post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile-header";
import { EventCard } from "@/components/event-card";
import { CourseCard } from "@/components/course-card";
import { ClubCard } from "@/components/club-card";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowersList } from "@/components/FollowersList";
import { FavoritesList } from "@/app/dashboard/favorites-list";

// This is a placeholder skeleton for the profile page
function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-48 w-full mb-8" />
        <Skeleton className="h-10 w-full mb-6" />
        <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </main>
    </div>
  );
}


export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const supabase = createClient();

  // States for all the data
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [registeredFormations, setRegisteredFormations] = useState<any[]>([]);
  const [registeredClubs, setRegisteredClubs] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchAllProfileData = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (profileError || !profileData) {
        return notFound();
      }

      if (user && user.id === profileData.id) {
        return redirect('/dashboard');
      }

      setProfile(profileData);

      const [
        postsResult,
        followersResult,
        followingResult,
        eventsResult,
        formationsResult,
        clubsResult,
        favoritesResult,
      ] = await Promise.all([
        supabase.from('postes').select('*, profiles(*)').eq('auteur_id', profileData.id).order('created_at', { ascending: false }),
        supabase.from('suivis').select('follower_id, profiles!suivis_follower_id_fkey(*)').eq('followed_id', profileData.id),
        supabase.from('suivis').select('followed_id, profiles!suivis_followed_id_fkey(*)').eq('follower_id', profileData.id),
        supabase.from('inscriptions_evenement').select('evenements(*, categories(*))').eq('user_id', profileData.id),
        supabase.from('inscriptions_formation').select('formations(*, categories(*), professeurs(*, profiles(*)))').eq('user_id', profileData.id),
        supabase.from('inscriptions_club').select('clubs(*, categories(*), leader:profiles(*))').eq('user_id', profileData.id),
        supabase.rpc('get_user_favorites', { p_user_id: profileData.id })
      ]);
      
      setPosts(postsResult.data || []);
      setFollowers(followersResult.data?.map((f: any) => f.profiles) || []);
      setFollowing(followingResult.data?.map((f: any) => f.profiles) || []);
      const uniqueEvents = Array.from(new Map(eventsResult.data?.map((e: any) => e.evenements).filter(Boolean).map((event: any) => [event.id, event])).values());
      setRegisteredEvents(uniqueEvents);
      setRegisteredFormations(formationsResult.data?.map((f: any) => f.formations) || []);
      setRegisteredClubs(clubsResult.data?.map((c: any) => c.clubs) || []);
      setFavorites(favoritesResult.data || []);

      setLoading(false);
    };

    fetchAllProfileData();
  }, [username]);

  if (loading || !profile) {
    return <ProfilePageSkeleton />;
  }
  
  // Pass is_favorited to cards by checking against the main favorites list
  const favoriteIds = new Set(favorites.map((f: any) => f.id));

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container mx-auto px-4 py-8">
        <ProfileHeader profile={profile} currentUserId={currentUser?.id} />

        <Tabs defaultValue="posts" className="w-full mt-8">
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
                posts.map((post: any) => <PostCard key={post.id} {...post} author={post.profiles.full_name} authorAvatar={post.profiles.avatar_url} authorRole={post.profiles.role} authorUsername={post.profiles.username} currentUserId={currentUser?.id} liked={false} followingIds={[]}/>)
              ) : (
                <Card className="p-8 text-center text-muted-foreground">Cet utilisateur n'a encore rien publié.</Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="abonnements" className="mt-6">
            {following && following.length > 0 ? (
              <FollowersList profiles={following} currentUserId={currentUser?.id} />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">Cet utilisateur ne suit personne.</Card>
            )}
          </TabsContent>
          <TabsContent value="abonnes" className="mt-6">
            {followers && followers.length > 0 ? (
              <FollowersList profiles={followers} currentUserId={currentUser?.id} />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">Cet utilisateur n'a aucun abonné.</Card>
            )}
          </TabsContent>
          <TabsContent value="events" className="mt-6">
            {registeredEvents && registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((event: any) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.titre || ""}
                    description={event.extrait || event.description || ""}
                    date={new Date(event.date_debut || "").toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    time={new Date(event.date_debut || "").toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    location={event.lieu || event.mode || ""}
                    category={event.categories?.nom || ""}
                    participants={0}
                    maxParticipants={event.capacite || 0}
                    organizer={"Inconnu"}
                    image={event.image_url || "/placeholder.png"}
                    status={new Date(event.date_debut) > new Date() ? "upcoming" : "past"}
                    is_favorited={favoriteIds.has(event.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">Cet utilisateur n'est inscrit à aucun événement.</Card>
            )}
          </TabsContent>
          <TabsContent value="formations" className="mt-6">
            {registeredFormations && registeredFormations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredFormations.map((formation: any) => (
                  <CourseCard
                    key={formation.id}
                    id={formation.id}
                    title={formation.titre || ""}
                    description={formation.extrait || ""}
                    instructor={formation.professeurs?.profiles?.full_name || "Inconnu"}
                    category={formation.categories?.nom || ""}
                    level={formation.niveau || ""}
                    duration={formation.duree_texte || ""}
                    students={formation.nb_avis || 0}
                    rating={formation.note_moyenne || 0}
                    price={formation.prix_indicatif ? `${formation.prix_indicatif} GNF` : "Gratuit"}
                    image={formation.image_url || "/placeholder.png"}
                    is_favorited={favoriteIds.has(formation.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">Cet utilisateur n'est inscrit à aucune formation.</Card>
            )}
          </TabsContent>
          <TabsContent value="clubs" className="mt-6">
            {registeredClubs && registeredClubs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredClubs.map((club: any) => (
                  <ClubCard
                    key={club.id}
                    id={club.id}
                    name={club.nom || ""}
                    description={club.description || ""}
                    category={club.categories?.nom || ""}
                    members={club.capacite || 0}
                    activities="Activités non spécifiées"
                    president={club.leader?.full_name || "Inconnu"}
                    image={club.image_url || "/placeholder.png"}
                    verified={false}
                    is_favorited={favoriteIds.has(club.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">Cet utilisateur n'est inscrit à aucun club.</Card>
            )}
          </TabsContent>
          <TabsContent value="favorites" className="mt-6">
            {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length:3}).map((_,i)=><CourseCard.Skeleton key={i}/>)}</div> :
              <FavoritesList favorites={favorites} isLoading={loading} />
            }
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
