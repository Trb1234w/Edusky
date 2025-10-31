import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getAuthenticatedUserProfile() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Normalement, la page qui appelle cette fonction devrait déjà avoir redirigé.
    // C'est une sécurité supplémentaire.
    redirect("/auth/connexion");
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    // On pourrait rediriger vers une page d'erreur ici
    return null;
  }

  return profile;
}
