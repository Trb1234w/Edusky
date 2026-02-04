import { createClient } from "@supabase/supabase-js";

// Utiliser le client ADMIN pour contourner les RLS lors de la création de notifications pour d'autres utilisateurs
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
);

export type NotificationType = 'like' | 'comment' | 'share' | 'follow' | 'message' | 'order' | 'new_formation' | 'new_event' | 'new_club' | 'new_blog' | 'inscription';

export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    message: string; // Was 'contenu'
    ref_id?: string;
    ref_table?: string;
    url?: string;
    metadata?: any;
    is_read: boolean; // Was 'lu'
    created_at: string;
}

interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    message: string;
    refId?: string;
    refTable?: string;
    url?: string;
    metadata?: any;
}

export async function createNotification({
    userId,
    type,
    message,
    refId,
    refTable,
    url,
    metadata,
}: CreateNotificationParams) {
    if (!userId) {
        console.error("[createNotification] Error: userId is required.");
        return { error: "User ID is required." };
    }

    try {
        const { error } = await supabaseAdmin.from("notifications").insert({
            user_id: userId,
            type,
            message: message, // Assuming column renamed to message
            // If strictly using the older schema (safe):
            // contenu: message, 
            ref_id: refId,
            ref_table: refTable,
            url,
            metadata,
            is_read: false,
        });

        if (error) {
            // Fallback for French column names if rename didn't happen
            if (error.message.includes('column "message" of relation "notifications" does not exist')) {
                const { error: retryError } = await supabaseAdmin.from("notifications").insert({
                    user_id: userId,
                    type,
                    contenu: message,
                    ref_id: refId,
                    ref_table: refTable,
                    url,
                    metadata,
                    lu: false, // fallback
                });
                if (retryError) {
                    console.error("[createNotification] Retry Supabase error:", retryError);
                    return { error: retryError.message };
                }
                return { success: true };
            }

            console.error("[createNotification] Supabase error:", error);
            return { error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error("[createNotification] Unexpected error:", err);
        return { error: "Unexpected error creating notification." };
    }
}
