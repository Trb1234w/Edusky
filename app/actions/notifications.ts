'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error("Error fetching notifications:", error);
        return { error: error.message };
    }

    return { data };
}

export async function markAsRead(notificationId: string) {
    const supabase = await createClient();

    // Try 'is_read' first
    let { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

    if (error && error.message.includes('column "is_read" of relation')) {
        // Fallback to 'lu'
        const { error: retryError } = await supabase
            .from('notifications')
            .update({ lu: true })
            .eq('id', notificationId);
        error = retryError;
    }

    if (error) {
        console.error("Error marking notification as read:", error);
        return { error: error.message };
    }

    revalidatePath('/notifications');
    return { success: true };
}

export async function markAllAsRead(userId: string) {
    const supabase = await createClient();

    // Try 'is_read'
    let { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false); // Only update unread ones

    if (error && error.message.includes('column "is_read" of relation')) {
        // Fallback to 'lu'
        const { error: retryError } = await supabase
            .from('notifications')
            .update({ lu: true })
            .eq('user_id', userId)
            .eq('lu', false);
        error = retryError;
    }

    if (error) {
        console.error("Error marking all notifications as read:", error);
        return { error: error.message };
    }

    revalidatePath('/notifications');
    return { success: true };
}
