"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schéma de validation des données du formulaire avec Zod
const ContactFormSchema = z.object({
    first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
    last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    email: z.string().email("L'adresse email n'est pas valide."),
    subject: z.string().optional(),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères."),
});

// State pour la réponse de l'action
export type ContactFormState = {
    message: string;
    status: "success" | "error" | "idle";
    errors?: {
        [key: string]: string[];
    } | null;
};

export async function submitContactForm(
    prevState: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const supabase = await createClient();

    // 1. Valider les données
    const validatedFields = ContactFormSchema.safeParse({
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) {
        return {
            message: "Erreur de validation. Veuillez vérifier les champs.",
            status: "error",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // 2. Insérer dans la base de données
    const { data, error } = await supabase
        .from("contact_submissions")
        .insert([
            {
                first_name: validatedFields.data.first_name,
                last_name: validatedFields.data.last_name,
                email: validatedFields.data.email,
                subject: validatedFields.data.subject,
                message: validatedFields.data.message,
            },
        ])
        .select();

    if (error) {
        return {
            message: `Erreur de la base de données : ${error.message}`,
            status: "error",
            errors: null,
        };
    }

    // 3. Revalider le chemin et retourner une réponse de succès
    revalidatePath("/services");
    return {
        message: "Merci ! Votre message a été envoyé avec succès.",
        status: "success",
        errors: null,
    };
}
