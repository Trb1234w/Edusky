'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Eye, Bookmark, Share2 } from "lucide-react"
import { toggleArticleLike } from "@/app/blog/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ArticleInteractionsProps {
    articleId: string
    initialLikesCount: number
    initialCommentsCount: number
    initialViews: number
    initialUserLiked: boolean
}

export function ArticleInteractions({
    articleId,
    initialLikesCount,
    initialCommentsCount,
    initialViews,
    initialUserLiked
}: ArticleInteractionsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [liked, setLiked] = useState(initialUserLiked)
    const [likesCount, setLikesCount] = useState(initialLikesCount)

    const handleLike = async () => {
        // Optimistic update
        const previousLiked = liked
        const previousCount = likesCount

        setLiked(!liked)
        setLikesCount(liked ? likesCount - 1 : likesCount + 1)

        startTransition(async () => {
            const result = await toggleArticleLike(articleId)

            if (!result.success) {
                // Revert on error
                setLiked(previousLiked)
                setLikesCount(previousCount)

                if (result.error === 'User not authenticated') {
                    toast.error('Vous devez être connecté pour liker un article')
                    router.push('/login')
                } else {
                    toast.error('Erreur lors du like')
                }
            } else {
                toast.success(result.liked ? 'Article liké !' : 'Like retiré')
            }
        })
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col items-center gap-4 absolute top-1/2 -translate-y-1/2 left-8 xl:left-16 z-10">
                <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80 transition-all ${liked ? 'text-red-500 bg-red-50 hover:bg-red-100' : ''
                        }`}
                    onClick={handleLike}
                    disabled={isPending}
                >
                    <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                </Button>
                <div className="text-xs text-muted-foreground">{likesCount}</div>

                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80"
                >
                    <MessageSquare className="h-5 w-5" />
                </Button>
                <div className="text-xs text-muted-foreground">{initialCommentsCount}</div>

                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80"
                >
                    <Eye className="h-5 w-5" />
                </Button>
                <div className="text-xs text-muted-foreground">{initialViews}</div>

                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80"
                >
                    <Bookmark className="h-5 w-5" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80"
                >
                    <Share2 className="h-5 w-5" />
                </Button>
            </aside>

            {/* Mobile Sticky Bar - 5 boutons */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-2 bg-background/90 backdrop-blur-sm border-t z-40">
                <div className="flex items-center justify-around">
                    <Button
                        variant="ghost"
                        className={`flex flex-col h-auto p-2 gap-1 rounded-lg transition-all ${liked ? 'text-red-500' : 'text-muted-foreground'
                            }`}
                        onClick={handleLike}
                        disabled={isPending}
                    >
                        <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                        <span className="text-xs">{likesCount}</span>
                    </Button>

                    <Button variant="ghost" className="flex flex-col h-auto p-2 gap-1 text-muted-foreground rounded-lg">
                        <MessageSquare className="h-5 w-5" />
                        <span className="text-xs">{initialCommentsCount}</span>
                    </Button>

                    <Button variant="ghost" className="flex flex-col h-auto p-2 gap-1 text-muted-foreground rounded-lg">
                        <Eye className="h-5 w-5" />
                        <span className="text-xs">{initialViews}</span>
                    </Button>

                    <Button variant="ghost" className="flex flex-col h-auto p-2 gap-1 text-muted-foreground rounded-lg">
                        <Bookmark className="h-5 w-5" />
                        <span className="text-xs">Sauver</span>
                    </Button>

                    <Button variant="ghost" className="flex flex-col h-auto p-2 gap-1 text-muted-foreground rounded-lg">
                        <Share2 className="h-5 w-5" />
                        <span className="text-xs">Partager</span>
                    </Button>
                </div>
            </div>
        </>
    )
}
