import { createClient } from "@/lib/supabase/server";
import { getUserProfileByUsername } from "@/lib/data/users.server";
import { getPostsByAuthorId } from "@/lib/data/posts.server";
import { getFollowers, getFollowing } from "@/lib/data/suivis.server";
import { notFound, redirect } from "next/navigation";
import { ProfileHeader } from "@/components/profile-header";
import { ProfileContent } from "./profile-content";
import { getProfileEliteInfos } from "@/app/dashboard/actions";

// On force le rendu dynamique pour que la page soit toujours à jour
export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Next.js avec Turbopack peut passer les params comme une promesse. Il faut la résoudre.
  const resolvedParams = await params;
  const { username } = resolvedParams;
  const supabase = await createClient();

  // Récupérer l'utilisateur actuellement connecté
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  // Récupérer les données du profil visité
  const { data: profile, error: profileError } = await getUserProfileByUsername(username, currentUser?.id);

  if (profileError || !profile) {
    notFound(); // Affiche une page 404 si le profil n'est pas trouvé
  }

  // Si l'utilisateur visite son propre profil via /profile/[username], on le redirige vers la page /dashboard
  if (currentUser && currentUser.id === profile.id) {
    redirect('/dashboard');
  }

  // Récupérer les posts de l'auteur du profil
  const { data: posts, error: postsError } = await getPostsByAuthorId(profile.id, currentUser?.id);

  if (postsError) {
    // On peut choisir d'afficher une erreur ou simplement de ne pas afficher de posts
    console.error("Error fetching posts for profile:", postsError);
  }

  // Récupérer les abonnés du profil
  const { data: followers, error: followersError } = await getFollowers(profile.id);
  if (followersError) {
    console.error("Error fetching followers for profile:", followersError);
  }

  // Récupérer les abonnements du profil
  const { data: following, error: followingError } = await getFollowing(profile.id);
  if (followingError) {
    console.error("Error fetching following for profile:", followingError);
  }

  // Récupérer les abonnements de l'utilisateur connecté pour déterminer le statut "isFollowing"
  let currentUserFollowingIds = new Set<string>();
  if (currentUser) {
    const { data: myFollowing, error: myFollowingError } = await getFollowing(currentUser.id);
    if (!myFollowingError && myFollowing) {
      myFollowing.forEach((p: any) => currentUserFollowingIds.add(p.id));
    }
  }

  // Mapper les profils pour ajouter isFollowing
  const followersWithStatus = followers?.map((p: any) => ({
    ...p,
    isFollowing: currentUserFollowingIds.has(p.id)
  })) || [];

  const followingWithStatus = following?.map((p: any) => ({
    ...p,
    isFollowing: currentUserFollowingIds.has(p.id)
  })) || [];

  // Récupérer les données Elite (Education, Expérience, Portfolio, Objectifs)
  const eliteData = await getProfileEliteInfos(profile.id);

  const profileWithPostsCount = {
    ...profile,
    postsCount: posts?.length || 0,
    isFollowing: currentUser ? currentUserFollowingIds.has(profile.id) : false,
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container mx-auto px-0 md:px-4 py-8 pt-2 lg:pt-24">
        {/* Section de l'en-tête du profil gérée par le composant client */}
        <ProfileHeader profile={profileWithPostsCount} currentUserId={currentUser?.id || ''} />

        {/* Section des contenus du profil */}
        <ProfileContent
          posts={posts || []}
          followers={followersWithStatus}
          following={followingWithStatus}
          currentUserId={currentUser?.id || ''}
          currentUserFollowingIds={Array.from(currentUserFollowingIds)}
          eliteData={eliteData}
        />
      </main>
    </div>
  );
}