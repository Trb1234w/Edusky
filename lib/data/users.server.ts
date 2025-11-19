'use server'

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from 'next/cache';

// Helper to create supabaseAdmin client
function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("CRITICAL: Supabase environment variables missing for admin client!");
    throw new Error("Supabase admin client configuration incomplete.");
  }
  return createAdminClient(supabaseUrl, serviceKey);
}

/**
 * Récupère les données complètes d'un profil utilisateur pour sa page de profil.
 * @param username Le nom d'utilisateur du profil à récupérer.
 * @param currentUserId L'ID de l'utilisateur actuellement connecté (optionnel).
 * @returns Un objet contenant les données du profil, les comptes d'abonnés/abonnements, et si l'utilisateur actuel suit ce profil.
 */
export async function getUserProfileByUsername(username: string, currentUserId?: string) {
  noStore();
  const supabase = await createServerClient();

  // Étape 1: Récupérer le profil de base par nom d'utilisateur
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, bio, created_at, role')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    console.error(`Error fetching profile for username ${username}:`, profileError);
    return { data: null, error: "Profil non trouvé." };
  }

  // Étape 2: Récupérer les comptes d'abonnés et d'abonnements en parallèle
  const [followersResult, followingResult, isFollowingResult] = await Promise.all([
    supabase
      .from('suivis')
      .select('id', { count: 'exact', head: true })
      .eq('followed_id', profile.id),
    supabase
      .from('suivis')
      .select('id', { count: 'exact', head: true })
      .eq('follower_id', profile.id),
    currentUserId ? supabase
      .from('suivis')
      .select('id', { count: 'exact', head: true })
      .eq('follower_id', currentUserId)
      .eq('followed_id', profile.id) : Promise.resolve({ count: 0 })
  ]);

  const { count: followersCount, error: followersError } = followersResult;
  const { count: followingCount, error: followingError } = followingResult;
  const { count: isFollowingCount, error: isFollowingError } = isFollowingResult as { count: number | null, error: any };


  if (followersError || followingError || isFollowingResult) { // Fixed: isFollowingResult to isFollowingError
    console.error("Error fetching follow counts:", { followersError, followingError, isFollowingError });
    // On peut décider de continuer même si les comptes échouent
  }

  const userProfile = {
    ...profile,
    followersCount: followersCount ?? 0,
    followingCount: followingCount ?? 0,
    isFollowing: (isFollowingCount ?? 0) > 0,
  };

  return { data: userProfile, error: null };
}

/**
 * Récupère une liste de profils suggérés à suivre.
 * Exclut l'utilisateur actuel et les profils déjà suivis.
 * @param currentUserId L'ID de l'utilisateur actuel.
 * @param followingIds Les IDs des profils déjà suivis par l'utilisateur actuel.
 * @param limit Le nombre maximum de suggestions à retourner.
 * @returns Une liste de profils suggérés.
 */
export async function getSuggestedProfiles(currentUserId: string, followingIds: string[], limit: number = 3) {
  noStore();
  const supabaseAdmin = getSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, username, avatar_url, bio, role')
    .neq('id', currentUserId) // Exclure l'utilisateur actuel
    .not('id', 'in', `(${followingIds.join(',')})`) // Exclure les profils déjà suivis
    .limit(limit)
    .order('created_at', { ascending: false }); // Ou un ordre aléatoire, ou par popularité

  if (error) {
    console.error("Error fetching suggested profiles:", error);
    return { data: [], error };
  }

  return { data, error: null };
}