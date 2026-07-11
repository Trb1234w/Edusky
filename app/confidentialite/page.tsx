import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Politique de confidentialité | EduSky",
  description: "Politique de confidentialité et protection des données personnelles sur EduSky.",
}

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Politique de confidentialité</h1>
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

        <div className="space-y-8">

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">1. Responsable du traitement</h2>
            <p className="text-muted-foreground leading-relaxed">
              EduSky est responsable du traitement de vos données personnelles. Pour toute question relative à la protection de 
              vos données, vous pouvez nous contacter à : <strong className="text-foreground">contact@edusky.fr</strong>
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">2. Données collectées</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Lors de votre inscription et utilisation d'EduSky, nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Données d'identité</strong> : prénom, nom.</li>
              <li><strong className="text-foreground">Données de contact</strong> : adresse email.</li>
              <li><strong className="text-foreground">Données de connexion</strong> : adresse IP, logs de connexion, type de navigateur.</li>
              <li><strong className="text-foreground">Données d'utilisation</strong> : formations suivies, événements inscrits, préférences.</li>
            </ul>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">3. Finalités du traitement</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Gérer votre compte et vous fournir l'accès aux services EduSky.</li>
              <li>Vous envoyer des notifications liées à votre activité sur la plateforme.</li>
              <li>Améliorer nos services grâce à l'analyse d'utilisation.</li>
              <li>Répondre à vos demandes d'assistance.</li>
              <li>Respecter nos obligations légales et réglementaires.</li>
            </ul>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">4. Base légale du traitement</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le traitement de vos données est fondé sur l'exécution du contrat liant EduSky et l'utilisateur (lors de la création 
              de votre compte), votre consentement (pour les communications marketing), et le respect de nos obligations légales.
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">5. Durée de conservation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vos données personnelles sont conservées pendant toute la durée de votre relation avec EduSky, puis archivées 
              conformément aux délais légaux applicables (généralement 3 à 5 ans après la fin de la relation contractuelle).
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">6. Partage des données</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Nos prestataires techniques (hébergement, bases de données) dans le cadre de l'exécution du service.</li>
              <li>Les autorités compétentes lorsque la loi l'exige.</li>
            </ul>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">7. Vos droits</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Droit d'accès</strong> : obtenir une copie de vos données.</li>
              <li><strong className="text-foreground">Droit de rectification</strong> : corriger des données inexactes.</li>
              <li><strong className="text-foreground">Droit à l'effacement</strong> : demander la suppression de vos données.</li>
              <li><strong className="text-foreground">Droit à la portabilité</strong> : recevoir vos données dans un format structuré.</li>
              <li><strong className="text-foreground">Droit d'opposition</strong> : vous opposer à certains traitements.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pour exercer ces droits, contactez-nous à : <strong className="text-foreground">contact@edusky.fr</strong>
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">8. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              EduSky utilise des cookies essentiels au fonctionnement de la plateforme (authentification, préférences). 
              Aucun cookie de tracking publicitaire n'est utilisé sans votre consentement préalable.
            </p>
          </section>

          <section className="bg-card rounded-2xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">9. Sécurité</h2>
            <p className="text-muted-foreground leading-relaxed">
              EduSky met en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données contre tout accès 
              non autorisé, perte, altération ou divulgation. Vos données sont hébergées sur des serveurs sécurisés.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
