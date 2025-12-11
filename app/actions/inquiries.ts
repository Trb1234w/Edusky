'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Define a schema for validation
const InquirySchema = z.object({
  type_demande: z.enum(['devenir_expert', 'formation_entreprise', 'sponsor_evenement', 'sponsor_club']),
  nom_contact: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: 'Veuillez fournir une adresse email valide.' }),
  telephone: z.string().optional(),
  nom_entreprise: z.string().optional(),
  message: z.string().min(10, { message: 'Votre message doit contenir au moins 10 caractères.' }),
})

export async function createInquiry(
  formData: FormData,
  inquiryType: 'devenir_expert' | 'formation_entreprise' | 'sponsor_evenement' | 'sponsor_club'
) {
  const supabase = await createClient()

  const rawData = {
    type_demande: inquiryType,
    nom_contact: formData.get('nom_contact'),
    email: formData.get('email'),
    telephone: formData.get('telephone'),
    nom_entreprise: formData.get('nom_entreprise'),
    message: formData.get('message'),
  }

  // Validate data
  const validatedFields = InquirySchema.safeParse(rawData)

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors)
    return {
      success: false,
      error: 'Veuillez corriger les erreurs dans le formulaire.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const {
    type_demande,
    nom_contact,
    email,
    telephone,
    nom_entreprise,
    message,
  } = validatedFields.data

  try {
    const { error } = await supabase.from('demandes_pro').insert([
      {
        type_demande,
        nom_contact,
        email,
        telephone: telephone || null,
        nom_entreprise: nom_entreprise || null,
        message,
        statut: 'nouveau',
        metadata: {}, // We can add specific metadata later if needed
      },
    ])

    if (error) {
      console.error('Supabase Insert Error:', error)
      return {
        success: false,
        error: 'Erreur de base de données: Impossible d\'enregistrer votre demande.',
      }
    }

    // Optionally, revalidate paths if you have an admin page to show these
    // revalidatePath('/admin/inquiries')

    return { success: true }
  } catch (e) {
    console.error('Unexpected Error:', e)
    return {
      success: false,
      error: 'Une erreur inattendue est survenue.',
    }
  }
}
