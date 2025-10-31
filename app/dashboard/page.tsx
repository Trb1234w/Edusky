'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CreatePost } from "@/components/CreatePost";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
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
} from "lucide-react";

import { getPostsByAuthor } from "@/lib/data/posts";
import { PostCard } from "@/components/PostCard";
import { getFollowers, getFollowing } from "@/lib/data/suivis.server";
import { FollowersList } from "@/components/FollowersList";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [followersLoading, setFollowersLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
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

      // Une fois le profil chargé, on charge les posts
      const { data: postsData, error: postsError } = await getPostsByAuthor(profileData.id);
      if (!postsError && postsData) {
        setPosts(postsData);
      }
      setPostsLoading(false);

      // Charger les followers
      const { data: followersData, error: followersError } = await getFollowers(profileData.id);
      if (!followersError && followersData) {
        setFollowers(followersData);
      }
      setFollowersLoading(false);

      // Charger les abonnements
      const { data: followingData, error: followingError } = await getFollowing(profileData.id);
      if (!followingError && followingData) {
        setFollowing(followingData);
      }
      setFollowingLoading(false);
    };

    fetchUserAndProfile();
  }, [router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!profile) {
    return null; // Should be redirected
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="pt-16 lg:pt-20">
        <section className="bg-gradient-to-br from-primary via-accent to-secondary py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
                  <AvatarFallback>{(profile.prenom?.charAt(0) || '') + (profile.nom?.charAt(0) || '')}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Bienvenue, {profile.prenom || profile.full_name}!</h1>
                  <p className="text-white/90">Continuez votre parcours d'apprentissage</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="lg" className="font-semibold">
                  <Bell size={20} className="mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <Settings size={20} className="mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-12">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="posts">Publications</TabsTrigger>
              <TabsTrigger value="followers">Abonnés</TabsTrigger>
              <TabsTrigger value="following">Abonnements</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="formations">Formations</TabsTrigger>
              <TabsTrigger value="clubs">Clubs</TabsTrigger>
              <TabsTrigger value="favorites">Favoris</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <CreatePost profile={profile} />

                  {/* Section des posts de l'utilisateur */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Mes publications</h2>
                    {postsLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                      </div>
                    ) : posts.length > 0 ? (
                      posts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                      <Card className="p-8 text-center text-muted-foreground">
                        Vous n'avez pas encore créé de publication.
                      </Card>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar size={20} className="text-accent" />
                        Événements à venir
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center py-8">Aucun événement à venir.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="followers" className="mt-6">
              {followersLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ) : (
                <FollowersList profiles={followers} currentUserId={profile.id} />
              )}
            </TabsContent>
            <TabsContent value="following" className="mt-6">
              {followingLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ) : (
                <FollowersList profiles={following} currentUserId={profile.id} />
              )}
            </TabsContent>
            <TabsContent value="events">Contenu des événements</TabsContent>
            <TabsContent value="formations">Contenu des formations</TabsContent>
            <TabsContent value="clubs">Contenu des clubs</TabsContent>
            <TabsContent value="favorites">Contenu des favoris</TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="pt-16 lg:pt-20">
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
      <Footer />
      <MobileNav />
    </div>
  );
}
