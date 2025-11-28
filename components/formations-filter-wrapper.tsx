'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { getAllFormations, getDistinctLocations, getDistinctTags, getDistinctVenues } from "@/app/formations/get-locations"
import { FormationsList } from "@/app/formations/formations-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  Search,
  SlidersHorizontal,
  Award,
  Computer,
  BarChartHorizontal,
  Clock,
  ArrowLeft,
  MapPin,
  Building2,
  Home,
  Tag,
  Users,
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
import { FormationSidebar } from "./ui/formation-sidebar"

const iconMap: { [key: string]: React.ElementType } = {
  BarChartHorizontal,
  Computer,
  Award,
  Clock,
  MapPin,
  Building2,
  Home,
  Tag,
  Users,
}

interface FormationsFilterWrapperProps { }

interface Location {
  id: string;
  nom: string;
}

interface Ville extends Location {
  pays_id: string;
}

interface Quartier extends Location {
  ville_id: string;
}

export function FormationsFilterWrapper({ }: FormationsFilterWrapperProps) {
  const router = useRouter();
  const [allFormations, setAllFormations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Location data
  const [locations, setLocations] = useState<{
    countries: Location[];
    villes: Ville[];
    quartiers: Quartier[];
  }>({ countries: [], villes: [], quartiers: [] })

  // Available tags
  const [availableTags, setAvailableTags] = useState<string[]>([])
  // Available venues
  const [availableVenues, setAvailableVenues] = useState<string[]>([])

  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlugs: undefined,
    niveau: undefined,
    mode: undefined,
    certificat: undefined,
    duree_heures: undefined,
    maxPrice: undefined,
    minRating: undefined,
    // New filters
    pays_id: undefined,
    ville_id: undefined,
    quartier_id: undefined,
    lieu: undefined,
    tags: undefined,
    hasCapacity: undefined,
  })

  useEffect(() => {
    const fetchFormationsAndFavorites = async () => {
      setIsLoading(true)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      const { data: formationsData } = await getAllFormations()
      let fetchedFormations = formationsData || [];

      if (currentUserId) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favoris')
          .select('item_id')
          .eq('user_id', currentUserId)
          .eq('type_item', 'formation');

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
  }, [])

  // Fetch locations and tags on mount
  useEffect(() => {
    const fetchFiltersData = async () => {
      const [locationsResult, tagsResult, venuesResult] = await Promise.all([
        getDistinctLocations(),
        getDistinctTags(),
        getDistinctVenues()
      ]);

      if (locationsResult.data) {
        setLocations(locationsResult.data);
      }

      if (tagsResult.data) {
        setAvailableTags(tagsResult.data);
      }

      if (venuesResult.data) {
        setAvailableVenues(venuesResult.data);
      }
    };

    fetchFiltersData();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };

      // Cascading logic for location filters
      if (key === 'pays_id') {
        newFilters.ville_id = undefined;
        newFilters.quartier_id = undefined;
      } else if (key === 'ville_id') {
        newFilters.quartier_id = undefined;
      }

      return newFilters;
    });
  }

  // Helper functions to get filtered locations based on selections
  const getFilteredVilles = () => {
    if (!filters.pays_id) return locations.villes;
    return locations.villes.filter(v => v.pays_id === filters.pays_id);
  }

  const getFilteredQuartiers = () => {
    if (!filters.ville_id) return locations.quartiers;
    return locations.quartiers.filter(q => q.ville_id === filters.ville_id);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const filteredFormations = useMemo(() => {
    return allFormations.filter(formation => {
      const searchMatch =
        !filters.search ||
        formation.titre?.toLowerCase().includes(filters.search.toLowerCase())

      const categoryMatch =
        !filters.categorySlugs ||
        filters.categorySlugs.includes(formation.categorie?.slug)

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

      // New location filters
      const paysMatch = !filters.pays_id || formation.pays_id === filters.pays_id
      const villeMatch = !filters.ville_id || formation.ville_id === filters.ville_id
      const quartierMatch = !filters.quartier_id || formation.quartier_id === filters.quartier_id
      const lieuMatch = !filters.lieu || formation.lieu === filters.lieu

      // Tags filter
      const tagsMatch = !filters.tags || (
        formation.tags &&
        Array.isArray(formation.tags) &&
        formation.tags.includes(filters.tags)
      )

      // Capacity filter
      const capacityMatch = !filters.hasCapacity || (
        formation.capacite && formation.capacite > 0
      )

      return (
        searchMatch &&
        categoryMatch &&
        niveauMatch &&
        modeMatch &&
        certificatMatch &&
        dureeMatch &&
        ratingMatch &&
        priceMatch &&
        paysMatch &&
        villeMatch &&
        quartierMatch &&
        lieuMatch &&
        tagsMatch &&
        capacityMatch
      )
    }).map(formation => ({
      ...formation,
      professeur_full_name: formation.professeur?.profiles?.full_name || "Inconnu",
      category_nom: formation.categorie?.nom || ""
    }))
  }, [filters, allFormations])

  const mainFiltersConfig = [
    { label: "Niveau", name: "niveau", icon: "BarChartHorizontal", options: [{ label: "Niveau", value: undefined }, { label: "Débutant", value: "Débutant" }, { label: "Intermédiaire", value: "Intermédiaire" }, { label: "Avancé", value: "Avancé" }] },
    { label: "Mode", name: "mode", icon: "Computer", options: [{ label: "Mode", value: undefined }, { label: "En ligne", value: "en_ligne" }, { label: "Présentiel", value: "presentiel" }, { label: "Hybride", value: "hybride" }] },
    { label: "Certificat", name: "certificat", icon: "Award", options: [{ label: "Certificat", value: undefined }, { label: "Avec certificat", value: "true" }, { label: "Sans certificat", value: "false" }] },
    { label: "Durée", name: "duree_heures", icon: "Clock", options: [{ label: "Durée", value: undefined }, { label: "Moins de 2h", value: "0-2" }, { label: "2h à 5h", value: "2-5" }, { label: "5h à 10h", value: "5-10" }, { label: "Plus de 10h", value: "10+" }] },
  ]

  const locationFiltersConfig = [
    { label: "Pays", name: "pays_id", icon: "MapPin", options: [{ label: "Tous les pays", value: undefined }, ...locations.countries.map(c => ({ label: c.nom, value: c.id }))] },
    { label: "Ville", name: "ville_id", icon: "Building2", options: [{ label: "Toutes les villes", value: undefined }, ...getFilteredVilles().map(v => ({ label: v.nom, value: v.id }))] },
    { label: "Quartier", name: "quartier_id", icon: "Home", options: [{ label: "Tous les quartiers", value: undefined }, ...getFilteredQuartiers().map(q => ({ label: q.nom, value: q.id }))] },
    { label: "Lieu", name: "lieu", icon: "MapPin", options: [{ label: "Tous les lieux", value: undefined }, ...availableVenues.map(v => ({ label: v, value: v }))] },
  ]

  const secondaryFiltersConfig = [
    { label: "Prix", name: "maxPrice", options: [{ label: "Prix", value: undefined }, { label: "Gratuit", value: 0 }] },
    { label: "Popularité", name: "minRating", options: [{ label: "Popularité", value: undefined }, { label: "4 étoiles et +", value: 4 }, { label: "3 étoiles et +", value: 3 }] },
    { label: "Tags", name: "tags", icon: "Tag", options: [{ label: "Tous les tags", value: undefined }, ...availableTags.map(t => ({ label: t, value: t }))] },
    { label: "Capacité", name: "hasCapacity", icon: "Users", options: [{ label: "Toutes", value: undefined }, { label: "Places disponibles", value: true }] },
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
            <span className="text-lg font-semibold ml-2">Formations</span>
          </div>
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
                  {[...mainFiltersConfig, ...locationFiltersConfig, ...secondaryFiltersConfig].map(filter => (
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
                  </CustomBottomSheetContent>
                </CustomBottomSheet>
              )
            })}
            {/* Location filters in mobile */}
            {locationFiltersConfig.map(filter => {
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
            {/* Capacity filter in mobile */}
            <CustomBottomSheet>
              <CustomBottomSheetTrigger asChild>
                <Button variant={filters.hasCapacity ? "default" : "outline"} size="sm" className="rounded-xl">
                  <Users size={16} className="mr-1.5" />
                  {filters.hasCapacity ? "Places dispo" : "Capacité"}
                </Button>
              </CustomBottomSheetTrigger>
              <CustomBottomSheetContent>
                <CustomBottomSheetHeader>
                  <CustomBottomSheetTitle>Filtrer par Capacité</CustomBottomSheetTitle>
                </CustomBottomSheetHeader>
                <div className="grid grid-cols-2 gap-2">
                  <CustomBottomSheetClose asChild>
                    <Button
                      variant={filters.hasCapacity === undefined ? "default" : "outline"}
                      onClick={() => handleFilterChange("hasCapacity", undefined)}
                    >
                      Toutes
                    </Button>
                  </CustomBottomSheetClose>
                  <CustomBottomSheetClose asChild>
                    <Button
                      variant={filters.hasCapacity === true ? "default" : "outline"}
                      onClick={() => handleFilterChange("hasCapacity", true)}
                    >
                      Places disponibles
                    </Button>
                  </CustomBottomSheetClose>
                </div>
              </CustomBottomSheetContent>
            </CustomBottomSheet>
          </div>

          <HorizontalCategoryNav
            scope="formation"
            selectedSlugs={filters.categorySlugs}
            onCategorySelect={(slugs) => handleFilterChange("categorySlugs", slugs)}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex gap-8">
        <div className="hidden lg:block w-full max-w-xs mt-4 lg:animate-fade-in-left lg:animation-delay-300">
          <FormationSidebar
            filters={filters}
            handleFilterChange={handleFilterChange}
            mainFiltersConfig={mainFiltersConfig}
            secondaryFiltersConfig={secondaryFiltersConfig}
            locationFiltersConfig={locationFiltersConfig}
            locations={locations}
            availableTags={availableTags}
          />
        </div>
        <div className="flex-1 py-4 lg:animate-fade-in-up lg:animation-delay-500">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-border/50">
            <div>
              <h2 className="text-2xl font-bold">Catalogue</h2>
              <p className="text-muted-foreground text-sm">Explorez nos meilleures formations</p>
            </div>
            <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {filteredFormations.length} résultats
            </div>
          </div>

          <FormationsList formations={filteredFormations} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
