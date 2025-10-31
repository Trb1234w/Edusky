'use client'

import React, { useState, useEffect, useMemo } from "react"
import { getClubs } from "@/lib/data/clubs"
import { ClubsList } from "@/app/clubs/clubs-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Users, Heart } from "lucide-react"
import {
  CustomBottomSheet,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetTitle,
  CustomBottomSheetTrigger,
  CustomBottomSheetClose,
} from "@/components/ui/custom-bottom-sheet"

const iconMap: { [key: string]: React.ElementType } = {
  Heart,
  Users,
}

interface ClubsFilterWrapperProps {
  allCategories: { id: string; nom: string; slug: string }[]
  gradient: string
}

export function ClubsFilterWrapper({
  allCategories,
  gradient,
}: ClubsFilterWrapperProps) {
  const [allClubs, setAllClubs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlug: undefined,
    statut: "ouvert", // Default to open clubs
    minCapacite: undefined,
  })

  useEffect(() => {
    const fetchAllClubs = async () => {
      setIsLoading(true)
      const { data } = await getClubs({})
      setAllClubs(data || [])
      setIsLoading(false)
    }
    fetchAllClubs()
  }, [])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredClubs = useMemo(() => {
    return allClubs.filter(club => {
      const searchMatch =
        !filters.search ||
        club.nom?.toLowerCase().includes(filters.search.toLowerCase())

      const categoryMatch =
        !filters.categorySlug || club.categories.slug === filters.categorySlug

      const statusMatch = !filters.statut || club.statut === filters.statut

      const capacityMatch =
        !filters.minCapacite || club.capacite >= Number(filters.minCapacite)

      return searchMatch && categoryMatch && statusMatch && capacityMatch
    })
  }, [filters, allClubs])

  const filtersConfig = [
    {
      label: "Statut",
      icon: "Heart",
      name: "statut",
      options: [
        { label: "Tous", value: undefined },
        { label: "Ouvert", value: "ouvert" },
        { label: "Fermé", value: "ferme" },
      ],
    },
    {
      label: "Membres",
      icon: "Users",
      name: "minCapacite",
      options: [
        { label: "Tous", value: undefined },
        { label: "10+", value: 10 },
        { label: "50+", value: 50 },
        { label: "100+", value: 100 },
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
              placeholder="Rechercher un club..."
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
                      Filtrer par {filter.label}
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
        <ClubsList clubs={filteredClubs} isLoading={isLoading} />
      </div>
    </>
  )
}