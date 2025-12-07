'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createEvenementInscription(formData: {
  nom: string
  prenom: string
  email: string
  telephone: string
  whatsapp: string
  age: number
  profession?: string
  entreprise?: string
  secteur_activite?: string
  motivation_participation?: string
  attentes_evenement?: string
  comment_connu?: string
  besoins_specifiques?: string
  regime_alimentaire?: string
  accompagnants?: number
  message?: string
  evenement_id: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const dataToInsert = {
    ...formData,
    user_id: user?.id || null,
  }

  const { data, error } = await supabase
    .from('inscriptions_evenement')
    .insert([dataToInsert])
    .select()

  if (error) {
    console.error("Erreur lors de l'inscription à l'événement:", error)
    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer.",
    }
  }

  revalidatePath(`/evenements/${formData.evenement_id}`)

  return {
    success: true,
    message: "Inscription réussie ! Nous vous recontacterons très prochainement.",
    data: data[0],
  }
}
