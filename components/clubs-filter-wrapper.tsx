'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { getDistinctClubTags, getDistinctClubThemes, getDistinctClubLocations, getDistinctClubLocationsData, getDistinctClubLangues } from "@/app/clubs/get-data"
import { ClubsList } from "@/app/clubs/clubs-list"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  Search,
  SlidersHorizontal,
  Users,
  Heart,
  ArrowLeft,
  Tag,
  MapPin,
  Palette,
  Building2,
  Home,
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
import { ClubSidebar } from "./ui/club-sidebar"

const iconMap: { [key: string]: React.ElementType } = {
  Users,
  Tag,
  MapPin,
  Palette,
  Building2,
  Home,
}

interface ClubsFilterWrapperProps {
  initialClubs: any[]
}

interface FilterLocation {
  id: string;
  nom: string;
}

interface Ville extends FilterLocation {
  pays_id: string;
}

interface Quartier extends FilterLocation {
  ville_id: string;
}

export function ClubsFilterWrapper({ initialClubs }: ClubsFilterWrapperProps) {
  const router = useRouter()
  const [allClubs, setAllClubs] = useState<any[]>(initialClubs)
  const [isLoading, setIsLoading] = useState(false)

  // Location data
  const [locations, setLocations] = useState<{
    countries: FilterLocation[];
    villes: Ville[];
    quartiers: Quartier[];
  }>({ countries: [], villes: [], quartiers: [] })

  // Available tags, themes, and languages
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableThemes, setAvailableThemes] = useState<string[]>([])
  const [availableLangues, setAvailableLangues] = useState<string[]>([])
  const [availableLieux, setAvailableLieux] = useState<string[]>([])

  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlugs: undefined,
    pays_id: undefined,
    ville_id: undefined,
    quartier_id: undefined,
    lieu: undefined,
    statut: undefined,
    minCapacite: undefined,
    theme_principal: undefined,
    type_cotisation: undefined,
    prix_inscription: undefined,
    niveau_requis: undefined,
    placesDisponibles: undefined,
    langues: undefined,
    tags: undefined,
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Sync with initialClubs if they change
  useEffect(() => {
    setAllClubs(initialClubs);
  }, [initialClubs]);

  // Fetch locations, tags, themes, and languages on mount
  useEffect(() => {
    const fetchFiltersData = async () => {
      const [locationsResult, tagsResult, themesResult, languesResult] = await Promise.all([
        getDistinctClubLocationsData(),
        getDistinctClubTags(),
        getDistinctClubThemes(),
        getDistinctClubLangues()
      ]);

      if (locationsResult.data) {
        setLocations(locationsResult.data);
        // Extract unique lieux
        const lieux = initialClubs
          .map(club => club.lieu)
          .filter((lieu, index, self) => lieu && self.indexOf(lieu) === index);
        setAvailableLieux(lieux);
      }

      if (tagsResult.data) {
        setAvailableTags(tagsResult.data);
      }

      if (themesResult.data) {
        setAvailableThemes(themesResult.data);
      }

      if (languesResult.data) {
        setAvailableLangues(languesResult.data);
      }
    };

    fetchFiltersData();
  }, [initialClubs]);

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
    setCurrentPage(1); // Reset to first page on filter change
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

  const filteredClubs = useMemo(() => {
    return allClubs.filter(club => {
      const searchMatch =
        !filters.search ||
        club.nom?.toLowerCase().includes(filters.search.toLowerCase())

      const categoryMatch =
        !filters.categorySlugs ||
        filters.categorySlugs.includes(club.categorie_slug)

      // Location filters
      const paysMatch = !filters.pays_id || club.pays_id === filters.pays_id
      const villeMatch = !filters.ville_id || club.ville_id === filters.ville_id
      const quartierMatch = !filters.quartier_id || club.quartier_id === filters.quartier_id
      const lieuMatch = !filters.lieu || club.lieu === filters.lieu

      const statutMatch = !filters.statut || club.statut === filters.statut

      const capaciteMatch = !filters.minCapacite || (
        club.nombre_membres && club.nombre_membres >= filters.minCapacite
      )

      const themeMatch = !filters.theme_principal || club.theme_principal === filters.theme_principal

      const typeCotisationMatch = !filters.type_cotisation || club.type_cotisation === filters.type_cotisation

      const prixInscriptionMatch = !filters.prix_inscription || (
        filters.prix_inscription === 'gratuit'
          ? (club.prix_inscription === 0 || club.prix_inscription === null)
          : true
      )

      const niveauMatch = !filters.niveau_requis || club.niveau_requis === filters.niveau_requis

      const placesDisponiblesMatch = !filters.placesDisponibles || (
        club.capacite_max &&
        club.nombre_membres !== null &&
        club.nombre_membres !== undefined &&
        club.nombre_membres < club.capacite_max
      )

      const langueMatch = !filters.langues || (
        club.langues &&
        Array.isArray(club.langues) &&
        club.langues.includes(filters.langues)
      )

      // Tags filter
      const tagsMatch = !filters.tags || (
        club.tags &&
        Array.isArray(club.tags) &&
        club.tags.includes(filters.tags)
      )

      return (
        searchMatch &&
        categoryMatch &&
        paysMatch &&
        villeMatch &&
        quartierMatch &&
        lieuMatch &&
        statutMatch &&
        capaciteMatch &&
        themeMatch &&
        typeCotisationMatch &&
        prixInscriptionMatch &&
        niveauMatch &&
        placesDisponiblesMatch &&
        langueMatch &&
        tagsMatch
      )
    })
  }, [filters, allClubs])

  // Pagination logic
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage)
  const paginatedClubs = filteredClubs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const filtersConfig = [
    {
      label: "Statut",
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
    {
      label: "Thème",
      icon: "Palette",
      name: "theme_principal",
      options: [
        { label: "Tous les thèmes", value: undefined },
        ...availableThemes.map(theme => ({ label: theme, value: theme }))
      ],
    },
    {
      label: "Type cotisation",
      name: "type_cotisation",
      options: [
        { label: "Tous", value: undefined },
        { label: "Gratuit", value: "gratuit" },
        { label: "Mensuelle", value: "mensuelle" },
        { label: "Annuelle", value: "annuelle" },
      ],
    },
    {
      label: "Prix inscription",
      name: "prix_inscription",
      options: [
        { label: "Tous", value: undefined },
        { label: "Gratuit", value: "gratuit" },
      ],
    },
    {
      label: "Niveau",
      name: "niveau_requis",
      options: [
        { label: "Tous", value: undefined },
        { label: "Débutant", value: "débutant" },
        { label: "Intermédiaire", value: "intermédiaire" },
        { label: "Avancé", value: "avancé" },
      ],
    },
    {
      label: "Disponibilité",
      icon: "Users",
      name: "placesDisponibles",
      options: [
        { label: "Toutes", value: undefined },
        { label: "Places disponibles", value: true },
      ],
    },
    {
      label: "Langue",
      name: "langues",
      options: [
        { label: "Toutes les langues", value: undefined },
        ...availableLangues.map(langue => ({ label: langue, value: langue }))
      ],
    },
  ]

  const locationFiltersConfig = [
    { label: "Pays", name: "pays_id", icon: "MapPin", options: [{ label: "Tous les pays", value: undefined }, ...locations.countries.map(c => ({ label: c.nom, value: c.id }))] },
    { label: "Ville", name: "ville_id", icon: "Building2", options: [{ label: "Toutes les villes", value: undefined }, ...getFilteredVilles().map(v => ({ label: v.nom, value: v.id }))] },
    { label: "Quartier", name: "quartier_id", icon: "Home", options: [{ label: "Tous les quartiers", value: undefined }, ...getFilteredQuartiers().map(q => ({ label: q.nom, value: q.id }))] },
    { label: "Lieu", name: "lieu", icon: "MapPin", options: [{ label: "Tous les lieux", value: undefined }, ...availableLieux.map(lieu => ({ label: lieu, value: lieu }))] },
  ]

  return (
    <>
      {/* Mobile-only Filter UI - Fixed at top */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          {/* Back button */}
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

          {/* Search */}
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

          {/* Filters */}
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

                  {/* Location Filters Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold mb-3">Localisation</h3>
                    {locationFiltersConfig.map(filter => (
                      <div key={filter.name} className="mb-3">
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
                    <Button
                      variant={filters[filter.name] !== undefined ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl"
                    >
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
          </div>

          <HorizontalCategoryNav
            scope="club"
            selectedSlugs={filters.categorySlugs}
            onCategorySelect={(slugs) => handleFilterChange("categorySlugs", slugs)}
          />
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header on mobile */}
      <div className="container mx-auto px-4 lg:px-8 pt-48 lg:pt-0">

        {/* Desktop layout */}
        <div className="hidden lg:flex items-center justify-between mb-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold">Tous les clubs</h2>
            <p className="text-muted-foreground">Découvrez et rejoignez des communautés passionnées</p>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
            {filteredClubs.length} club{filteredClubs.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex gap-8 lg:animate-fade-in-up mt-2">
          <div className="hidden lg:block w-full max-w-xs mt-2 lg:animate-fade-in-left lg:animation-delay-300">
            <ClubSidebar
              filters={filters}
              handleFilterChange={handleFilterChange}
              filtersConfig={filtersConfig}
              locationFiltersConfig={locationFiltersConfig}
              availableTags={availableTags}
            />
          </div>

          <div className="flex-1 py-2">
            <ClubsList clubs={paginatedClubs} isLoading={isLoading} />

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  )
}
