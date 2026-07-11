"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Lock, ArrowRight, FileText, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),

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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { firstName, lastName, email, password } = values;
    const role = "utilisateur";

    console.log("[INSCRIPTION] Tentative d'inscription avec:", { email, firstName, lastName, role });

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          prenom: firstName,
          nom: lastName,
          role: role,
        },
      },
    });

    if (authError) {
      console.error("[INSCRIPTION] Erreur auth.signUp:", {
        message: authError.message,
        status: authError.status,
        code: (authError as any).code,
        details: authError,
      });

      let errorMessage = "Une erreur est survenue lors de l'inscription.";

      if (authError.message.includes("User already registered")) {
        errorMessage = "Un compte avec cette adresse email existe déjà.";
      } else if (authError.message.includes("Password should be at least")) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      } else if (
        authError.message.includes("rate limit") ||
        authError.message.includes("over_email_send_rate_limit") ||
        (authError as any).code === "over_email_send_rate_limit" ||
        authError.status === 429
      ) {
        errorMessage = "Trop de tentatives d'inscription. Veuillez patienter quelques minutes avant de réessayer.";
      } else if (authError.message.includes("invalid email")) {
        errorMessage = "L'adresse email saisie est invalide.";
      } else if (authError.message.includes("Database error")) {
        errorMessage = "Erreur serveur lors de la création du compte. Veuillez réessayer.";
      }

      toast.error("Erreur d'inscription", {
        description: errorMessage,
      });
      return;
    }

    console.log("[INSCRIPTION] auth.signUp réponse:", authData);

    if (authData.user) {
      // Supabase email enumeration protection: returns a fake user with empty identities if email exists
      if (authData.user.identities && authData.user.identities.length === 0) {
        toast.error("Erreur d'inscription", {
          description: "Un compte avec cette adresse email existe déjà.",
        });
        return;
      }

      // Le trigger handle_new_user crée le profil automatiquement côté Supabase
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
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side - Branding (Hidden on small screens) */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-background/20 rounded-full blur-3xl" />
        


        {/* Text and Logo */}
        <div className="relative z-10 space-y-6 max-w-lg mt-auto mb-auto flex flex-col">
           {/* Logo */}
           <Link href="/" className="relative z-10 flex items-center gap-3 group w-fit mb-2">
               <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/30 to-white/10 p-[2px] backdrop-blur-md transition-transform group-hover:scale-110 duration-300 shadow-xl">
                   <div className="w-full h-full rounded-xl bg-white/20 flex items-center justify-center">
                       <span className="text-3xl font-bold text-white">E</span>
                   </div>
               </div>
               <span className="text-4xl font-bold text-white tracking-wide">EduSky</span>
           </Link>

           <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
             Rejoignez la plateforme éducative du futur.
           </h1>
           <p className="text-lg text-white/90 font-medium">
             Accédez à des milliers de formations, participez à des événements exclusifs et boostez votre carrière dès aujourd'hui.
           </p>
        </div>
        
        <div className="relative z-10 text-white/70 text-sm">
          © {new Date().getFullYear()} EduSky. Tous droits réservés.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6 relative z-10 my-auto py-8">
          
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center justify-center gap-3 mb-6 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px]">
                  <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">E</span>
                  </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">EduSky</span>
          </Link>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Créer un compte</h2>
            <p className="text-muted-foreground">Rejoignez la communauté EduSky</p>
          </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">


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

            <p className="text-center text-xs text-muted-foreground mt-6 font-medium">
              Déjà un compte ?{" "}
              <Link href="/auth/connexion" className="text-primary font-bold hover:underline">
                Se connecter
              </Link>
            </p>

        </div>
      </div>
    </div>
  )
}

