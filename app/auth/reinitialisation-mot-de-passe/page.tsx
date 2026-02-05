"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GraduationCap, Lock, ArrowRight, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
    confirmPassword: z.string().min(6, { message: "Veuillez confirmer votre mot de passe." }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});

export default function ReinitialisationMotDePassePage() {
    const router = useRouter();
    const supabase = createClient();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { password } = values;

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            toast.error("Erreur", {
                description: error.message,
            });
            return;
        }

        setIsSuccess(true);
        toast.success("Mot de passe mis à jour", {
            description: "Votre mot de passe a été modifié avec succès.",
        });

        setTimeout(() => {
            router.push("/auth/connexion");
        }, 3000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-primary to-accent p-4 py-12">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                    <Card className="border-border/50 shadow-2xl text-center">
                        <CardHeader className="space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-500" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Succès !</CardTitle>
                            <CardDescription className="text-lg">
                                Votre mot de passe a été réinitialisé.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Redirection vers la page de connexion dans quelques instants...
                            </p>
                            <Button className="w-full" asChild>
                                <Link href="/auth/connexion">Se connecter maintenant</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-primary to-accent p-4 py-12">
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
                        <CardTitle className="text-2xl font-bold text-center">Nouveau mot de passe</CardTitle>
                        <CardDescription className="text-center">Choisissez votre nouveau mot de passe sécurisé</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nouveau mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...form.register("password")}
                                        className="pl-10 h-11"
                                    />
                                </div>
                                {form.formState.errors.password && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        {...form.register("confirmPassword")}
                                        className="pl-10 h-11"
                                    />
                                </div>
                                {form.formState.errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{form.formState.errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full font-semibold h-11 mt-2" size="lg" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Mise à jour..." : "Réinitialiser le mot de passe"}
                                {!form.formState.isSubmitting && <ArrowRight size={18} className="ml-2" />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
