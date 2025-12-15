'use client'

import { useState, useMemo } from "react";
import { PostCard } from "@/components/post-card";
import { SharedPostCard } from "@/components/shared-post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FollowersList } from "@/components/FollowersList";
import { Grid3x3, UserPlus, Users } from "lucide-react";

interface ProfileContentProps {
    posts: any[];
    followers: any[];
    following: any[];
    currentUserId: string;
    currentUserFollowingIds: string[];
}

export function ProfileContent({
    posts: initialPosts,
    followers: initialFollowers,
    following: initialFollowing,
    currentUserId,
    currentUserFollowingIds: initialFollowingIds,
}: ProfileContentProps) {
    const [posts, setPosts] = useState(initialPosts);
    const [following, setFollowing] = useState(initialFollowing);
    const [followers, setFollowers] = useState(initialFollowers);

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
        if (isFollowing) {
            // User is now following - add to following list
            const userInFollowers = followers.find(f => f.id === userId);
            if (userInFollowers && !following.some(f => f.id === userId)) {
                setFollowing(prev => [...prev, userInFollowers]);
            }
        } else {
            // User is unfollowing - remove from following list
            setFollowing(prev => prev.filter(f => f.id !== userId));
        }
    };

    // Calculate followingIds from following state (like dashboard)
    const followingIds = useMemo(() => following.map((f: any) => f.id), [following]);

    const followersWithStatus = useMemo(() => followers.map(f => ({
        ...f,
        isFollowing: following.some((followed: any) => followed.id === f.id)
    })), [followers, following]);

    const followingWithStatus = useMemo(() => following.map(f => ({
        ...f,
        isFollowing: true
    })), [following]);

    const renderPost = (post: any) => {
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
            currentUserId: currentUserId,
            followingIds: initialFollowingIds,
            onLikeChange: (newLiked: boolean, newLikesCount: number) => handleLikeToggle(post.id, newLiked, newLikesCount),
        };

        if (post.sharedPost) {
            return (
                <SharedPostCard
                    key={post.id}
                    {...commonProps}
                    sharedPost={post.sharedPost}
                    onLikeChange={(newLiked: boolean, newLikesCount: number) => handleLikeToggle(post.sharedPost.id, newLiked, newLikesCount)}
                />
            );
        }
        return <PostCard key={post.id} {...commonProps} />;
    };

    return (
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
            <TabsContent value="posts" className="mt-2 md:mt-4 px-0 md:px-0">
                <div className="space-y-4 w-full">
                    {posts && posts.length > 0 ? (
                        posts.map(renderPost)
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Cet utilisateur n'a encore rien publié.</p>
                        </div>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="abonnements" className="mt-2 md:mt-4">
                {followingWithStatus && followingWithStatus.length > 0 ? (
                    <FollowersList
                        profiles={followingWithStatus}
                        currentUserId={currentUserId}
                        onFollowChange={handleFollowToggle}
                    />
                ) : (
                    <Card className="p-8 text-center text-muted-foreground">
                        Cet utilisateur ne suit personne.
                    </Card>
                )}
            </TabsContent>
            <TabsContent value="abonnes" className="mt-2 md:mt-4">
                {followersWithStatus && followersWithStatus.length > 0 ? (
                    <FollowersList
                        profiles={followersWithStatus}
                        currentUserId={currentUserId}
                        onFollowChange={handleFollowToggle}
                    />
                ) : (
                    <Card className="p-8 text-center text-muted-foreground">
                        Cet utilisateur n'a aucun abonné.
                    </Card>
                )}
            </TabsContent>
        </Tabs>
    );
}
