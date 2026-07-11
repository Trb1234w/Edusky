import Link from 'next/link'
import { ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
      
      <div className="text-center max-w-2xl mx-auto space-y-8 animate-fade-in-up">
        <h1 className="text-9xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary via-secondary to-accent">
          404
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Oups ! Page introuvable
          </h2>
          <p className="text-lg text-muted-foreground">
            La page que vous recherchez semble avoir disparu, a été déplacée ou n'a jamais existé.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all w-full sm:w-auto">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full w-full sm:w-auto group">
            <Link href="/formations">
              Explorer les formations
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
