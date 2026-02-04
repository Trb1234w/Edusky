'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useWebPush } from '@/hooks/use-web-push'

export function NotificationPermissionRequest() {
    const { isSubscribed, subscribeUser, loading, error } = useWebPush()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Show only if supported, not subscribed, and permission is 'default' (not denied yet)
        if (
            'Notification' in window &&
            Notification.permission === 'default' &&
            !isSubscribed
        ) {
            // Small delay to not be annoying immediately
            const timer = setTimeout(() => setIsVisible(true), 3000)
            return () => clearTimeout(timer)
        }
    }, [isSubscribed])

    if (!isVisible || isSubscribed) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4">
            <Card className="shadow-lg border-primary/20">
                <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Notifications</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <CardDescription>
                        Activez les notifications pour ne rien manquer des nouvelles formations, messages et interactions.
                    </CardDescription>
                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
                        Plus tard
                    </Button>
                    <Button size="sm" onClick={subscribeUser} disabled={loading}>
                        {loading ? 'Activation...' : 'Activer'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
