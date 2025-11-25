import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen } from "lucide-react"
import { BlogHero } from "@/components/blog/BlogHero"
import { BlogFilterWrapper } from "@/components/blog-filter-wrapper"

export default async function BlogPage() {
  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section */}
      <div className="hidden lg:block">
        <BlogHero />
      </div>

      {/* Le wrapper gère maintenant toute la logique de filtrage et d'affichage */}
      <BlogFilterWrapper />

    </main>
  )
}
