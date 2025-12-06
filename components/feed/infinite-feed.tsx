'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { PostCard } from '@/components/post-card'
import { SharedPostCard } from '@/components/shared-post-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface InfiniteFeedProps {
    initialPosts: any[]
    currentUserId: string
    followingIds: string[]
}

export function InfiniteFeed({ initialPosts, currentUserId, followingIds }: InfiniteFeedProps) {
    const [posts, setPosts] = useState(initialPosts)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialPosts.length >= 10)
    const observerTarget = useRef<HTMLDivElement>(null)

    const loadMorePosts = useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        const lastPost = posts[posts.length - 1]
        const cursor = lastPost?.timestamp

        console.log('Loading more posts...', { lastPostId: lastPost?.id, cursor })

        if (!cursor) {
            console.warn('No cursor found, stopping infinite scroll')
            setHasMore(false)
            setIsLoading(false)
            return
        }

        try {
            const url = `/api/feed/posts?cursor=${encodeURIComponent(cursor)}&limit=10&userId=${currentUserId}`
            console.log('Fetching URL:', url)
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const { data: newPosts, error } = await response.json()

            if (error) {
                console.error('API Error:', error)
                return
            }

            console.log('New posts received:', newPosts?.length)

            if (newPosts && newPosts.length > 0) {
                // Filter out duplicates just in case
                setPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const uniqueNewPosts = newPosts.filter((p: any) => !existingIds.has(p.id))
                    if (uniqueNewPosts.length === 0) {
                        console.log('All received posts are duplicates')
                        setHasMore(false)
                        return prev
                    }
                    return [...prev, ...uniqueNewPosts]
                })
                setHasMore(newPosts.length >= 10)
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Error loading more posts:', error)
        } finally {
            setIsLoading(false)
        }
    }, [posts, isLoading, hasMore, currentUserId])

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMorePosts()
                }
            },
            { threshold: 0.1 }
        )

        const currentTarget = observerTarget.current
        if (currentTarget) {
            observer.observe(currentTarget)
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget)
            }
        }
    }, [loadMorePosts, hasMore, isLoading])

    const renderPost = (post: any) => {
        const props = {
            ...post,
            currentUserId,
            followingIds,
            authorUsername: post.authorUsername,
        }
        if (post.sharedPost) {
            return <SharedPostCard key={post.id} {...props} />
        }
        return <PostCard key={post.id} {...props} />
    }

    return (
        <>
            <div className="space-y-4 divide-y divide-border">
                {posts.map(renderPost)}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="py-4">
                {isLoading && (
                    <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <Card key={i} className="p-6">
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
                )}
                {!hasMore && posts.length > 0 && (
                    <p className="text-center text-muted-foreground py-8">
                        Vous avez tout vu ! 🎉
                    </p>
                )}
            </div>

            {/* Debug Manual Load Button */}
            {hasMore && !isLoading && (
                <div className="flex justify-center pb-8">
                    <Button variant="outline" onClick={loadMorePosts}>
                        Charger plus de posts (Debug)
                    </Button>
                </div>
            )}
        </>
    )
}
