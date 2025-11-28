'use server'

import { createClient } from '@/lib/supabase/server'
import { getPostsByAuthorId } from '@/lib/data/posts.server'

export async function fetchUserPosts(authorId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // On passe l'ID de l'utilisateur connecté pour savoir s'il a liké les posts
  return await getPostsByAuthorId(authorId, user?.id)
}

export async function getRegisteredEvents() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: [], error: { message: "Utilisateur non authentifié." } }
  }

  const { data, error } = await supabase
    .from('inscriptions_evenement')
    .select(
      `
        evenement:evenement_id(*,
          categorie:categorie_id(*),
          organisateur:profiles!organisateur_id(*)
        )
      `
    )
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur lors de la récupération des événements inscrits:", error)
    return { data: [], error }
  }

  // Extrait les objets evenement de l'objet d'inscription
  const registeredEvents = data.map(inscription => inscription.evenement)

  return { data: registeredEvents, error: null }
}

export async function getRegisteredFormations() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: [], error: { message: "Utilisateur non authentifié." } }
  }

  const { data, error } = await supabase
    .from('inscriptions_formation')
    .select(
      `
        formation:formation_id(*,
          categorie:categorie_id(*)
        )
      `
    )
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur lors de la récupération des formations inscrites:", error)
    return { data: [], error }
  }

  const registeredFormations = data.map(inscription => inscription.formation)

  return { data: registeredFormations, error: null }
}

export async function getRegisteredClubs() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: [], error: { message: "Utilisateur non authentifié." } }
  }

  const { data, error } = await supabase
    .from('inscriptions_club')
    .select(
      `
        club:club_id(*,
          categorie:categorie_id(*)
        )
      `
    )
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur lors de la récupération des clubs inscrits:", error)
    return { data: [], error }
  }

  const registeredClubs = data.map(inscription => inscription.club)

  return { data: registeredClubs, error: null }
}

export async function testServerAction() {
  console.log("--- TEST SERVER ACTION EXECUTED ---");
  return "Test successful!";
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Utilisateur non authentifié" }
  }

  try {
    const full_name = formData.get('full_name') as string
    const username = formData.get('username') as string
    const bio = formData.get('bio') as string
    const phone = formData.get('phone') as string
    const city = formData.get('city') as string
    const region = formData.get('region') as string
    const country = formData.get('country') as string
    const avatarFile = formData.get('avatar') as File | null

    let avatar_url = null

    // Upload avatar if provided
    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        return { error: "Erreur lors de l'upload de l'avatar" }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      avatar_url = publicUrl
    }

    // Update profile
    const updateData: any = {
      full_name,
      username,
      bio,
      phone,
      city,
      region,
      country,
      updated_at: new Date().toISOString()
    }

    if (avatar_url) {
      updateData.avatar_url = avatar_url
    }

    console.log("Updating profile for user:", user.id, "with data:", updateData);

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return { error: "Erreur lors de la mise à jour du profil: " + updateError.message }
    }

    console.log("Profile updated successfully");
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: "Une erreur inattendue s'est produite" }
  }
}

export async function deletePostAction(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non autorisé" }

  const { error } = await supabase
    .from('postes')
    .delete()
    .eq('id', postId)
    .eq('auteur_id', user.id)

  if (error) {
    console.error('Error deleting post:', error)
    return { error: "Erreur lors de la suppression du post" }
  }

  return { success: true }
}

export async function updatePostVisibilityAction(postId: string, visibility: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non autorisé" }

  const { error } = await supabase
    .from('postes')
    .update({ visibilite: visibility })
    .eq('id', postId)
    .eq('auteur_id', user.id)

  if (error) {
    console.error('Error updating post visibility:', error)
    return { error: "Erreur lors de la mise à jour de la visibilité" }
  }

  return { success: true }
}

export async function updatePostStatusAction(postId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non autorisé" }

  const { error } = await supabase
    .from('postes')
    .update({ statut: status })
    .eq('id', postId)
    .eq('auteur_id', user.id)

  if (error) {
    console.error('Error updating post status:', error)
    return { error: "Erreur lors de la mise à jour du statut" }
  }

  return { success: true }
}
