'use client'

import React, { useState, useEffect, useMemo } from "react"
import { getArticles } from "@/lib/data/articles"
import { ArticlesList } from "@/app/blog/articles-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Calendar, Flame } from "lucide-react"
import {
  CustomBottomSheet,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetTitle,
  CustomBottomSheetTrigger,
  CustomBottomSheetClose,
} from "@/components/ui/custom-bottom-sheet"

const iconMap: { [key: string]: React.ElementType } = {
  Calendar,
  Flame,
}

interface BlogFilterWrapperProps {
  allCategories: { id: string; nom: string; slug: string }[]
  gradient: string
}

export function BlogFilterWrapper({
  allCategories,
  gradient,
}: BlogFilterWrapperProps) {
  const [allArticles, setAllArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlug: undefined,
    dateFilter: undefined,
    sortBy: "new", // Default sort
  })

  useEffect(() => {
    const fetchAllArticles = async () => {
      setIsLoading(true)
      const { data } = await getArticles({})
      setAllArticles(data || [])
      setIsLoading(false)
    }
    fetchAllArticles()
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

      const categoryMatch =
        !filters.categorySlug || article.categories.slug === filters.categorySlug

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

      return searchMatch && categoryMatch && dateMatch
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
        { label: "Toutes", value: undefined },
        { label: "Cette semaine", value: "this_week" },
        { label: "Ce mois", value: "this_month" },
        { label: "Cette année", value: "this_year" },
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
          {filtersConfig.map(filter => {
            const Icon = iconMap[filter.icon as keyof typeof iconMap]
            const displayValue =
              filter.options.find(opt => opt.value === filters[filter.name])
                ?.label || filter.label
            return (
              <CustomBottomSheet key={filter.name}>
                <CustomBottomSheetTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl">
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
          <Button variant="outline" size="sm" className="rounded-xl ml-auto">
            <SlidersHorizontal size={16} />
          </Button>
        </div>

        {/* Barre de catégories */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 px-4 py-2 min-w-max">
            <Button
              key="all-categories"
              variant={!filters.categorySlug ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap transition-all"
              onClick={() => handleFilterChange("categorySlug", undefined)}
            >
              Toutes
            </Button>
            {allCategories.map(category => (
              <Button
                key={category.slug}
                variant={filters.categorySlug === category.slug ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap transition-all"
                onClick={() => handleFilterChange("categorySlug", category.slug)}
              >
                {category.nom}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <ArticlesList articles={filteredArticles} isLoading={isLoading} />
      </div>
    </>
  )
}