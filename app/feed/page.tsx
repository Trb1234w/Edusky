import { Search } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialHeader } from "@/components/social-header"
import { getAllFeedPosts } from "@/lib/data/posts.server" // Import de la fonction serveur
import { createClient } from "@/lib/supabase/server" // Import du client Supabase serveur
import { redirect } from "next/navigation"
import { SharedPostCard } from "@/components/shared-post-card"
import { FeedHeader } from "@/components/feed-header"
import { getSuggestedProfiles } from "@/lib/data/users.server" // Import de la nouvelle fonction

export const dynamic = 'force-dynamic'; // Forcer le rendu dynamique

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/connexion");
  }

  // Récupérer le profil de l'utilisateur pour l'avatar et le nom
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  const { data: followingData, error: followingError } = await supabase
    .from('suivis')
    .select('followed_id')
    .eq('follower_id', user.id);

  const followingIds = followingData ? followingData.map(f => f.followed_id) : [];

  const { data: posts, error } = await getAllFeedPosts(user?.id);

  // Récupérer les profils suggérés
  const { data: suggestedProfiles, error: suggestedProfilesError } = await getSuggestedProfiles(user.id, followingIds);

  if (error || profileError || followingError || suggestedProfilesError) {
    console.error("Error fetching data:", error || profileError || followingError);
    return <div className="text-center text-red-500">Erreur lors du chargement des données.</div>;
  }

  if (!posts) {
    return <div className="text-center text-muted-foreground">Aucun post trouvé.</div>;
  }
  const renderPost = (post: any) => {
    const props = {
      ...post,
      currentUserId: user.id,
      followingIds: followingIds,
      authorUsername: post.authorUsername, // Corrigé
    };
    if (post.sharedPost) {
      return <SharedPostCard key={post.id} {...props} />;
    }
    return <PostCard key={post.id} {...props} />;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <SocialHeader />
      <main className="pt-16">
        <section className="container mx-auto py-2 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <Card className="sticky top-20 border-border">
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground mb-3">Suggestions</h3>
                  <div className="space-y-3">
                    {suggestedProfiles && suggestedProfiles.length > 0 ? (
                      suggestedProfiles.map((suggestion: any) => (
                        <div key={suggestion.id} className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={suggestion.avatar_url || "/placeholder.svg"} alt={suggestion.full_name || suggestion.username} />
                            <AvatarFallback>{suggestion.full_name ? suggestion.full_name[0] : suggestion.username[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{suggestion.full_name || suggestion.username}</p>
                            <p className="text-xs text-muted-foreground truncate">{suggestion.role}</p>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            Suivre
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucune suggestion pour le moment.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2">

              {/* UNIFIED MOBILE VIEW */}
              <div className="md:hidden">
                <Tabs defaultValue="all" className="w-full">
                  <div className="bg-background border-b p-2 space-y-2">
                    <FeedHeader
                      avatarUrl={profile?.avatar_url || null}
                      userName={profile?.full_name || ''}
                    />
                    <TabsList className="grid w-full grid-cols-2 bg-background">
                      <TabsTrigger value="all">Tous</TabsTrigger>
                      <TabsTrigger value="following">Abonnements</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="all" className="mt-2 space-y-2 divide-y divide-border">
                    {posts.map(renderPost)}
                  </TabsContent>
                  <TabsContent value="following" className="mt-2 space-y-2 divide-y divide-border">
                    {posts.slice(0, 3).map(renderPost)}
                  </TabsContent>
                </Tabs>
              </div>

              <div className="hidden md:block space-y-4">
                <FeedHeader
                  avatarUrl={profile?.avatar_url || null}
                  userName={profile?.full_name || ''}
                />
                <Tabs defaultValue="all" className="w-full">
                  <div className="space-y-2">
                    <TabsList className="w-full">
                      <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
                      <TabsTrigger value="following" className="flex-1">Abonnements</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="all" className="space-y-4 mt-4 divide-y divide-border">
                    {posts.map(renderPost)}
                  </TabsContent>
                  <TabsContent value="following" className="space-y-4 mt-4 divide-y divide-border">
                    {posts.slice(0, 3).map(renderPost)}
                  </TabsContent>
                </Tabs>
              </div>

            </div>
          </div>
        </section>
      </main>


      <MobileNav />
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="pt-2 lg:pt-20 container mx-auto px-0 lg:px-8 py-0 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="hidden lg:block">
            <Card className="sticky top-24 border-border">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-1 lg:space-y-6">
            <Card className="border-border hidden lg:block">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-24 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Skeleton className="h-10 w-full" />
            <div className="space-y-1 lg:space-y-6 mt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
