import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileFeedHeader } from "@/components/mobile-feed-header"
import { getAllFeedPosts } from "@/lib/data/posts.server" // Import de la fonction serveur
import { createClient } from "@/lib/supabase/server" // Import du client Supabase serveur
import { redirect } from "next/navigation"
import { SharedPostCard } from "@/components/shared-post-card"
import { FeedHeader } from "@/components/feed-header"

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

  if (error || profileError || followingError) {
    console.error("Error fetching data:", error || profileError || followingError);
    return <div className="text-center text-red-500">Erreur lors du chargement des données.</div>;
  }

  if (!posts) {
    return <div className="text-center text-muted-foreground">Aucun post trouvé.</div>;
  }

  const suggestions = [
    {
      name: "Club Robotique",
      role: "30 membres",
      avatar: "/robotics-club.jpg",
    },
    {
      name: "Mariama Sylla",
      role: "Entrepreneure",
      avatar: "/african-female-professor.jpg",
    },
    {
      name: "Alpha Condé",
      role: "Musicien",
      avatar: "/african-male-professor.png",
    },
  ];

  const renderPost = (post: any) => {
    const props = {
      ...post,
      currentUserId: user.id,
      followingIds: followingIds,
    };
    if (post.sharedPost) {
      return <SharedPostCard key={post.id} {...props} />;
    }
    return <PostCard key={post.id} {...props} />;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="hidden lg:block">
        <Header />
      </div>
      <MobileFeedHeader /> {/* Render custom mobile header */}

      <main className="pt-2 lg:pt-20">        {/* Main Content */}
        <section className="container mx-auto px-0 lg:px-8 py-0 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <Card className="sticky top-24 border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Suggestions</h3>
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={suggestion.avatar || "/placeholder.svg"} alt={suggestion.name} />
                          <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{suggestion.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{suggestion.role}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          Suivre
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-1 lg:space-y-6">
              {/* Nouveau Header du Feed */}
              <FeedHeader 
                avatarUrl={profile?.avatar_url || null} 
                userName={profile?.full_name || ''}
              />

              {/* Tabs for Feed */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    Tous
                  </TabsTrigger>
                  <TabsTrigger value="following" className="flex-1">
                    Abonnements
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="flex-1">
                    Tendances
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-1 lg:space-y-6 mt-6 bg-transparent">
                  {posts.map(renderPost)}
                </TabsContent>

                <TabsContent value="following" className="space-y-1 lg:space-y-6 mt-6 bg-transparent">
                  {posts.slice(0, 3).map(renderPost)}
                </TabsContent>

                <TabsContent value="trending" className="space-y-1 lg:space-y-6 mt-6 bg-transparent">
                  {posts
                    .filter((p) => p.likes >= 150)
                    .map(renderPost)}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
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
