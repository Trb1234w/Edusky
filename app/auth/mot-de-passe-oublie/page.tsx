"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GraduationCap, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
    email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
});

export default function MotDePasseOubliePage() {
    const supabase = createClient();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [emailSent, setEmailSent] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { email } = values;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reinitialisation-mot-de-passe`,
        });

        if (error) {
            toast.error("Erreur", {
                description: error.message,
            });
            return;
        }

        setEmailSent(email);
        setIsSubmitted(true);
        toast.success("Email envoyé", {
            description: "Si un compte existe pour cet email, vous recevrez un lien de réinitialisation.",
        });
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-4">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                    <Card className="border-border/50 shadow-2xl text-center">
                        <CardHeader className="space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-500" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Email envoyé !</CardTitle>
                            <CardDescription>
                                Un lien de réinitialisation a été envoyé à :<br />
                                <span className="font-semibold text-foreground">{emailSent}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Veuillez vérifier votre boîte de réception et cliquer sur le lien pour choisir un nouveau mot de passe.
                            </p>
                            <Button className="w-full" asChild>
                                <Link href="/auth/connexion">Retour à la connexion</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <GraduationCap size={28} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">EduSky</span>
                </Link>

                <Card className="border-border/50 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié</CardTitle>
                        <CardDescription className="text-center">
                            Entrez votre email pour recevoir un lien de réinitialisation
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        {...form.register("email")}
                                        className="pl-10 h-11"
                                    />
                                </div>
                                {form.formState.errors.email && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full font-semibold h-11" size="lg" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
                                {!form.formState.isSubmitting && <ArrowRight size={18} className="ml-2" />}
                            </Button>

                            <Link
                                href="/auth/connexion"
                                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Retour à la connexion
                            </Link>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
