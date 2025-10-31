'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClubInscription(formData: {
  nom: string
  prenom: string
  email: string
  telephone: string
  message?: string
  club_id: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const dataToInsert = {
    ...formData,
    user_id: user?.id || null,
  }

  const { data, error } = await supabase
    .from('inscriptions_club')
    .insert([dataToInsert])
    .select()

  if (error) {
    console.error("Erreur lors de l'inscription au club:", error)
    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer.",
    }
  }

  revalidatePath(`/clubs/${formData.club_id}`)

  return {
    success: true,
    message: "Inscription au club réussie !",
    data: data[0],
  }
}
