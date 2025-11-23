"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notifications"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface Notification {
    id: string
    user_id: string
    type: 'like' | 'comment' | 'share' | 'follow' | 'message'
    contenu: string
    ref_id?: string
    ref_table?: string
    metadata?: any
    lu: boolean
    created_at: string
}

export function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setLoading(true)
            const { data, error } = await getNotifications(user.id)
            if (data) {
                setNotifications(data as Notification[])
                setUnreadCount(data.filter((n: any) => !n.lu).length)
            }
            setLoading(false)

            // Subscribe to realtime changes
            const channel = supabase
                .channel('realtime-notifications')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('New notification received:', payload)
                        const newNotification = payload.new as Notification
                        setNotifications((prev) => [newNotification, ...prev])
                        setUnreadCount((prev) => prev + 1)
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }

        fetchNotifications()
    }, [supabase])

    const handleMarkAsRead = async (id: string) => {
        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, lu: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))

        await markAsRead(id)
    }

    const handleMarkAllAsRead = async () => {
        // Optimistic update
        setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })))
        setUnreadCount(0)

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await markAllAsRead(user.id)
        }
    }

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.lu) {
            await handleMarkAsRead(notification.id)
        }
        setIsOpen(false)

        // Navigation logic based on type
        if (notification.type === 'message') {
            router.push(`/messages?conversation=${notification.ref_id}`)
        } else if (notification.type === 'follow') {
            router.push(`/profile/${notification.ref_id}`) // Assuming ref_id is user_id for follow
            // Note: In my implementation ref_id was follower_id. 
            // Ideally we should navigate to the follower's profile.
            // Let's check metadata if available or fetch user.
            // For now, let's assume ref_id points to the relevant resource.
            // Actually ref_id for follow is follower_id.
            // We need to fetch username to navigate to /profile/username.
            // Or just navigate to /profile/id if supported (it's not usually).
            // Let's rely on metadata if I put username there? I didn't.
            // I'll just redirect to /feed for now or try to resolve.
            // Wait, I can't easily resolve username here without fetching.
            // Let's just go to /feed for now or maybe I should have stored username in metadata.
            // Update: I'll just go to /feed for follow for now, or improve metadata later.
            router.push('/feed')
        } else if (['like', 'comment', 'share'].includes(notification.type)) {
            // Navigate to the post
            // Assuming we have a single post page or anchor
            // If ref_table is 'postes', ref_id is post_id
            // Maybe /feed?postId=... or just /feed
            router.push(`/feed`)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-muted-foreground hover:text-primary"
                            onClick={handleMarkAllAsRead}
                        >
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Chargement...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Aucune notification</div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 items-start",
                                        !notification.lu && "bg-muted/20"
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className={cn(
                                        "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                                        !notification.lu ? "bg-primary" : "bg-transparent"
                                    )} />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm leading-none">{notification.contenu}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
