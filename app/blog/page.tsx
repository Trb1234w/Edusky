import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen } from "lucide-react"
import { getCategories } from "@/lib/data/categories"
import { BlogFilterWrapper } from "@/components/blog-filter-wrapper"

export default async function BlogPage() {
  const { data: allCategories, error: categoriesError } = await getCategories()

  if (categoriesError) {
    console.error("Error loading categories:", categoriesError)
    return (
      <p className="text-center text-red-500">
        Erreur lors du chargement des catégories. Veuillez réessayer plus tard.
      </p>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-1 lg:pt-20">
        {/* Hero Section */}
        <section className="hidden lg:block bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                <BookOpen size={32} className="text-white" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 text-balance">
                Blog EduSky
              </h1>
              <p className="text-lg text-white/90 leading-relaxed text-pretty">
                Conseils, actualités et ressources pour réussir votre parcours
                éducatif
              </p>
            </div>
          </div>
        </section>

        {/* Le wrapper gère maintenant toute la logique */}
        <BlogFilterWrapper
          allCategories={allCategories || []}
          gradient="from-purple-500 to-indigo-500"
        />

        {/* Newsletter CTA */}
        <section className="bg-muted/30 py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground text-balance">
              Restez informé
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
              Recevez nos meilleurs articles directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Votre email" type="email" className="h-12" />
              <Button size="lg" className="font-semibold px-8 rounded-xl">
                S'abonner
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
