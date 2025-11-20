'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client" // Import client-side supabase client
import { getArticles } from "@/lib/data/articles"
import { ArticlesList } from "@/app/blog/articles-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Flame,
  ListFilter,
  ArrowLeft,
} from "lucide-react"
import {
  CustomBottomSheet,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetTitle,
  CustomBottomSheetTrigger,
  CustomBottomSheetClose,
} from "@/components/ui/custom-bottom-sheet"
import { HorizontalCategoryNav } from "./categories/HorizontalCategoryNav"

const iconMap: { [key: string]: React.ElementType } = {
  Calendar,
  Flame,
  ListFilter,
}

interface BlogFilterWrapperProps {
  gradient: string
}

export function BlogFilterWrapper({
  gradient,
}: BlogFilterWrapperProps) {
  const router = useRouter();
  const [allArticles, setAllArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlugs: undefined, // Changed
    dateFilter: undefined,
    sortBy: "new",
    statut: undefined,
  })

  useEffect(() => {
    const fetchArticlesAndFavorites = async () => {
      setIsLoading(true)
      const supabase = createClient();
      const { data: { user } = {} } = await supabase.auth.getUser(); // Added default empty object for destructuring
      const currentUserId = user?.id;

      // Fetch all articles
      const { data: articlesData } = await getArticles({})
      let fetchedArticles = articlesData || [];

      // If user is logged in, fetch their favorites
      if (currentUserId) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favoris')
          .select('item_id')
          .eq('user_id', currentUserId)
          .eq('type_item', 'article'); // Specify type_item for articles

        if (favoritesError) {
          console.error("Error fetching user favorites:", favoritesError);
        } else {
          const favoriteItemIds = new Set(favoritesData.map(fav => fav.item_id));
          fetchedArticles = fetchedArticles.map((article: any) => ({
            ...article,
            is_favorited: favoriteItemIds.has(article.id)
          }));
        }
      }
      
      setAllArticles(fetchedArticles);
      setIsLoading(false);
    }
    fetchArticlesAndFavorites();
  }, [])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredArticles = useMemo(() => {
    const now = new Date()
    const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisYearStart = new Date(now.getFullYear(), 0, 1)

    let articles = [...allArticles]

    // 1. Filtering
    articles = articles.filter(article => {
      const articleDate = new Date(article.publie_at)

      const searchMatch =
        !filters.search ||
        article.titre?.toLowerCase().includes(filters.search.toLowerCase())

      // Updated category matching logic
      const categoryMatch =
        !filters.categorySlugs ||
        filters.categorySlugs.includes(article.categories.slug)
      
      const statusMatch = !filters.statut || article.statut === filters.statut

      const dateMatch = (() => {
        if (!filters.dateFilter) return true
        switch (filters.dateFilter) {
          case "this_week":
            return articleDate >= thisWeekStart
          case "this_month":
            return articleDate >= thisMonthStart
          case "this_year":
            return articleDate >= thisYearStart
          default:
            return true
        }
      })()

      return searchMatch && categoryMatch && statusMatch && dateMatch
    })

    // 2. Sorting
    articles.sort((a, b) => {
      switch (filters.sortBy) {
        case "popular":
          return (b.vues || 0) - (a.vues || 0)
        case "trending":
          return (b.likes_count || 0) - (a.likes_count || 0)
        case "new":
        default:
          return (
            new Date(b.publie_at).getTime() - new Date(a.publie_at).getTime()
          )
      }
    })

    return articles
  }, [filters, allArticles])

  const filtersConfig = [
    {
      label: "Date",
      icon: "Calendar",
      name: "dateFilter",
      options: [
        { label: "Date", value: undefined },
        { label: "Cette semaine", value: "this_week" },
        { label: "Ce mois", value: "this_month" },
        { label: "Cette année", value: "this_year" },
      ],
    },
    {
      label: "Statut",
      icon: "ListFilter",
      name: "statut",
      options: [
        { label: "Statut", value: undefined },
        { label: "Publié", value: "publie" },
        { label: "Brouillon", value: "brouillon" },
      ],
    },
    {
      label: "Trier par",
      icon: "Flame",
      name: "sortBy",
      options: [
        { label: "Récents", value: "new" },
        { label: "Populaires", value: "popular" },
        { label: "Tendances", value: "trending" },
      ],
    },
  ]

  return (
    <>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        {/* Mobile-only back button */}
        <div className="md:hidden px-4 py-2 border-b flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="p-0 h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
          </Button>
          <span className="text-lg font-semibold ml-2">Blogs</span>
        </div>
        {/* Barre de recherche */}
        <div className="px-4 py-2 border-b">
          <form onSubmit={e => e.preventDefault()} className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Rechercher un article..."
              className="pl-10 h-10 rounded-xl border-border/50"
              value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
            />
          </form>
        </div>

        {/* Barre de filtres */}
        <div className="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <CustomBottomSheet>
            <CustomBottomSheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl">
                <SlidersHorizontal size={16} />
              </Button>
            </CustomBottomSheetTrigger>
            <CustomBottomSheetContent>
              <CustomBottomSheetHeader>
                <CustomBottomSheetTitle>Tous les filtres</CustomBottomSheetTitle>
              </CustomBottomSheetHeader>
              <div className="grid gap-4 py-4">
                {filtersConfig.map(filter => (
                  <div key={filter.name}>
                    <h4 className="font-semibold mb-2">{filter.label}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {filter.options.map(option => (
                        <CustomBottomSheetClose asChild key={option.label}>
                          <Button
                            variant={filters[filter.name] === option.value ? "default" : "outline"}
                            onClick={() => handleFilterChange(filter.name, option.value)}
                          >
                            {option.label}
                          </Button>
                        </CustomBottomSheetClose>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CustomBottomSheetContent>
          </CustomBottomSheet>
          {filtersConfig.map(filter => {
            const Icon = iconMap[filter.icon as keyof typeof iconMap]
            const displayValue =
              filter.options.find(opt => opt.value === filters[filter.name])
                ?.label || filter.label
            return (
              <CustomBottomSheet key={filter.name}>
                <CustomBottomSheetTrigger asChild>
                  <Button variant={filters[filter.name] !== undefined ? "default" : "outline"} size="sm" className="rounded-xl">
                    {Icon && <Icon size={16} className="mr-1.5" />}
                    {displayValue}
                  </Button>
                </CustomBottomSheetTrigger>
                <CustomBottomSheetContent>
                  <CustomBottomSheetHeader>
                    <CustomBottomSheetTitle>
                      {filter.label}
                    </CustomBottomSheetTitle>
                  </CustomBottomSheetHeader>
                  <div className="grid grid-cols-2 gap-2 px-4">
                    {filter.options.map(option => (
                      <CustomBottomSheetClose asChild key={option.label}>
                        <Button
                          variant={
                            filters[filter.name] === option.value
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleFilterChange(filter.name, option.value)
                          }
                        >
                          {option.label}
                        </Button>
                      </CustomBottomSheetClose>
                    ))}
                  </div>
                </CustomBottomSheetContent>
              </CustomBottomSheet>
            )
          })}
        </div>

        <HorizontalCategoryNav
          scope="blog"
          selectedSlugs={filters.categorySlugs}
          onCategorySelect={(slugs) => handleFilterChange("categorySlugs", slugs)}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <ArticlesList articles={filteredArticles} isLoading={isLoading} />
      </div>
    </>
  )
}