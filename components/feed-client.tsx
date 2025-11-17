'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SharedPostCard } from "@/components/shared-post-card"
import { FeedHeader } from "@/components/feed-header"
import { Skeleton } from '@/components/ui/skeleton'

// Un squelette de chargement dédié pour le feed
function FeedContentSkeleton() {
  return (
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
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-1 lg:space-y-6 mt-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-24 w-full mb-4" />
          </Card>
        ))}
      </div>
    </div>
  );
}


export function FeedClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect("/auth/connexion");
        return;
      }

      try {
        // Exécuter toutes les requêtes de données en parallèle
        const [
          profileResult,
          followingResult,
          postsResponse // Changed from postsResult
        ] = await Promise.all([
          supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single(),
          supabase.from('suivis').select('followed_id').eq('follower_id', user.id),
          fetch('/api/feed') // Fetch from the new API route
        ]);

        if (profileResult.error || followingResult.error || !postsResponse.ok) {
          // Log specific errors
          if(profileResult.error) console.error("Profile fetch error:", profileResult.error);
          if(followingResult.error) console.error("Following fetch error:", followingResult.error);
          if(!postsResponse.ok) console.error("API response not OK:", postsResponse.statusText);
          
          throw new Error('Erreur lors de la récupération des données.');
        }

        const postsData = await postsResponse.json(); // Parse JSON from the response
        const followingIds = followingResult.data ? followingResult.data.map(f => f.followed_id) : [];

        setData({
          user,
          profile: profileResult.data,
          followingIds,
          posts: postsData || [],
        });

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) {
    return <FeedContentSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data || !data.posts) {
    return <div className="text-center text-muted-foreground">Aucun post trouvé.</div>;
  }

  const { user, profile, followingIds, posts } = data;

  const renderPost = (post: any) => {
    const props = {
      ...post,
      currentUserId: user.id,
      followingIds: followingIds,
      authorUsername: post.authorUsername,
    };
    if (post.sharedPost) {
      return <SharedPostCard key={post.id} {...props} />;
    }
    return <PostCard key={post.id} {...props} />;
  };

  return (
    <div className="lg:col-span-2 space-y-1 lg:space-y-6">
      <FeedHeader 
        avatarUrl={profile?.avatar_url || null} 
        userName={profile?.full_name || ''}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
          <TabsTrigger value="following" className="flex-1">Abonnements</TabsTrigger>
          <TabsTrigger value="trending" className="flex-1">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-1 lg:space-y-6 mt-6 bg-transparent">
          {posts.map(renderPost)}
        </TabsContent>
        <TabsContent value="following" className="space-y-1 lg:space-y-6 mt-6 bg-transparent">
          {posts.slice(0, 3).map(renderPost)}
        </TabsContent>
        <TabsContent value="trending" className="space-y-1 lg:space-y-6 mt-6 bg-transparent">
          {posts.filter((p: any) => p.likes >= 150).map(renderPost)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
