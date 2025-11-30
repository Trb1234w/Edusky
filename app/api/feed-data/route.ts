import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getAllFeedPosts } from '@/lib/data/posts.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Exécuter toutes les requêtes de données en parallèle pour plus de performance
    const [
      profileResult,
      followingResult,
      postsResult
    ] = await Promise.all([
      supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single(),
      supabase.from('suivis').select('followed_id').eq('follower_id', user.id),
      getAllFeedPosts() // Cette fonction gère déjà son propre client Supabase
    ]);

    const { data: profile, error: profileError } = profileResult;
    const { data: followingData, error: followingError } = followingResult;
    const { data: posts, error: postsError } = postsResult;

    if (profileError || followingError || postsError) {
      console.error("API Error fetching feed data:", { profileError, followingError, postsError });
      return NextResponse.json({ error: 'Erreur interne du serveur lors de la récupération des données.' }, { status: 500 });
    }

    const followingIds = followingData ? followingData.map(f => f.followed_id) : [];

    // Retourner une réponse JSON complète
    return NextResponse.json({
      user,
      profile,
      followingIds,
      posts: posts || [],
    });

  } catch (e: any) {
    console.error("Catastrophic error in /api/feed-data:", e.message);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
