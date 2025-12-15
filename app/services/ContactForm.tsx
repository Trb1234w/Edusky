"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Le bouton de soumission qui affiche un état de chargement
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-lg font-bold"
            aria-disabled={pending}
            disabled={pending}
        >
            {pending ? "Envoi en cours..." : "Envoyer le message"}
        </Button>
    );
}

// Le composant du formulaire de contact
export function ContactForm() {
    const initialState: ContactFormState = { message: "", status: "idle", errors: null };
    const [state, formAction] = useActionState(submitContactForm, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    // Réinitialiser le formulaire après un succès
    useEffect(() => {
        if (state.status === "success") {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <form 
            ref={formRef} 
            action={formAction} 
            className="bg-card p-8 rounded-2xl border border-border/50 shadow-lg space-y-6"
        >
            {/* Message de succès ou d'erreur global */}
            {state.status === "success" && (
                <div className="p-4 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg">
                    {state.message}
                </div>
            )}
            {state.status === "error" && !state.errors && (
                 <div className="p-4 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg">
                    {state.message}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-medium">Prénom</label>
                    <Input id="first_name" name="first_name" placeholder="Votre prénom" className="bg-muted/50 h-12 rounded-xl" />
                    {state.errors?.first_name && <p className="text-sm text-red-500">{state.errors.first_name[0]}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-medium">Nom</label>
                    <Input id="last_name" name="last_name" placeholder="Votre nom" className="bg-muted/50 h-12 rounded-xl" />
                    {state.errors?.last_name && <p className="text-sm text-red-500">{state.errors.last_name[0]}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" placeholder="votre@email.com" className="bg-muted/50 h-12 rounded-xl" />
                 {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Sujet (Optionnel)</label>
                <Input id="subject" name="subject" placeholder="De quoi voulez-vous parler ?" className="bg-muted/50 h-12 rounded-xl" />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea id="message" name="message" placeholder="Détaillez votre projet ou votre question ici..." className="bg-muted/50 min-h-[150px] rounded-xl" />
                {state.errors?.message && <p className="text-sm text-red-500">{state.errors.message[0]}</p>}
            </div>

            <SubmitButton />
        </form>
    );
}
