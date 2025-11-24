'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggles the favorite status of an item for the current user.
 * @param itemType The type of item (e.g., 'formation', 'evenement', 'club', 'article', 'professeur').
 * @param itemId The UUID of the item.
 * @returns A result object indicating success or failure.
 */
export async function toggleFavoriteAction(itemType: string, itemId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  try {
    // Check if the item is already favorited
    const { data: existingFavorite, error: selectError } = await supabase
      .from('favoris')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .eq('type_item', itemType)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means "No rows found"
      console.error("Error checking favorite status:", selectError);
      return { success: false, error: selectError.message };
    }

    if (existingFavorite) {
      // Item is already favorited, so unfavorite it
      const { error: deleteError } = await supabase
        .from('favoris')
        .delete()
        .eq('id', existingFavorite.id);

      if (deleteError) {
        console.error("Error unfavoriting item:", deleteError);
        return { success: false, error: deleteError.message };
      }

      // Revalidate all relevant paths
      revalidatePath('/');
      revalidatePath('/formations');
      revalidatePath('/evenements');
      revalidatePath('/clubs');
      revalidatePath('/blog');
      revalidatePath('/professeurs');

      return { success: true, message: "Item unfavorited." };
    } else {
      // Item is not favorited, so favorite it
      const { error: insertError } = await supabase
        .from('favoris')
        .insert({
          user_id: user.id,
          item_id: itemId,
          type_item: itemType,
        });

      if (insertError) {
        console.error("Error favoriting item:", insertError);
        return { success: false, error: insertError.message };
      }

      // Revalidate all relevant paths
      revalidatePath('/');
      revalidatePath('/formations');
      revalidatePath('/evenements');
      revalidatePath('/clubs');
      revalidatePath('/blog');
      revalidatePath('/professeurs');

      return { success: true, message: "Item favorited." };
    }
  } catch (e: any) {
    console.error("Unexpected error in toggleFavoriteAction:", e);
    return { success: false, error: e.message || "An unexpected error occurred." };
  }
}
