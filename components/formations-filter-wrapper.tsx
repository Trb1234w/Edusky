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
import { FormationsStickyHeader } from "./formations/FormationsStickyHeader"
import { PaginationControls } from "@/components/ui/pagination-controls"

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

interface FormationsFilterWrapperProps {
  initialFormations: any[];
}

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

export function FormationsFilterWrapper({ initialFormations }: FormationsFilterWrapperProps) {
  const router = useRouter();
  const [allFormations, setAllFormations] = useState<any[]>(initialFormations)
  const [isLoading, setIsLoading] = useState(false)

  // Update state when props change (e.g. after server action revalidation)
  useEffect(() => {
    setAllFormations(initialFormations);
  }, [initialFormations]);

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
    // Nouveaux filtres pour colonnes ajoutées
    prix_inscription: undefined,
    langue_enseignement: undefined,
    placesDisponibles: undefined,
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

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

      // Prix d'inscription filter
      const prixInscriptionMatch = (() => {
        if (!filters.prix_inscription) return true;
        if (filters.prix_inscription === 'gratuit') {
          return formation.prix_inscription === 0 || formation.prix_inscription === null;
        }
        return true;
      })();

      // Langue d'enseignement filter
      const langueMatch = !filters.langue_enseignement ||
        formation.langue_enseignement === filters.langue_enseignement;

      // Places disponibles filter (nombre_inscrits < capacite)
      const placesDisponiblesMatch = !filters.placesDisponibles || (
        formation.capacite &&
        formation.nombre_inscrits !== null &&
        formation.nombre_inscrits !== undefined &&
        formation.nombre_inscrits < formation.capacite
      );

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
        capacityMatch &&
        prixInscriptionMatch &&
        langueMatch &&
        placesDisponiblesMatch
      )
    }).map(formation => ({
      ...formation,
      professeur_full_name: formation.professeur?.full_name || formation.professeur?.profiles?.full_name || "Inconnu",
      category_nom: formation.categorie?.nom || ""
    }))
  }, [filters, allFormations])

  // Pagination logic
  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage)
  const paginatedFormations = filteredFormations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
    { label: "Prix inscription", name: "prix_inscription", options: [{ label: "Tous", value: undefined }, { label: "Gratuit", value: "gratuit" }] },
    { label: "Langue", name: "langue_enseignement", options: [{ label: "Toutes", value: undefined }, { label: "Français", value: "français" }, { label: "Anglais", value: "anglais" }, { label: "Arabe", value: "arabe" }] },
    { label: "Disponibilité", name: "placesDisponibles", icon: "Users", options: [{ label: "Toutes", value: undefined }, { label: "Places disponibles", value: true }] },
  ]

  return (
    <>
      {/* Mobile-only Filter UI - Fixed at top */}
      <FormationsStickyHeader
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleSearchSubmit={handleSearchSubmit}
        mainFiltersConfig={mainFiltersConfig}
        locationFiltersConfig={locationFiltersConfig}
        secondaryFiltersConfig={secondaryFiltersConfig}
        availableTags={availableTags}
      />

      {/* Main Content with proper spacing for fixed header on mobile */}
      <div className="container mx-auto px-4 lg:px-8 pt-48 lg:pt-0">

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

            <FormationsList formations={paginatedFormations} isLoading={isLoading} />

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

