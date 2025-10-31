'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createFormationInscription(formData: {
  nom: string
  prenom: string
  email: string
  telephone: string
  message?: string
  formation_id: string
}) {
  const supabase = await createClient()

  // On peut récupérer l'utilisateur connecté s'il y en a un
  const { data: { user } } = await supabase.auth.getUser()

  const dataToInsert = {
    ...formData,
    user_id: user?.id || null,
  }

  const { data, error } = await supabase
    .from('inscriptions_formation')
    .insert([dataToInsert])
    .select()

  if (error) {
    console.error("Erreur lors de l'inscription à la formation:", error)
    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer.",
    }
  }

  // Revalider le chemin pour potentiellement mettre à jour des données affichées
  revalidatePath(`/formations/${formData.formation_id}`)

  return {
    success: true,
    message: "Inscription réussie ! Nous vous contacterons bientôt.",
    data: data[0],
  }
}
