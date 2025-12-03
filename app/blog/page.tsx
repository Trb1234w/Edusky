import { getAllArticles } from "./get-data"
import { BlogFilterWrapper } from "@/components/blog-filter-wrapper"
import { BlogHero } from "@/components/blog/BlogHero"

export default async function BlogPage() {
  const { data: articles } = await getAllArticles()

  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section */}
      <div className="hidden lg:block">
        <BlogHero />
      </div>

      {/* Le wrapper gère maintenant toute la logique de filtrage et d'affichage */}
      <BlogFilterWrapper initialArticles={articles || []} />

    </main>
  )
}
