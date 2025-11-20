'use client'

import React, { useState, useEffect, useMemo } from "react"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { SharedPostCard } from "@/components/shared-post-card"
import { FeedHeader } from "@/components/feed-header"
import { MobileNav } from "@/components/mobile-nav"

// Define types for props coming from the server component
interface FeedClientWrapperProps {
  initialPosts: any[]; // Replace 'any' with actual Post type
  initialSuggestedProfiles: any[]; // Replace 'any' with actual Profile type
  currentUserId: string;
  followingIds: string[];
  userProfile: { full_name: string | null; avatar_url: string | null } | null;
}

export default function FeedClientWrapper({
  initialPosts,
  initialSuggestedProfiles,
  currentUserId,
  followingIds,
  userProfile,
}: FeedClientWrapperProps) {
  const [allPosts, setAllPosts] = useState<any[]>(initialPosts);
  const [suggestedProfiles, setSuggestedProfiles] = useState<any[]>(initialSuggestedProfiles);
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    // Add other filters as needed if they were planned for the feed
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const searchMatch =
        !filters.search ||
        post.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.content?.toLowerCase().includes(filters.search.toLowerCase()); // Assuming posts have content

      // Add other client-side filter logic here if applicable
      // For now, only search filter is considered for client-side filtering from user input

      return searchMatch;
    });
  }, [filters, allPosts]);

  const renderPost = (post: any) => {
    const props = {
      ...post,
      currentUserId: currentUserId,
      followingIds: followingIds,
      authorUsername: post.authorUsername, // Assuming this is available
    };
    if (post.sharedPost) {
      return <SharedPostCard key={post.id} {...props} />;
    }
    return <PostCard key={post.id} {...props} />;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Unified Mobile Header (Title, Search, Tabs) */}
      <div className="bg-background lg:hidden border-b border-border">
        <h1 className="text-2xl font-bold px-1 pt-1 pb-1 text-primary">Social Media</h1>

        <div className="px-1 py-1 border-b">
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Rechercher un article..."
              className="pl-10 h-10 rounded-xl border-border/50"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </form>
        </div>

        {/* Mobile Tabs */}
        <Tabs defaultValue="all" className="w-full px-1 py-1">
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
        </Tabs>
      </div>

      {/* Desktop Social Media Title */}
      <h1 className="text-2xl font-bold hidden lg:block lg:px-8 lg:py-4 text-primary mb-3">Social Media</h1>

      <main className="lg:pt-20">        {/* Main Content */}
        <section className="container mx-auto px-0 lg:px-8 py-0 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <Card className="sticky top-24 border-border">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Suggestions</h3>
                  <div className="space-y-4">
                    {suggestedProfiles && suggestedProfiles.length > 0 ? (
                      suggestedProfiles.map((suggestion: any) => (
                        <div key={suggestion.id} className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
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
            <div className="lg:col-span-2 space-y-1 lg:space-y-3">
              {/* Nouveau Header du Feed */}
              <FeedHeader 
                avatarUrl={userProfile?.avatar_url || null} 
                userName={userProfile?.full_name || ''}
              />

              {/* Tabs for Desktop (original tabs, now hidden on mobile) */}
              <Tabs defaultValue="all" className="w-full hidden lg:block">
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

                {/* TabsContent should remain as it holds the actual posts */}
                <TabsContent value="all" className="space-y-1 lg:space-y-6 mt-3 bg-transparent">
                  {filteredPosts.map(renderPost)}
                </TabsContent>

                <TabsContent value="following" className="space-y-1 lg:space-y-6 mt-3 bg-transparent">
                  {filteredPosts.slice(0, 3).map(renderPost)}
                </TabsContent>

                <TabsContent value="trending" className="space-y-1 lg:space-y-6 mt-3 bg-transparent">
                  {filteredPosts
                    .filter((p) => p.likes >= 150)
                    .map(renderPost)}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  );
}