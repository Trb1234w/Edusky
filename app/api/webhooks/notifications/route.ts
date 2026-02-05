import { createClient } from '@supabase/supabase-js';
import webPush from 'web-push';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
    try {
        // Initialisation web-push (déplacée ici pour éviter les erreurs au build)
        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        const privateKey = process.env.VAPID_PRIVATE_KEY;
        const subject = process.env.VAPID_SUBJECT || 'mailto:admin@edusky.com';

        if (publicKey && privateKey) {
            webPush.setVapidDetails(subject, publicKey, privateKey);
        } else {
            console.warn('VAPID keys not found, skipping webPush initialization');
        }

        const body = await req.json();

        // Structure du payload Webhook Supabase
        // type: 'INSERT', table: 'notifications', record: { ... }
        const { record, type } = body;

        if (type !== 'INSERT') {
            return NextResponse.json({ message: 'Not an insert event' }, { status: 200 });
        }

        const notification = record;
        const userId = notification.user_id;

        if (!userId) {
            return NextResponse.json({ message: 'No user_id in notification' }, { status: 200 });
        }

        // 1. Récupérer les abonnements push de cet utilisateur via Supabase Admin (Bypass RLS)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: subscriptions, error } = await supabaseAdmin
            .from('push_subscriptions')
            .select('*')
            .eq('user_id', userId);

        if (error || !subscriptions || subscriptions.length === 0) {
            console.log('No subscriptions found for user', userId);
            return NextResponse.json({ message: 'No subscriptions found' });
        }

        // 2. Envoyer le push à tous les devices
        const payload = JSON.stringify({
            title: 'Edusky', // Ou notification.type
            body: notification.contenu, // Attention: correspond à la colonne de votre DB (message ou contenu)
            url: notification.url || '/',
            icon: '/icons/icon-192x192.png' // Assurez-vous que l'icône existe
        });

        const sendPromises = subscriptions.map(async (sub) => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            };

            try {
                await webPush.sendNotification(pushConfig, payload);
            } catch (err: any) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription expired or invalid, delete it
                    console.log('Subscription expired, deleting:', sub.endpoint);
                    await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
                } else {
                    console.error('Error sending push:', err);
                }
            }
        });

        await Promise.all(sendPromises);

        return NextResponse.json({ success: true, count: subscriptions.length });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
