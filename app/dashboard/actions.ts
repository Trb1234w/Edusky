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
          categorie:categorie_id(*),
          professeur:professeurs!professeur_id(*)
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
          categorie:categorie_id(*),
          leader:profiles!leader_id(*)
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

export async function getUserFavorites() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: [], error: { message: "Utilisateur non authentifié." } }
  }

  // 1. Récupérer tous les favoris de l'utilisateur
  const { data: favorites, error: favoritesError } = await supabase
    .from('favoris')
    .select('*')
    .eq('user_id', user.id)

  if (favoritesError) {
    console.error("Erreur lors de la récupération des favoris:", favoritesError)
    return { data: [], error: favoritesError }
  }

  if (!favorites || favorites.length === 0) {
    return { data: [], error: null }
  }

  // 2. Séparer les IDs par type
  const formationIds = favorites.filter(f => f.type_item === 'formation').map(f => f.item_id)
  const eventIds = favorites.filter(f => f.type_item === 'evenement').map(f => f.item_id)
  const clubIds = favorites.filter(f => f.type_item === 'club').map(f => f.item_id)

  let normalizedFavorites: any[] = []

  // 3. Récupérer les détails pour chaque type

  // --- FORMATIONS ---
  if (formationIds.length > 0) {
    const { data: formations, error: formationsError } = await supabase
      .from('formations')
      .select(`
        *,
        categorie:categorie_id(*),
        professeur:professeurs!professeur_id(*)
      `)
      .in('id', formationIds)

    if (!formationsError && formations) {
      const formattedFormations = formations.map(f => ({
        id: f.id,
        type: 'formation',
        title: f.titre,
        description: f.extrait,
        image_url: f.image_url,
        author: f.professeur?.full_name,
        category: f.categorie?.nom,
        level: f.niveau,
        duration: f.duree_texte,
        rating: f.note_moyenne,
        students: f.nb_avis,
        price: f.prix_indicatif ? `${f.prix_indicatif} GNF` : "Gratuit",
        language: f.langue_enseignement,
        certificate: f.certificat,
        // Preserve original data
        ...f
      }))
      normalizedFavorites = [...normalizedFavorites, ...formattedFormations]
    }
  }

  // --- ÉVÉNEMENTS ---
  if (eventIds.length > 0) {
    const { data: events, error: eventsError } = await supabase
      .from('evenements')
      .select(`
        *,
        categorie:categorie_id(*),
        organisateur:profiles!organisateur_id(*)
      `)
      .in('id', eventIds)

    if (!eventsError && events) {
      const formattedEvents = events.map(e => ({
        id: e.id,
        type: 'evenement',
        title: e.titre,
        description: e.extrait || e.description,
        image_url: e.image_url,
        author: e.organisateur?.full_name,
        category: e.categorie?.nom,
        date: e.date_debut,
        location: e.lieu || e.mode,
        maxParticipants: e.capacite,
        price: e.prix,
        isFree: e.est_gratuit,
        // Preserve original data
        ...e
      }))
      normalizedFavorites = [...normalizedFavorites, ...formattedEvents]
    }
  }

  // --- CLUBS ---
  if (clubIds.length > 0) {
    const { data: clubs, error: clubsError } = await supabase
      .from('clubs')
      .select(`
        *,
        categorie:categorie_id(*),
        leader:profiles!leader_id(*)
      `)
      .in('id', clubIds)

    if (!clubsError && clubs) {
      const formattedClubs = clubs.map(c => ({
        id: c.id,
        type: 'club',
        title: c.nom,
        description: c.description,
        image_url: c.image_url,
        author: c.leader?.full_name,
        category: c.categorie?.nom,
        members: c.capacite,
        fees: c.cotisation_mensuelle || c.cotisation_annuelle || c.prix_inscription,
        // Preserve original data
        ...c
      }))
      normalizedFavorites = [...normalizedFavorites, ...formattedClubs]
    }
  }

  return { data: normalizedFavorites, error: null }
}
