import webPush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configuration VAPID (doit être fait une seule fois)
if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.error("VAPID Keys are missing in env");
} else {
    try {
        webPush.setVapidDetails(
            `mailto:${(process.env.VAPID_SUBJECT || 'test@example.com').trim()}`,
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY.trim(),
            process.env.VAPID_PRIVATE_KEY.trim().replace(/\\n/g, '\n')
        );
    } catch (err) {
        console.error("Error setting VAPID details", err);
    }
}

// Client Admin pour lire les souscriptions (contourner RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
);

interface SendPushParams {
    userId: string;
    title: string;
    body: string;
    url?: string;
}

export async function sendPushNotification({ userId, title, body, url }: SendPushParams) {
    console.log(`[Push] Attempting to send push to user ${userId}`);

    // 1. Récupérer les souscriptions de l'utilisateur
    const { data: subscriptions, error } = await supabaseAdmin
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId);

    if (error || !subscriptions || subscriptions.length === 0) {
        console.log(`[Push] No subscriptions found for user ${userId}`);
        return { success: false, error: 'No subscriptions' };
    }

    // 2. Préparer le payload
    const payload = JSON.stringify({
        title: title,
        body: body,
        url: url || '/',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
    });

    // 3. Envoyer à toutes les souscriptions
    const sendPromises = subscriptions.map(async (sub) => {
        const pushConfig = {
            endpoint: sub.endpoint,
            keys: { auth: sub.auth, p256dh: sub.p256dh }
        };

        try {
            await webPush.sendNotification(pushConfig, payload);
            console.log(`[Push] Sent to ${sub.endpoint.slice(0, 20)}...`);
            return { success: true };
        } catch (err: any) {
            console.error(`[Push] Error sending to ${sub.endpoint.slice(0, 20)}...`, err.statusCode);

            if (err.statusCode === 410 || err.statusCode === 404) {
                // Subscription invalide/expirée -> Nettoyage
                console.log('[Push] Removing expired subscription');
                await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
            }
            return { success: false, error: err };
        }
    });

    await Promise.all(sendPromises);
    return { success: true, count: subscriptions.length };
}
