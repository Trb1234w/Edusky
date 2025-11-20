'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client" // Import client-side supabase client
import { getFormations } from "@/lib/data/formations"
import { FormationsList } from "@/app/formations/formations-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  SlidersHorizontal,
  Award,
  Computer,
  BarChartHorizontal,
  Clock,
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
  BarChartHorizontal,
  Computer,
  Award,
  Clock,
}

interface FormationsFilterWrapperProps {
  // allCategories is no longer needed
}

export function FormationsFilterWrapper({}: FormationsFilterWrapperProps) {
  const [allFormations, setAllFormations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlugs: undefined, // Use array for slugs
    niveau: undefined,
    mode: undefined,
    certificat: undefined,
    duree_heures: undefined,
    maxPrice: undefined,
    minRating: undefined,
  })

  useEffect(() => {
    const fetchFormationsAndFavorites = async () => {
      setIsLoading(true)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      // Fetch all formations
      const { data: formationsData } = await getFormations({})
      let fetchedFormations = formationsData || [];

      // If user is logged in, fetch their favorites
      if (currentUserId) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favoris')
          .select('item_id')
          .eq('user_id', currentUserId)
          .eq('type_item', 'formation'); // Specify type_item for formations

        if (favoritesError) {
          console.error("Error fetching user favorites:", favoritesError);
        } else {
          const favoriteItemIds = new Set(favoritesData.map(fav => fav.item_id));
          fetchedFormations = fetchedFormations.map((formation: any) => ({
            ...formation,
            is_favorited: favoriteItemIds.has(formation.id)
          }));
        }
      }
      
      setAllFormations(fetchedFormations);
      setIsLoading(false);
    }
    fetchFormationsAndFavorites();
  }, []) // Fetch only once on mount

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // The useEffect already handles refetching
  }

  // The client-side filtering logic remains as a fallback or primary method
  const filteredFormations = useMemo(() => {
    return allFormations.filter(formation => {
      const searchMatch =
        !filters.search ||
        formation.titre?.toLowerCase().includes(filters.search.toLowerCase())

      const categoryMatch =
        !filters.categorySlugs ||
        filters.categorySlugs.includes(formation.categorie_slug)

      const niveauMatch = !filters.niveau || formation.niveau === filters.niveau
      const modeMatch = !filters.mode || formation.mode === filters.mode
      const certificatMatch =
        filters.certificat === undefined ||
        (filters.certificat === "true" && formation.certificat) ||
        (filters.certificat === "false" && !formation.certificat)
      
      const dureeMatch = (() => {
        if (!filters.duree_heures) return true;
        const duree = formation.duree_heures || 0;
        const [min, max] = filters.duree_heures.split('-').map(Number);
        if (filters.duree_heures === "10+") {
            return duree >= 10;
        }
        return duree >= min && duree < max;
      })();

      const ratingMatch =
        !filters.minRating ||
        (formation.note_moyenne || 0) >= parseFloat(filters.minRating)
      const priceMatch =
        filters.maxPrice === undefined ||
        (filters.maxPrice === 0 &&
          (formation.prix_indicatif === 0 || !formation.prix_indicatif)) ||
        formation.prix_indicatif <= filters.maxPrice

      return (
        searchMatch &&
        categoryMatch &&
        niveauMatch &&
        modeMatch &&
        certificatMatch &&
        dureeMatch &&
        ratingMatch &&
        priceMatch
      )
    })
  }, [filters, allFormations])

  const mainFiltersConfig = [
    { label: "Niveau", name: "niveau", icon: "BarChartHorizontal", options: [ { label: "Niveau", value: undefined }, { label: "Débutant", value: "Débutant" }, { label: "Intermédiaire", value: "Intermédiaire" }, { label: "Avancé", value: "Avancé" } ] },
    { label: "Mode", name: "mode", icon: "Computer", options: [ { label: "Mode", value: undefined }, { label: "En ligne", value: "en_ligne" }, { label: "Présentiel", value: "presentiel" }, { label: "Hybride", value: "hybride" } ] },
    { label: "Certificat", name: "certificat", icon: "Award", options: [ { label: "Certificat", value: undefined }, { label: "Avec certificat", value: "true" }, { label: "Sans certificat", value: "false" } ] },
    { label: "Durée", name: "duree_heures", icon: "Clock", options: [ { label: "Durée", value: undefined }, { label: "Moins de 2h", value: "0-2" }, { label: "2h à 5h", value: "2-5" }, { label: "5h à 10h", value: "5-10" }, { label: "Plus de 10h", value: "10+" } ] },
  ]
  const secondaryFiltersConfig = [
    { label: "Prix", name: "maxPrice", options: [ { label: "Prix", value: undefined }, { label: "Gratuit", value: 0 } ] },
    { label: "Popularité", name: "minRating", options: [ { label: "Popularité", value: undefined }, { label: "4 étoiles et +", value: 4 }, { label: "3 étoiles et +", value: 3 } ] },
  ]

  return (
    <>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-2 border-b">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Rechercher une formation..."
              className="pl-10 h-10 rounded-xl border-border/50 focus:ring-2 focus:ring-primary"
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
                {[...mainFiltersConfig, ...secondaryFiltersConfig].map(filter => (
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
          {mainFiltersConfig.map(filter => {
            const Icon = iconMap[filter.icon]
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
                    <CustomBottomSheetTitle>Filtrer par {filter.label}</CustomBottomSheetTitle>
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
          scope="formation"
          selectedSlugs={filters.categorySlugs}
          onCategorySelect={(slugs) => handleFilterChange("categorySlugs", slugs)}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <FormationsList formations={filteredFormations} isLoading={isLoading} />
      </div>
    </>
  )
}
