'use client'

import { useState, useEffect } from 'react';
import { saveSubscription } from '@/app/actions/push-subscriptions';

// VAPID Public Key from env
const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function useWebPush() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if supported
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                    return registration.pushManager.getSubscription();
                })
                .then(subscription => {
                    setIsSubscribed(!!subscription);
                })
                .catch(err => console.error('SW registration error:', err));
        }
    }, []);

    const subscribeUser = async () => {
        if (!PUBLIC_KEY) {
            console.error('VAPID Public Key key is missing');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
            });

            console.log('User is subscribed:', subscription);

            const result = await saveSubscription(subscription);
            if (result.error) {
                throw new Error(result.error);
            }

            setIsSubscribed(true);
        } catch (err: any) {
            console.error('Failed to subscribe the user: ', err);
            setError(err.message || 'Failed to subscribe');
        } finally {
            setLoading(false);
        }
    };

    return { isSubscribed, subscribeUser, loading, error };
}
