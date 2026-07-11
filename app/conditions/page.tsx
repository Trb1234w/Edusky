import Link from "next/link"
import { Scale, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Conditions d'utilisation | EduSky",
  description: "Conditions générales d'utilisation de la plateforme EduSky.",
}

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Conditions d'utilisation</h1>
          <p className="text-white/80">Dernière mise à jour : juillet 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <Button variant="ghost" asChild className="mb-8 -ml-2">
          <Link href="/auth/inscription">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>

        <div className="prose prose-gray max-w-none space-y-8">

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">1. Acceptation des conditions</h2>
            <p className="text-muted-foreground leading-relaxed">
              En accédant et en utilisant la plateforme EduSky, vous acceptez d'être lié par les présentes conditions d'utilisation. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">2. Description du service</h2>
            <p className="text-muted-foreground leading-relaxed">
              EduSky est une plateforme éducative en ligne qui propose des formations, des événements, des ressources pédagogiques 
              et met en relation des apprenants avec des professeurs qualifiés. Nos services sont accessibles aux personnes physiques 
              majeures ou aux mineurs avec l'accord de leurs représentants légaux.
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">3. Création de compte</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Fournir des informations exactes, complètes et à jour lors de votre inscription.</li>
              <li>Maintenir la confidentialité de votre mot de passe.</li>
              <li>Notifier immédiatement EduSky de toute utilisation non autorisée de votre compte.</li>
              <li>N'utiliser qu'un seul compte par personne.</li>
            </ul>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">4. Utilisation acceptable</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vous vous engagez à ne pas utiliser EduSky pour :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Publier des contenus illégaux, obscènes, diffamatoires ou offensants.</li>
              <li>Violer les droits de propriété intellectuelle d'autrui.</li>
              <li>Tenter de pirater ou de compromettre la sécurité de la plateforme.</li>
              <li>Envoyer des messages non sollicités (spam) à d'autres utilisateurs.</li>
              <li>Usurper l'identité d'une autre personne ou entité.</li>
            </ul>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">5. Propriété intellectuelle</h2>
            <p className="text-muted-foreground leading-relaxed">
              Tous les contenus présents sur EduSky (textes, images, vidéos, logos, etc.) sont protégés par les droits de propriété 
              intellectuelle et appartiennent à EduSky ou à ses partenaires. Toute reproduction, distribution ou utilisation sans 
              autorisation expresse est interdite.
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">6. Limitation de responsabilité</h2>
            <p className="text-muted-foreground leading-relaxed">
              EduSky s'efforce de maintenir la plateforme disponible et fonctionnelle, mais ne peut garantir une disponibilité 
              continue sans interruption. EduSky ne pourra être tenu responsable de dommages indirects, consécutifs ou accessoires 
              résultant de l'utilisation ou de l'impossibilité d'utiliser nos services.
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">7. Modification des conditions</h2>
            <p className="text-muted-foreground leading-relaxed">
              EduSky se réserve le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur 
              publication sur la plateforme. Il vous appartient de consulter régulièrement ces conditions.
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à l'adresse suivante : 
              <strong className="text-foreground"> contact@edusky.fr</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
