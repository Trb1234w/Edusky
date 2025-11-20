'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client" // Import client-side supabase client
import { getClubs } from "@/lib/data/clubs"
import { ClubsList } from "@/app/clubs/clubs-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Users, Heart, ArrowLeft } from "lucide-react"
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
  Heart,
  Users,
}

interface ClubsFilterWrapperProps {
  gradient: string
}

export function ClubsFilterWrapper({
  gradient,
}: ClubsFilterWrapperProps) {
  const router = useRouter();
  const [allClubs, setAllClubs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlugs: undefined, // Changed
    statut: "ouvert",
    minCapacite: undefined,
  })

  useEffect(() => {
    const fetchClubsAndFavorites = async () => {
      setIsLoading(true)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      // Fetch all clubs
      const { data: clubsData } = await getClubs({})
      let fetchedClubs = clubsData || [];

      // If user is logged in, fetch their favorites
      if (currentUserId) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favoris')
          .select('item_id')
          .eq('user_id', currentUserId)
          .eq('type_item', 'club'); // Specify type_item for clubs

        if (favoritesError) {
          console.error("Error fetching user favorites:", favoritesError);
        } else {
          const favoriteItemIds = new Set(favoritesData.map(fav => fav.item_id));
          fetchedClubs = fetchedClubs.map((club: any) => ({
            ...club,
            is_favorited: favoriteItemIds.has(club.id)
          }));
        }
      }
      
      setAllClubs(fetchedClubs);
      setIsLoading(false);
    }
    fetchClubsAndFavorites();
  }, [])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredClubs = useMemo(() => {
    return allClubs.filter(club => {
      const searchMatch =
        !filters.search ||
        club.nom?.toLowerCase().includes(filters.search.toLowerCase())

      // Updated category matching logic
      const categoryMatch =
        !filters.categorySlugs ||
        filters.categorySlugs.includes(club.categories.slug)

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
        { label: "Statut", value: undefined },
        { label: "Ouvert", value: "ouvert" },
        { label: "Fermé", value: "ferme" },
      ],
    },
    {
      label: "Membres",
      icon: "Users",
      name: "minCapacite",
      options: [
        { label: "Membres", value: undefined },
        { label: "10+", value: 10 },
        { label: "50+", value: 50 },
        { label: "100+", value: 100 },
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
          <span className="text-lg font-semibold ml-2">Clubs</span>
        </div>
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
        </div>
        <HorizontalCategoryNav
          scope="club"
          selectedSlugs={filters.categorySlugs}
          onCategorySelect={(slugs) => handleFilterChange("categorySlugs", slugs)}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <ClubsList clubs={filteredClubs} isLoading={isLoading} />
      </div>
    </>
  )
}