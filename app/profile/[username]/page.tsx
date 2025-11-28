import { createClient } from "@/lib/supabase/server";
import { getUserProfileByUsername } from "@/lib/data/users.server";
import { getPostsByAuthorId } from "@/lib/data/posts.server";
import { getFollowers, getFollowing } from "@/lib/data/suivis.server";
import { notFound, redirect } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SharedPostCard } from "@/components/shared-post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile-header";
import { Card } from "@/components/ui/card";
import { FollowersList } from "@/components/FollowersList";
import { Grid3x3, UserPlus, Users } from "lucide-react";

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

  // Récupérer les abonnements de l'utilisateur connecté pour déterminer le statut "isFollowing"
  let currentUserFollowingIds = new Set<string>();
  if (currentUser) {
    const { data: myFollowing, error: myFollowingError } = await getFollowing(currentUser.id);
    if (!myFollowingError && myFollowing) {
      myFollowing.forEach((p: any) => currentUserFollowingIds.add(p.id));
    }
  }

  // Mapper les profils pour ajouter isFollowing
  const followersWithStatus = followers?.map((p: any) => ({
    ...p,
    isFollowing: currentUserFollowingIds.has(p.id)
  })) || [];

  const followingWithStatus = following?.map((p: any) => ({
    ...p,
    isFollowing: currentUserFollowingIds.has(p.id)
  })) || [];

  const renderPost = (post: any) => {
    const props = {
      ...post,
      currentUserId: currentUser?.id,
      followingIds: Array.from(currentUserFollowingIds), // Use the Set converted to Array
      authorUsername: post.authorUsername,
    };
    if (post.sharedPost) {
      return <SharedPostCard key={post.id} {...props} />;
    }
    return <PostCard key={post.id} {...props} />;
  };

  const profileWithPostsCount = {
    ...profile,
    postsCount: posts?.length || 0,
    isFollowing: currentUser ? currentUserFollowingIds.has(profile.id) : false, // Ensure profile header gets correct status too
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container mx-auto px-0 md:px-4 py-8 pt-2 lg:pt-24">
        {/* Section de l'en-tête du profil gérée par le composant client */}
        <ProfileHeader profile={profileWithPostsCount} currentUserId={currentUser?.id || ''} />

        {/* Section des contenus du profil */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="flex w-full overflow-x-auto whitespace-nowrap justify-start gap-1 lg:gap-2 pb-2 border-b-2 border-gray-200 dark:border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabsTrigger
              value="posts"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 lg:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:hover:bg-transparent h-auto"
            >
              <Grid3x3 className="h-6 w-6 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline ml-2">Publications</span>
            </TabsTrigger>
            <TabsTrigger
              value="abonnements"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 lg:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:hover:bg-transparent h-auto"
            >
              <UserPlus className="h-6 w-6 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline ml-2">Abonnements</span>
            </TabsTrigger>
            <TabsTrigger
              value="abonnes"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none px-2 lg:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:hover:bg-transparent h-auto"
            >
              <Users className="h-6 w-6 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline ml-2">Abonnés</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-2 md:mt-6">
            <div className="space-y-4 w-full"> {/* Full width on all screens, no centering */}
              {posts && posts.length > 0 ? (
                posts.map(renderPost)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Cet utilisateur n'a encore rien publié.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="abonnements" className="mt-2 md:mt-6">
            {followingError ? (
              <Card className="p-8 text-center text-destructive-foreground bg-destructive/10 border-destructive">
                Erreur lors du chargement des abonnements.
              </Card>
            ) : followingWithStatus && followingWithStatus.length > 0 ? (
              <FollowersList profiles={followingWithStatus} currentUserId={currentUser?.id || ''} />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Cet utilisateur ne suit personne.
              </Card>
            )}
          </TabsContent>
          <TabsContent value="abonnes" className="mt-2 md:mt-6">
            {followersError ? (
              <Card className="p-8 text-center text-destructive-foreground bg-destructive/10 border-destructive">
                Erreur lors du chargement des abonnés.
              </Card>
            ) : followersWithStatus && followersWithStatus.length > 0 ? (
              <FollowersList profiles={followersWithStatus} currentUserId={currentUser?.id || ''} />
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                Cet utilisateur n'a aucun abonné.
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}