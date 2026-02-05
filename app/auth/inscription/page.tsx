"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, User, Mail, Lock, ArrowRight, AtSign, FileText, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères." }),
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  bio: z.string().max(200, { message: "La bio ne doit pas dépasser 200 caractères." }).optional(),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  confirmPassword: z.string().min(6, { message: "Veuillez confirmer votre mot de passe." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

export default function InscriptionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { username, firstName, lastName, email, password, bio } = values;
    const role = "utilisateur";

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          full_name: `${firstName} ${lastName}`,
          prenom: firstName,
          nom: lastName,
          role: role,
          bio: bio,
        },
      },
    });

    if (authError) {
      toast.error("Erreur d'inscription", {
        description: authError.message,
      });
      return;
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: username,
          prenom: firstName,
          nom: lastName,
          full_name: `${firstName} ${lastName}`,
          email: email,
          role: role,
          bio: bio,
        });

      if (profileError) {
        toast.error("Erreur lors de la création du profil", {
          description: profileError.message,
        });
        return;
      }

      setEmailSent(email);
      setIsSubmitted(true);
      toast.success("Inscription enregistrée", {
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(`Erreur d'inscription ${provider}`, {
        description: error.message,
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-primary to-accent p-4 py-12">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <Card className="border-border/50 shadow-2xl text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Vérifiez votre email</CardTitle>
              <CardDescription className="text-lg">
                Nous avons envoyé un lien de confirmation à :<br />
                <span className="font-semibold text-foreground">{emailSent}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Cliquez sur le lien dans l'email pour activer votre compte. Si vous ne le voyez pas, vérifiez vos messages indésirables.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/connexion">Retour à la connexion</Link>
                </Button>
                <Button variant="ghost" className="w-full text-xs" onClick={() => setIsSubmitted(false)}>
                  Se réinscrire avec un autre email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-primary to-accent p-4 py-8">
      <div className="w-full max-w-md my-8">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">EduSky</span>
        </Link>

        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 py-4">
            <CardTitle className="text-xl font-bold text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center text-sm">Rejoignez la communauté EduSky</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs uppercase tracking-wider font-semibold opacity-70">Nom d'utilisateur</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="username"
                    type="text"
                    placeholder="pseudo"
                    {...form.register("username")}
                    className="pl-10 h-10"
                  />
                </div>
                {form.formState.errors.username && (
                  <p className="text-red-500 text-[10px] font-medium leading-tight">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs uppercase tracking-wider font-semibold opacity-70">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Prénom"
                      {...form.register("firstName")}
                      className="pl-10 h-10"
                    />
                  </div>
                  {form.formState.errors.firstName && (
                    <p className="text-red-500 text-[10px] font-medium leading-tight">{form.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs uppercase tracking-wider font-semibold opacity-70">Nom</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Nom"
                    {...form.register("lastName")}
                    className="h-10"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-red-500 text-[10px] font-medium leading-tight">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold opacity-70">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    {...form.register("email")}
                    className="pl-10 h-10"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-red-500 text-[10px] font-medium leading-tight">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs uppercase tracking-wider font-semibold opacity-70">Bio (optionnel)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <Textarea
                    id="bio"
                    placeholder="Parlez-nous un peu de vous..."
                    {...form.register("bio")}
                    className="pl-10 py-2 min-h-[80px] text-sm resize-none"
                  />
                </div>
                {form.formState.errors.bio && (
                  <p className="text-red-500 text-[10px] font-medium leading-tight">{form.formState.errors.bio.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold opacity-70">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...form.register("password")}
                      className="pl-10 h-10"
                    />
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-[10px] font-medium leading-tight">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider font-semibold opacity-70">Confirmation</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...form.register("confirmPassword")}
                      className="pl-10 h-10"
                    />
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-[10px] font-medium leading-tight">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-[10px] leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                >
                  J'accepte les{" "}
                  <Link href="/conditions" className="text-primary hover:underline font-semibold">
                    conditions
                  </Link>{" "}
                  et la{" "}
                  <Link href="/confidentialite" className="text-primary hover:underline font-semibold">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full font-semibold h-11 mt-2" size="sm" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Création..." : "Créer mon compte"}
                {!form.formState.isSubmitting && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-medium">Ou continuer avec</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="outline" type="button" size="sm" className="h-9 text-xs" onClick={() => handleSocialLogin('google')}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" size="sm" className="h-9 text-xs" onClick={() => handleSocialLogin('facebook')}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4 font-medium">
              Déjà un compte ?{" "}
              <Link href="/auth/connexion" className="text-primary font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

