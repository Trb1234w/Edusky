import { createClient } from "@/lib/supabase/server";
import { getUserProfileByUsername } from "@/lib/data/users.server";
import { getPostsByAuthorId } from "@/lib/data/posts.server";
import { notFound, redirect } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SharedPostCard } from "@/components/shared-post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile-header";

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

  const renderPost = (post: any) => {
    const props = {
      ...post,
      currentUserId: currentUser?.id,
      followingIds: [], // Cette information n'est pas cruciale ici, on peut la laisser vide
      authorUsername: post.authorUsername, // Corrigé
    };
    if (post.sharedPost) {
      return <SharedPostCard key={post.id} {...props} />;
    }
    return <PostCard key={post.id} {...props} />;
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <main className="container mx-auto px-4 py-8">
        {/* Section de l'en-tête du profil gérée par le composant client */}
        <ProfileHeader profile={profile} currentUserId={currentUser?.id} />

        {/* Section des contenus du profil */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList>
            <TabsTrigger value="posts">Publications</TabsTrigger>
            <TabsTrigger value="abonnements">Abonnements</TabsTrigger>
            <TabsTrigger value="abonnes">Abonnés</TabsTrigger>
            <TabsTrigger value="media">Média</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {posts && posts.length > 0 ? (
                posts.map(renderPost)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Cet utilisateur n'a encore rien publié.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="abonnements" className="mt-6">
            <p className="text-center py-12 text-muted-foreground">La liste des abonnements sera affichée ici.</p>
          </TabsContent>
          <TabsContent value="abonnes" className="mt-6">
            <p className="text-center py-12 text-muted-foreground">La liste des abonnés sera affichée ici.</p>
          </TabsContent>
           <TabsContent value="media" className="mt-6">
            <p className="text-center py-12 text-muted-foreground">Les médias seront affichés ici.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
