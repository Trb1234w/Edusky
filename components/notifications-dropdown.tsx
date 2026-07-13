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
import { toast } from "sonner"

// Update interface to match DB exactly
interface Notification {
    id: string
    user_id: string
    type: string
    contenu: string
    ref_id?: string
    ref_table?: string
    url?: string
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
                setNotifications(data as any[])
                // Use 'lu' for unread count
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
                        const newNotification = payload.new as any

                        // Add to list
                        setNotifications((prev) => [newNotification, ...prev])
                        setUnreadCount((prev) => prev + 1)

                        // Show Toast - Use 'contenu' directly
                        toast.info(newNotification.contenu, {
                            action: newNotification.url ? {
                                label: 'Voir',
                                onClick: () => router.push(newNotification.url)
                            } : undefined,
                            duration: 5000,
                        })

                        // Trigger Browser System Notification (OS Level) if permitted
                        if ("Notification" in window && Notification.permission === "granted") {
                            new Notification("Edusky", {
                                body: newNotification.contenu,
                                icon: "/icons/icon-192x192.png", // Ensure this path exists or use a default
                                tag: newNotification.id // prevents duplicate notifications
                            });
                        }
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }

        fetchNotifications()
    }, [supabase, router])

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

        if (notification.url) {
            router.push(notification.url)
        } else {
            // Fallback legacy navigation logic
            if (notification.type === 'message') {
                router.push(`/messages?conversation=${notification.ref_id}`)
            } else if (notification.type === 'follow') {
                router.push(`/profile/${notification.ref_id}`)
            } else {
                // Default to feed or dashboard
                router.push('/dashboard')
            }
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary shadow-sm transition-all hover:scale-105 active:scale-95">
                    <Bell className="h-[22px] w-[22px]" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-background animate-pulse" />
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
                            {notifications.map((notification) => {
                                // Strictly use 'lu' and 'contenu'
                                const isRead = notification.lu;
                                const content = notification.contenu;
                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 items-start",
                                            !isRead && "bg-blue-50/50 dark:bg-blue-900/10"
                                        )}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className={cn(
                                            "w-2 h-2 mt-2 rounded-full flex-shrink-0",
                                            !isRead ? "bg-primary" : "bg-transparent"
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm leading-snug">{content}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
