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
            if (!PUBLIC_KEY) throw new Error("VAPID Key is empty");
            console.log("Subscribing with key:", PUBLIC_KEY.substring(0, 10) + "...");

            const convertedKey = urlBase64ToUint8Array(PUBLIC_KEY);
            console.log("VAPID Key Length (bytes):", convertedKey.length);

            if (convertedKey.length !== 65) {
                console.error("CRITICAL: VAPID Public Key must be exactly 65 bytes. Current:", convertedKey.length);
                throw new Error(`VAPID Public Key is invalid (Length: ${convertedKey.length} bytes). Expected 65.`);
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
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
