'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClubInscription(formData: {
  nom: string
  prenom: string
  email: string
  telephone: string
  whatsapp: string
  age: number
  date_naissance?: string
  profession?: string
  niveau_experience: string
  centres_interet?: string[]
  motivation_adhesion: string
  disponibilite_semaine?: string[]
  comment_connu?: string
  parraine_par?: string
  accepte_reglement: boolean
  accepte_communication?: boolean
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
    message: "Inscription au club réussie ! Nous vous recontacterons très prochainement.",
    data: data[0],
  }
}
