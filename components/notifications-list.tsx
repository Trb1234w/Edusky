"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notifications"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

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

export function NotificationsList() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
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
            }
            setLoading(false)

            // Subscribe to realtime changes
            const channel = supabase
                .channel('realtime-notifications-tab')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        const newNotification = payload.new as any
                        setNotifications((prev) => [newNotification, ...prev])
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }

        fetchNotifications()
    }, [supabase])

    const handleMarkAsRead = async (id: string, url?: string) => {
        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, lu: true } : n))
        )
        
        await markAsRead(id)
        
        if (url) {
            router.push(url)
        }
    }

    const handleMarkAllAsRead = async () => {
        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, lu: true }))
        )
        
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await markAllAsRead(user.id)
            toast.success("Toutes les notifications ont été marquées comme lues")
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border rounded-xl">
                        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className="space-y-2 flex-grow">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-border/50">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-lg font-medium">Aucune notification</p>
                <p className="text-sm">Vous n'avez pas de nouvelles notifications pour le moment.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <p className="text-sm text-muted-foreground">
                    {notifications.filter(n => !n.lu).length} notification(s) non lue(s)
                </p>
                {notifications.some(n => !n.lu) && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleMarkAllAsRead}
                        className="text-xs"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
                            notification.lu 
                                ? "bg-background border-border" 
                                : "bg-primary/5 border-primary/20 shadow-sm"
                        )}
                    >
                        <div className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1",
                            notification.lu ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                        )}>
                            <Bell className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-grow space-y-1">
                            <p className={cn(
                                "text-sm",
                                notification.lu ? "text-foreground/80" : "text-foreground font-medium"
                            )}>
                                {notification.contenu}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                            {!notification.lu && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    title="Marquer comme lu"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            )}
                            {notification.url && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:bg-muted"
                                    onClick={() => handleMarkAsRead(notification.id, notification.url)}
                                    title="Voir"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
