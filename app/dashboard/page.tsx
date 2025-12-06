'use client'

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CreatePost } from "@/components/CreatePost";



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Users,
  Trophy,
  Activity,
  Bell,
  Settings,
  Grid3x3,
  UserPlus,
  GraduationCap,
  Users2,
  Heart,
} from "lucide-react";

import { PostCard } from "@/components/post-card";
import { getFollowers, getFollowing } from "@/lib/data/suivis.server";
import { getRegisteredEvents, getRegisteredFormations, getRegisteredClubs, testServerAction, fetchUserPosts, getUserFavorites } from "@/app/dashboard/actions";
import { EventCard } from "@/components/event-card";
import { CourseCard } from "@/components/course-card";
import { ClubCard } from "@/components/club-card";
import { FollowersList } from "@/components/FollowersList";
import { FavoritesList } from "./favorites-list";
import { DashboardHeader } from "@/components/dashboard-header";
import { SharedPostCard } from "@/components/shared-post-card";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [registeredFormations, setRegisteredFormations] = useState<any[]>([]);
  const [registeredClubs, setRegisteredClubs] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [followersLoading, setFollowersLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [registeredEventsLoading, setRegisteredEventsLoading] = useState(true);
  const [registeredFormationsLoading, setRegisteredFormationsLoading] = useState(true);
  const [registeredClubsLoading, setRegisteredClubsLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/connexion");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        console.error("Erreur de récupération du profil:", profileError);
        router.push("/auth/connexion");
        return;
      }

      setProfile(profileData);
      setLoading(false);

      console.log(`--- DEBUG: Début du chargement des données pour l'utilisateur ${profileData.id} ---`);

      // Une fois le profil chargé, on charge les posts
      const { data: postsData, error: postsError } = await fetchUserPosts(profileData.id);
      if (!postsError && postsData) {
        setPosts(postsData);
      }
      setPostsLoading(false);

      console.log(`--- DEBUG: Chargement des followers pour l'utilisateur ${profileData.id} ---`);
      // Charger les followers
      console.log("--- About to call getFollowers ---");
      const { data: followersData, error: followersError } = await getFollowers(profileData.id);
      if (!followersError && followersData) {
        setFollowers(followersData);
      }
      setFollowersLoading(false);

      console.log(`--- DEBUG: Chargement des abonnements pour l'utilisateur ${profileData.id} ---`);
      const { data: followingData, error: followingError } = await getFollowing(profileData.id);
      if (!followingError && followingData) {
        setFollowing(followingData);
      }
      setFollowingLoading(false);

      // Charger les événements inscrits
      const { data: registeredEventsData, error: registeredEventsError } = await getRegisteredEvents();
      if (!registeredEventsError && registeredEventsData) {
        // Dédupliquer les événements basés sur leur 'id'
        const uniqueEvents = Array.from(new Map((registeredEventsData as any[]).map((event: any) => [event.id, event])).values());
        setRegisteredEvents(uniqueEvents);
      }
      setRegisteredEventsLoading(false);

      // Charger les formations inscrites
      const { data: registeredFormationsData, error: registeredFormationsError } = await getRegisteredFormations();
      if (!registeredFormationsError && registeredFormationsData) {
        setRegisteredFormations(registeredFormationsData);
      }
      setRegisteredFormationsLoading(false);

      // Charger les clubs inscrits
      const { data: registeredClubsData, error: registeredClubsError } = await getRegisteredClubs();
      if (!registeredClubsError && registeredClubsData) {
        setRegisteredClubs(registeredClubsData);
      }
      setRegisteredClubsLoading(false);

      // Charger les favoris
      const { data: favoritesData, error: favoritesError } = await getUserFavorites();
      if (!favoritesError && favoritesData) {
        setFavorites(favoritesData);
      }
      setFavoritesLoading(false);
    };

    fetchUserAndProfile();
  }, [router]);

  const handleLikeToggle = (postId: string, newLiked: boolean, newLikesCount: number) => {
    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.id === postId) {
          return { ...post, liked: newLiked, likes: newLikesCount };
        }
        if (post.sharedPost && post.sharedPost.id === postId) {
          return { ...post, sharedPost: { ...post.sharedPost, liked: newLiked, likes: newLikesCount } };
        }
        return post;
      })
    );
  };

  const handleFollowToggle = (userId: string, isFollowing: boolean) => {
    // Update following list
    if (isFollowing) {
      // Add to following if not present
      // We need to construct an object that matches the structure of 'following' items (which are profiles)
      const userInFollowers = followers.find(f => f.id === userId);

      // Check if already following (using 'id' as 'following' contains profiles)
      if (userInFollowers && !following.some(f => f.id === userId)) {
        setFollowing(prev => [...prev, userInFollowers]);
      }
    } else {
      // Remove from following
      // Filter by 'id' because 'following' contains profiles
      setFollowing(prev => prev.filter(f => f.id !== userId));
    }
  };

  const handleFavoriteToggle = (itemId: string, itemType: string, isFavorited: boolean) => {
    if (isFavorited) {
      let itemToAdd = null;

      if (itemType === 'evenement') {
        itemToAdd = registeredEvents.find(e => e.id === itemId);
        if (itemToAdd) {
          itemToAdd = {
            ...itemToAdd,
            title: itemToAdd.titre,
            description: itemToAdd.extrait || itemToAdd.description,
            author: itemToAdd.organisateur?.full_name,
            category: itemToAdd.categorie?.nom,
            location: itemToAdd.lieu || itemToAdd.mode,
            price: itemToAdd.prix,
            isFree: itemToAdd.est_gratuit,
            date: itemToAdd.date_debut,
            maxParticipants: itemToAdd.capacite
          };
        }
      } else if (itemType === 'formation') {
        itemToAdd = registeredFormations.find(f => f.id === itemId);
        if (itemToAdd) {
          itemToAdd = {
            ...itemToAdd,
            title: itemToAdd.titre,
            description: itemToAdd.extrait,
            author: itemToAdd.professeur?.full_name,
            category: itemToAdd.categorie?.nom,
            price: itemToAdd.prix_indicatif ? `${itemToAdd.prix_indicatif} GNF` : "Gratuit",
            language: itemToAdd.langue_enseignement,
            certificate: itemToAdd.certificat,
            level: itemToAdd.niveau,
            duration: itemToAdd.duree_texte,
            rating: itemToAdd.note_moyenne,
            students: itemToAdd.nb_avis
          };
        }
      } else if (itemType === 'club') {
        itemToAdd = registeredClubs.find(c => c.id === itemId);
        if (itemToAdd) {
          itemToAdd = {
            ...itemToAdd,
            title: itemToAdd.nom,
            description: itemToAdd.description,
            author: itemToAdd.leader?.full_name,
            category: itemToAdd.categorie?.nom,
            fees: itemToAdd.cotisation_mensuelle || itemToAdd.cotisation_annuelle || itemToAdd.prix_inscription,
            members: itemToAdd.capacite
          };
        }
      }

      if (itemToAdd && !favorites.some(fav => fav.id === itemId && fav.type === itemType)) {
        setFavorites(prev => [...prev, { ...itemToAdd, id: itemId, type: itemType }]);
      }
    } else {
      setFavorites(prev => prev.filter(fav => !(fav.id === itemId && fav.type === itemType)));
    }
  };
  const followingIds = useMemo(() => following.map((f: any) => f.id), [following]);

  const followersWithStatus = useMemo(() => followers.map(f => ({
    ...f,
    isFollowing: following.some((followed: any) => followed.id === f.id)
  })), [followers, following]);

  const followingWithStatus = useMemo(() => following.map(f => ({
    ...f,
    isFollowing: true // User is following everyone in their following list
  })), [following]);


  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!profile) {
    return null; // Should be redirected
  }

  return (
    <div className="min-h-screen bg-muted/30">

      <main className="container mx-auto px-0 md:px-4 py-8 pt-2 lg:pt-24">
        <DashboardHeader
          profile={profile}
          postsCount={posts.length}
          followersCount={followers.length}
          followingCount={following.length}
        />

        <section className="container mx-auto px-0 md:px-4">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="flex w-full overflow-x-auto whitespace-nowrap justify-start gap-1 lg:gap-2 pb-2 px-4 md:px-0 border-b-2 border-gray-200 dark:border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsTrigger
                value="posts"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 lg:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:hover:bg-transparent h-auto"
              >
                <Grid3x3 className="h-6 w-6 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline ml-2">Publications</span>
              </TabsTrigger>
              <TabsTrigger
                value="followers"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 lg:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:hover:bg-transparent h-auto"
              >
                <Users className="h-6 w-6 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline ml-2">Abonnés</span>
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 lg:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:hover:bg-transparent h-auto"
              >
                <UserPlus className="h-6 w-6 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline ml-2">Abonnements</span>
              </TabsTrigger>
              <TabsTrigger
                value="inscriptions"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 lg:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:hover:bg-transparent h-auto"
              >
                <BookOpen className="h-6 w-6 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline ml-2">Mes Inscriptions</span>
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 lg:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:hover:bg-transparent h-auto"
              >
                <Heart className="h-6 w-6 lg:h-5 lg:w-5" />
                <span className="hidden lg:inline ml-2">Favoris</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6 px-4 md:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <CreatePost profile={profile} />

                  {/* Section des posts de l'utilisateur */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Mes publications</h2>
                    {postsLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton key={i} className="h-32 w-full rounded-lg" />
                        ))}
                      </div>) : posts.length > 0 ? (
                        posts.map(post => {
                          const commonProps = {
                            id: post.id,
                            authorId: post.authorId,
                            author: post.author || "Utilisateur",
                            authorRole: post.authorRole || "Membre",
                            authorAvatar: post.authorAvatar,
                            authorUsername: post.authorUsername,
                            content: post.content,
                            media: post.media,
                            timestamp: post.timestamp,
                            likes: post.likes || 0,
                            comments: post.comments || 0,
                            shares: post.shares || 0,
                            liked: post.liked || false,
                            currentUserId: profile.id,
                            followingIds: followingIds,
                            onLikeChange: (newLiked: boolean, newLikesCount: number) => handleLikeToggle(post.id, newLiked, newLikesCount),
                          };

                          if (post.sharedPost) {
                            return <SharedPostCard
                              key={post.id}
                              {...commonProps}
                              sharedPost={post.sharedPost}
                              onLikeChange={(newLiked: boolean, newLikesCount: number) => handleLikeToggle(post.sharedPost.id, newLiked, newLikesCount)}
                            />;
                          }
                          return <PostCard key={post.id} {...commonProps} />;
                        })
                      ) : (
                      <Card className="p-8 text-center text-muted-foreground">
                        Vous n'avez pas encore créé de publication.
                      </Card>
                    )}
                  </div>
                </div>

              </div>
            </TabsContent>
            <TabsContent value="followers" className="mt-6 px-4 md:px-0">
              {followersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <FollowersList
                  profiles={followersWithStatus}
                  currentUserId={profile.id}
                  onFollowChange={handleFollowToggle}
                />
              )}
            </TabsContent>
            <TabsContent value="following" className="mt-6 px-4 md:px-0">
              {followingLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <FollowersList
                  profiles={followingWithStatus}
                  currentUserId={profile.id}
                  onFollowChange={handleFollowToggle}
                />
              )}
            </TabsContent>
            <TabsContent value="inscriptions" className="mt-6 space-y-12 px-4 md:px-0">
              {/* Événements */}
              <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Événements
                </h3>
                {registeredEventsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                ) : registeredEvents.length > 0 ? (
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
                        category={event.categories?.nom || ""}
                        participants={0} // Placeholder
                        maxParticipants={event.capacite || 0}
                        organizer={event.organisateur?.full_name || "Inconnu"}
                        image={event.image_url || "/placeholder.png"}
                        status={new Date(event.date_debut) > new Date() ? "upcoming" : "past"}
                        is_favorited={favorites.some(fav => fav.type === 'evenement' && fav.id === event.id)}
                        onToggle={(status) => handleFavoriteToggle(event.id, 'evenement', status)}
                        price={event.prix}
                        isFree={event.est_gratuit}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    Vous n'êtes inscrit à aucun événement pour le moment.
                  </Card>
                )}
              </section>

              {/* Formations */}
              <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Formations
                </h3>
                {registeredFormationsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                ) : registeredFormations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredFormations.map(formation => (
                      <CourseCard
                        key={formation.id}
                        id={formation.id}
                        title={formation.titre || ""}
                        description={formation.extrait || ""}
                        instructor={formation.professeur?.full_name || "Inconnu"}
                        category={formation.categorie?.nom || ""}
                        level={formation.niveau || ""}
                        duration={formation.duree_texte || ""}
                        students={formation.nb_avis || 0}
                        rating={formation.note_moyenne || 0}
                        price={formation.prix_indicatif ? `${formation.prix_indicatif} GNF` : "Gratuit"}
                        image={formation.image_url || "/placeholder.png"}
                        is_favorited={favorites.some(fav => fav.type === 'formation' && fav.id === formation.id)}
                        onToggle={(status) => handleFavoriteToggle(formation.id, 'formation', status)}
                        language={formation.langue_enseignement}
                        certificate={formation.certificat}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    Vous n'êtes inscrit à aucune formation pour le moment.
                  </Card>
                )}
              </section>

              {/* Clubs */}
              <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users2 className="h-5 w-5 text-primary" />
                  Clubs
                </h3>
                {registeredClubsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                ) : registeredClubs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registeredClubs.map(club => (
                      <ClubCard
                        key={club.id}
                        id={club.id}
                        name={club.nom || ""}
                        description={club.description || ""}
                        category={club.categorie?.nom || ""}
                        members={club.capacite || 0} // Using capacite as a proxy for members
                        activities="Activités non spécifiées" // Placeholder
                        president={club.leader?.full_name || "Inconnu"}
                        image={club.image_url || "/placeholder.png"}
                        verified={false} // Placeholder
                        is_favorited={favorites.some(fav => fav.type === 'club' && fav.id === club.id)}
                        onToggle={(status) => handleFavoriteToggle(club.id, 'club', status)}
                        fees={club.cotisation_mensuelle || club.cotisation_annuelle || club.prix_inscription}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    Vous n'êtes inscrit à aucun club pour le moment.
                  </Card>
                )}
              </section>
            </TabsContent>
            <TabsContent value="favorites" className="mt-6 px-4 md:px-0">
              {favoritesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <CourseCard.Skeleton key={i} />
                  ))}
                </div>
              ) : (
                <FavoritesList
                  favorites={favorites}
                  isLoading={favoritesLoading}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div >
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">

      <main className="pt-0 lg:pt-20">
        <section className="bg-gray-200 py-12 lg:py-16 animate-pulse">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-12 w-36 rounded-lg" />
                <Skeleton className="h-12 w-36 rounded-lg" />
              </div>
            </div>
          </div>
        </section>
        {/* Stats section removed */}
      </main>


    </div>
  );
}
