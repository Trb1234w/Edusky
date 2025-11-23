import { createClient } from "@supabase/supabase-js";

// Utiliser le client ADMIN pour contourner les RLS lors de la création de notifications pour d'autres utilisateurs
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type NotificationType = 'like' | 'comment' | 'share' | 'follow' | 'message';

interface CreateNotificationParams {
    userId: string; // L'utilisateur qui REÇOIT la notification
    type: NotificationType;
    content: string;
    refId?: string; // ID de l'objet lié (post_id, user_id, conversation_id, etc.)
    refTable?: string; // Table de l'objet lié (postes, profiles, conversations, etc.)
    metadata?: any; // Données supplémentaires (ex: avatar de l'auteur, lien, etc.)
}

export async function createNotification({
    userId,
    type,
    content,
    refId,
    refTable,
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
            contenu: content,
            ref_id: refId,
            ref_table: refTable,
            metadata,
            lu: false,
        });

        if (error) {
            console.error("[createNotification] Supabase error:", error);
            return { error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error("[createNotification] Unexpected error:", err);
        return { error: "Unexpected error creating notification." };
    }
}
