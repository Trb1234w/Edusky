"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let errorMessage = "Une erreur est survenue lors de la connexion.";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre adresse email avant de vous connecter.";
      } else if (error.message.includes("User not found")) {
        errorMessage = "Aucun utilisateur trouvé avec cet email.";
      }

      toast.error("Erreur de connexion", {
        description: errorMessage,
      });
      return;
    }

    toast.success("Connexion réussie", {
      description: "Vous êtes maintenant connecté.",
    });
    router.push("/dashboard"); // Redirect to dashboard or home page
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(`Erreur de connexion ${provider}`, {
        description: error.message,
      });
    }
  };

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
             Bon retour parmi nous.
           </h1>
           <p className="text-lg text-white/90 font-medium">
             Connectez-vous pour accéder à vos formations, vos événements et reprendre votre apprentissage.
           </p>
        </div>
        
        <div className="relative z-10 text-white/70 text-sm">
          © {new Date().getFullYear()} EduSky. Tous droits réservés.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden flex items-center justify-center gap-3 mb-8 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px]">
                  <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">E</span>
                  </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">EduSky</span>
          </Link>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Connexion</h2>
            <p className="text-muted-foreground">Entrez vos identifiants pour accéder à votre compte</p>
          </div>

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
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Se souvenir de moi
                  </label>
                </div>
                <Link href="/auth/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" className="w-full font-semibold" size="lg" disabled={form.formState.isSubmitting}>
                Se connecter
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </form>



          
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Vous n'avez pas encore de compte ? {" "}
              <Link href="/auth/inscription" className="text-primary hover:underline font-medium">
                S'inscrire
              </Link>
            </div>
        </div>
      </div>
    </div>
  )
}
