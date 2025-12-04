import { getAllFeedPosts } from "@/lib/data/posts.server"
import { PostCard } from "@/components/post-card"
import { SharedPostCard } from "@/components/shared-post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedHeader } from "@/components/feed-header"

interface FeedContentProps {
    userId: string
    followingIds: string[]
    profile: any
}

export async function FeedContent({ userId, followingIds, profile }: FeedContentProps) {
    // Cette fonction charge les posts (lent) - Suspense affichera le skeleton pendant ce temps
    const { data: posts, error } = await getAllFeedPosts(userId, 10)

    if (error) {
        return <div className="text-center text-red-500">Erreur lors du chargement des posts.</div>
    }

    if (!posts || posts.length === 0) {
        return <div className="text-center text-muted-foreground">Aucun post trouvé.</div>
    }

    const renderPost = (post: any) => {
        const props = {
            ...post,
            currentUserId: userId,
            followingIds: followingIds,
            authorUsername: post.authorUsername,
        }
        if (post.sharedPost) {
            return <SharedPostCard key={post.id} {...props} />
        }
        return <PostCard key={post.id} {...props} />
    }

    return (
        <>
            {/* UNIFIED MOBILE VIEW */}
            <div className="md:hidden">
                <Tabs defaultValue="all" className="w-full">
                    <div className="bg-background border-b pt-20 space-y-2">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/60 p-1.5 rounded-full">
                            <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-full">Tous</TabsTrigger>
                            <TabsTrigger value="following" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-full">Abonnements</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="all" className="mt-2 space-y-2 divide-y divide-border">
                        {posts.map(renderPost)}
                    </TabsContent>
                    <TabsContent value="following" className="mt-2 space-y-2 divide-y divide-border">
                        {posts.filter((post: any) => followingIds.includes(post.authorId)).map(renderPost)}
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
                        <TabsList className="grid w-full grid-cols-2 bg-muted/60 p-1.5 rounded-full">
                            <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-full">Tous</TabsTrigger>
                            <TabsTrigger value="following" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-full">Abonnements</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="all" className="space-y-4 mt-4 divide-y divide-border">
                        {posts.map(renderPost)}
                    </TabsContent>
                    <TabsContent value="following" className="space-y-4 mt-4 divide-y divide-border">
                        {posts.filter((post: any) => followingIds.includes(post.authorId)).map(renderPost)}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
