'use server'

import { createClient } from "@/lib/supabase/server";

export async function saveSubscription(subscription: PushSubscription) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'User not authenticated' };
    }

    const subscriptionData = JSON.parse(JSON.stringify(subscription));

    console.log('[saveSubscription] Received subscription for user:', user.id);
    console.log('[saveSubscription] Endpoint:', subscriptionData.endpoint?.slice(0, 50) + '...');

    const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
            user_id: user.id,
            endpoint: subscriptionData.endpoint,
            p256dh: subscriptionData.keys.p256dh,
            auth: subscriptionData.keys.auth,
        }, {
            onConflict: 'endpoint'
        });

    if (error) {
        console.error('Error saving subscription:', error);
        return { error: error.message };
    }

    console.log('[saveSubscription] Successfully saved subscription');

    return { success: true };
}

export async function deleteSubscription(endpoint: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', endpoint);

    if (error) {
        return { error: error.message };
    }
    return { success: true };
}
