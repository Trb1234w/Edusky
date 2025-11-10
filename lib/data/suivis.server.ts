'use server'

import { createClient } from "@/lib/supabase/server";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

/**
 * Récupère la liste des utilisateurs qui suivent l'utilisateur donné (followers).
 */
export async function getFollowers(userId: string) {
  console.log("--- getFollowers function started ---");
  console.log(`--- DEBUG: getFollowers pour userId: ${userId} ---`);
  const supabase = await createClient();
  console.log("Supabase client created in getFollowers.");

  const { data, error } = await supabase
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
    console.error("--- ERREUR Supabase dans getFollowers ---");
    console.error(JSON.stringify(error, null, 2));
    return { data: null, error };
  }

  console.log("--- Données brutes de suivis reçues ---");
  console.log(JSON.stringify(data, null, 2));

  const followers = data.map(item => item.follower);
  console.log("--- Followers après mappage ---");
  console.log(JSON.stringify(followers, null, 2));
  console.log(`--- FIN DEBUG: getFollowers ---`);

  return { data: followers, error: null };
}

/**
 * Récupère la liste des utilisateurs que l'utilisateur donné suit (following).
 */
export async function getFollowing(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    console.error("Erreur lors de la récupération des abonnements:", error);
    return { data: null, error };
  }

  const following = data.map(item => item.followed);
  return { data: following, error: null };
}
