'use client'

import React, { useState, useEffect, useMemo } from "react"
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
} from "lucide-react"
import {
  CustomBottomSheet,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetTitle,
  CustomBottomSheetTrigger,
  CustomBottomSheetClose,
} from "@/components/ui/custom-bottom-sheet"

const iconMap: { [key: string]: React.ElementType } = {
  BarChartHorizontal,
  Computer,
  Award,
}

interface FormationsFilterWrapperProps {
  allCategories: { id: string; nom: string; slug: string }[]
}

export function FormationsFilterWrapper({
  allCategories,
}: FormationsFilterWrapperProps) {
  const [allFormations, setAllFormations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlug: undefined,
    niveau: undefined,
    mode: undefined,
    certificat: undefined,
    // Filtres secondaires dans "Tous les filtres"
    maxPrice: undefined,
    minRating: undefined,
  })

  useEffect(() => {
    const fetchAllFormations = async () => {
      setIsLoading(true)
      const { data } = await getFormations({})
      setAllFormations(data || [])
      setIsLoading(false)
    }
    fetchAllFormations()
  }, [])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
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
        !filters.categorySlug || formation.categorie_slug === filters.categorySlug

      const niveauMatch = !filters.niveau || formation.niveau === filters.niveau

      const modeMatch = !filters.mode || formation.mode === filters.mode

      const certificatMatch =
        filters.certificat === undefined ||
        (filters.certificat === "true" && formation.certificat) ||
        (filters.certificat === "false" && !formation.certificat)

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
        ratingMatch &&
        priceMatch
      )
    })
  }, [filters, allFormations])

  // Configuration pour les filtres principaux et secondaires
  const mainFiltersConfig = [
    {
      label: "Niveau",
      name: "niveau",
      icon: "BarChartHorizontal",
      options: [
        { label: "Tous", value: undefined },
        { label: "Débutant", value: "Débutant" },
        { label: "Intermédiaire", value: "Intermédiaire" },
        { label: "Avancé", value: "Avancé" },
      ],
    },
    {
      label: "Mode",
      name: "mode",
      icon: "Computer",
      options: [
        { label: "Tous", value: undefined },
        { label: "En ligne", value: "en_ligne" },
        { label: "Présentiel", value: "presentiel" },
        { label: "Hybride", value: "hybride" },
      ],
    },
    {
      label: "Certificat",
      name: "certificat",
      icon: "Award",
      options: [
        { label: "Tous", value: undefined },
        { label: "Avec certificat", value: "true" },
        { label: "Sans certificat", value: "false" },
      ],
    },
  ]

  const secondaryFiltersConfig = [
    {
      label: "Prix",
      name: "maxPrice",
      options: [
        { label: "Tous", value: undefined },
        { label: "Gratuit", value: 0 },
      ],
    },
    {
      label: "Popularité",
      name: "minRating",
      options: [
        { label: "Toutes", value: undefined },
        { label: "4 étoiles et +", value: 4 },
        { label: "3 étoiles et +", value: 3 },
      ],
    },
  ]

  return (
    <>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        {/* 1. Barre de Recherche */}
        <div className="px-4 py-2 border-b">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Rechercher une formation..."
              className="pl-10 h-10 rounded-xl border-border/50 focus:ring-2 focus:ring-primary"
              value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
            />
          </form>
        </div>

        {/* 2. Barre de Filtres Principaux */}
        <div className="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {mainFiltersConfig.map(filter => {
            const Icon = iconMap[filter.icon]
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

          {/* Bouton "Tous les filtres" */}
          <CustomBottomSheet>
            <CustomBottomSheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl ml-auto"
              >
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
                  </div>
                ))}
              </div>
            </CustomBottomSheetContent>
          </CustomBottomSheet>
        </div>

        {/* 3. Barre de Catégories */}
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
        <FormationsList formations={filteredFormations} isLoading={isLoading} />
      </div>
    </>
  )
}
