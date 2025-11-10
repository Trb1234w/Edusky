'use server'

import { createClient } from '@/lib/supabase/server'

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
