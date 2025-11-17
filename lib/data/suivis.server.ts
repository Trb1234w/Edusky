'use server'

import { createClient } from '@supabase/supabase-js'; // Import createClient from supabase-js

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

// Helper to create supabaseAdmin client
function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("CRITICAL: Supabase environment variables missing for admin client!");
    throw new Error("Supabase admin client configuration incomplete.");
  }
  return createClient(supabaseUrl, serviceKey);
}

/**
 * Récupère la liste des utilisateurs qui suivent l'utilisateur donné (followers).
 */
export async function getFollowers(userId: string) {
  const supabaseAdmin = getSupabaseAdminClient(); // Use admin client

  const { data, error } = await supabaseAdmin
    .from('suivis')
    .select(`
      follower_id,
      follower:profiles!follower_id(
        id,
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq('followed_id', userId);

  if (error) {
    console.error("ERREUR Supabase dans getFollowers:", JSON.stringify(error, null, 2));
    return { data: null, error };
  }

  const followers = data.map(item => item.follower);

  return { data: followers, error: null };
}

/**
 * Récupère la liste des utilisateurs que l'utilisateur donné suit (following).
 */
export async function getFollowing(userId: string) {
  const supabaseAdmin = getSupabaseAdminClient(); // Use admin client

  const { data, error } = await supabaseAdmin
    .from('suivis')
    .select(`
      followed_id,
      followed:profiles!followed_id(
        id,
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq('follower_id', userId);

  if (error) {
    console.error("ERREUR Supabase dans getFollowing:", JSON.stringify(error, null, 2));
    return { data: null, error };
  }

  const following = data.map(item => item.followed);

  return { data: following, error: null };
}

