'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { getAllArticles, getDistinctArticleTags } from "@/app/blog/get-data"
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
  Tag,
  Eye,
  Heart,
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
import { BlogSidebar } from "./ui/blog-sidebar"

const iconMap: { [key: string]: React.ElementType } = {
  Calendar,
  Flame,
  ListFilter,
  Tag,
  Eye,
  Heart,
}

interface BlogFilterWrapperProps {
  gradient?: string
}

export function BlogFilterWrapper({ gradient }: BlogFilterWrapperProps) {
  const router = useRouter()
  const [allArticles, setAllArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Available tags
  const [availableTags, setAvailableTags] = useState<string[]>([])

  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlugs: undefined,
    dateFilter: undefined,
    sortBy: "new",
    statut: undefined,
    tags: undefined,
    min_vues: undefined,
    min_likes: undefined,
  })

  useEffect(() => {
    const fetchArticlesAndFavorites = async () => {
      setIsLoading(true)
      const supabase = createClient()
      const { data: { user } = {} } = await supabase.auth.getUser()
      const currentUserId = user?.id

      const { data: articlesData } = await getAllArticles()
      let fetchedArticles = articlesData || []

      if (currentUserId) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favoris')
          .select('item_id')
          .eq('user_id', currentUserId)
          .eq('type_item', 'article')

        if (favoritesError) console.error("Error fetching user favorites:", favoritesError)
        else {
          const favoriteItemIds = new Set(favoritesData.map(fav => fav.item_id))
          fetchedArticles = fetchedArticles.map((article: any) => ({
            ...article,
            is_favorited: favoriteItemIds.has(article.id),
          }))
        }
      }

      setAllArticles(fetchedArticles)
      setIsLoading(false)
    }
    fetchArticlesAndFavorites()
  }, [])

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      const { data: tagsData } = await getDistinctArticleTags();
      if (tagsData) {
        setAvailableTags(tagsData);
      }
    };
    fetchTags();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredArticles = useMemo(() => {
    const now = new Date()
    const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisYearStart = new Date(now.getFullYear(), 0, 1)

    let articles = [...allArticles]

    articles = articles.filter(article => {
      const articleDate = new Date(article.publie_at)

      const searchMatch =
        !filters.search ||
        article.titre?.toLowerCase().includes(filters.search.toLowerCase())

      const categoryMatch =
        !filters.categorySlugs ||
        filters.categorySlugs.includes(article.categorie_slug)

      const statusMatch = !filters.statut || article.statut === filters.statut

      const dateMatch = (() => {
        if (!filters.dateFilter) return true
        switch (filters.dateFilter) {
          case "this_week": return articleDate >= thisWeekStart
          case "this_month": return articleDate >= thisMonthStart
          case "this_year": return articleDate >= thisYearStart
          default: return true
        }
      })()

      // Tags filter
      const tagsMatch = !filters.tags || (
        article.tags &&
        Array.isArray(article.tags) &&
        article.tags.includes(filters.tags)
      )

      // Popularity filters
      const vuesMatch = !filters.min_vues || (article.vues || 0) >= filters.min_vues
      const likesMatch = !filters.min_likes || (article.likes_count || 0) >= filters.min_likes

      return searchMatch && categoryMatch && statusMatch && dateMatch &&
        tagsMatch && vuesMatch && likesMatch
    })

    articles.sort((a, b) => {
      switch (filters.sortBy) {
        case "popular": return (b.vues || 0) - (a.vues || 0)
        case "trending": return (b.likes_count || 0) - (a.likes_count || 0)
        case "new":
        default: return new Date(b.publie_at).getTime() - new Date(a.publie_at).getTime()
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

  const popularityFiltersConfig = [
    {
      label: "Vues minimales",
      icon: "Eye",
      name: "min_vues",
      options: [
        { label: "Toutes", value: undefined },
        { label: "100+", value: 100 },
        { label: "500+", value: 500 },
        { label: "1000+", value: 1000 },
      ],
    },
    {
      label: "Likes minimaux",
      icon: "Heart",
      name: "min_likes",
      options: [
        { label: "Tous", value: undefined },
        { label: "10+", value: 10 },
        { label: "50+", value: 50 },
        { label: "100+", value: 100 },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 lg:px-8">
      {/* Mobile-only Filter UI */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
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

          <div className="px-4 py-2 border-b">
            <form onSubmit={e => e.preventDefault()} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Rechercher un article..."
                className="pl-10 h-10 rounded-xl border-border/50"
                value={filters.search}
                onChange={e => handleFilterChange("search", e.target.value)}
              />
            </form>
          </div>

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
              const displayValue = filter.options.find(opt => opt.value === filters[filter.name])?.label || filter.label
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
                      <CustomBottomSheetTitle>{filter.label}</CustomBottomSheetTitle>
                    </CustomBottomSheetHeader>
                    <div className="grid grid-cols-2 gap-2 px-4">
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
                  </CustomBottomSheetContent>
                </CustomBottomSheet>
              )
            })}
            {/* Tags filter in mobile */}
            {availableTags.length > 0 && (
              <CustomBottomSheet>
                <CustomBottomSheetTrigger asChild>
                  <Button variant={filters.tags !== undefined ? "default" : "outline"} size="sm" className="rounded-xl">
                    <Tag size={16} className="mr-1.5" />
                    {filters.tags || "Tags"}
                  </Button>
                </CustomBottomSheetTrigger>
                <CustomBottomSheetContent>
                  <CustomBottomSheetHeader>
                    <CustomBottomSheetTitle>Filtrer par Tags</CustomBottomSheetTitle>
                  </CustomBottomSheetHeader>
                  <div className="grid grid-cols-2 gap-2">
                    <CustomBottomSheetClose asChild>
                      <Button
                        variant={filters.tags === undefined ? "default" : "outline"}
                        onClick={() => handleFilterChange("tags", undefined)}
                      >
                        Tous les tags
                      </Button>
                    </CustomBottomSheetClose>
                    {availableTags.map(tag => (
                      <CustomBottomSheetClose asChild key={tag}>
                        <Button
                          variant={filters.tags === tag ? "default" : "outline"}
                          onClick={() => handleFilterChange("tags", tag)}
                        >
                          {tag}
                        </Button>
                      </CustomBottomSheetClose>
                    ))}
                  </div>
                </CustomBottomSheetContent>
              </CustomBottomSheet>
            )}

            {/* Popularity filters in mobile */}
            {popularityFiltersConfig.map(filter => {
              const Icon = iconMap[filter.icon as keyof typeof iconMap]
              const displayValue = filter.options.find(opt => opt.value === filters[filter.name])?.label || filter.label
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
                      <CustomBottomSheetTitle>{filter.label}</CustomBottomSheetTitle>
                    </CustomBottomSheetHeader>
                    <div className="grid grid-cols-2 gap-2 px-4">
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
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between mb-6 mt-8">
        <div>
          <h2 className="text-2xl font-bold">Tous les articles</h2>
          <p className="text-muted-foreground">Explorez nos conseils, actualités et ressources</p>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
          {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex gap-8 lg:animate-fade-in-up mt-2">
        <div className="hidden lg:block w-full max-w-xs mt-2 lg:animate-fade-in-left lg:animation-delay-300">
          <BlogSidebar
            filters={filters}
            handleFilterChange={handleFilterChange}
            filtersConfig={filtersConfig}
            popularityFiltersConfig={popularityFiltersConfig}
            availableTags={availableTags}
          />
        </div>
        <div className="flex-1 py-2">
          <ArticlesList articles={filteredArticles} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
