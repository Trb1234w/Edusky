'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client" // Import client-side supabase client
import { getProfesseurs } from "@/lib/data/professeurs"
import { ProfesseursList } from "@/app/professeurs/professeurs-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Star, Award, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  CustomBottomSheet,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetTitle,
  CustomBottomSheetTrigger,
  CustomBottomSheetClose,
} from "@/components/ui/custom-bottom-sheet"

const iconMap: { [key: string]: React.ElementType } = {
  Star,
  Award,
}

// Les spécialités peuvent être dynamiques, mais pour la simplicité on les met en statique
const staticSpecialties = [
  { label: "Toutes", value: undefined },
  { label: "Développement Web", value: "Développement Web" },
  { label: "Design UI/UX", value: "Design UI/UX" },
  { label: "Marketing Digital", value: "Marketing Digital" },
  { label: "Langues", value: "Langues" },
  { label: "Mathématiques", value: "Mathématiques" },
]

export function ProfesseursFilterWrapper() {
  const router = useRouter();
  const [allProfesseurs, setAllProfesseurs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    specialty: undefined,
    minRating: undefined,
    hasCertifications: undefined,
    sortBy: "note_moyenne_desc",
  })

  useEffect(() => {
    const fetchProfesseursAndFavorites = async () => {
      setIsLoading(true)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      // Fetch all professeurs
      const { data: professeursData } = await getProfesseurs({})
      let fetchedProfesseurs = professeursData || [];

      // If user is logged in, fetch their favorites
      if (currentUserId) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favoris')
          .select('item_id')
          .eq('user_id', currentUserId)
          .eq('type_item', 'professeur'); // Specify type_item for professeur

        if (favoritesError) {
          console.error("Error fetching user favorites:", favoritesError);
        } else {
          const favoriteItemIds = new Set(favoritesData.map(fav => fav.item_id));
          fetchedProfesseurs = fetchedProfesseurs.map((professeur: any) => ({
            ...professeur,
            is_favorited: favoriteItemIds.has(professeur.id)
          }));
        }
      }
      
      setAllProfesseurs(fetchedProfesseurs);
      setIsLoading(false);
    }
    fetchProfesseursAndFavorites();
  }, [])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredProfesseurs = useMemo(() => {
    let professeurs = [...allProfesseurs]

    // 1. Filtering
    professeurs = professeurs.filter(prof => {
      const searchMatch =
        !filters.search ||
        prof.profiles?.full_name
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        prof.specialites?.some((spec: string) =>
          spec.toLowerCase().includes(filters.search.toLowerCase())
        )

      const specialtyMatch =
        !filters.specialty || prof.specialites?.includes(filters.specialty)

      const ratingMatch =
        !filters.minRating || prof.note_moyenne >= Number(filters.minRating)

      const certifMatch =
        filters.hasCertifications === undefined ||
        (filters.hasCertifications === "true" &&
          prof.certifications &&
          prof.certifications.length > 0) ||
        (filters.hasCertifications === "false" &&
          (!prof.certifications || prof.certifications.length === 0))

      return searchMatch && specialtyMatch && ratingMatch && certifMatch
    })

    // 2. Sorting
    professeurs.sort((a, b) => {
      switch (filters.sortBy) {
        case "nb_etudiants_formes_desc":
          return (b.nb_etudiants_formes || 0) - (a.nb_etudiants_formes || 0)
        case "created_at_desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        case "note_moyenne_desc":
        default:
          return (b.note_moyenne || 0) - (a.note_moyenne || 0)
      }
    })

    return professeurs
  }, [filters, allProfesseurs])

  const mainFiltersConfig = [
    {
      label: "Note",
      icon: "Star",
      name: "minRating",
      options: [
        { label: "Toutes", value: undefined },
        { label: "4+", value: 4 },
        { label: "3+", value: 3 },
      ],
    },
    {
      label: "Certifications",
      icon: "Award",
      name: "hasCertifications",
      options: [
        { label: "Tous", value: undefined },
        { label: "Oui", value: "true" },
        { label: "Non", value: "false" },
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
          <span className="text-lg font-semibold ml-2">Professeurs</span>
        </div>
        {/* Barre de recherche */}
        <div className="px-4 py-2 border-b">
          <form onSubmit={e => e.preventDefault()} className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Rechercher par nom, spécialité..."
              className="pl-10 h-10 rounded-xl border-border/50"
              value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
            />
          </form>
        </div>

        {/* Barre de filtres */}
        <div className="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {mainFiltersConfig.map(filter => {
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
          {/* Placeholder pour un futur bouton "Tous les filtres" */}
          <Button variant="outline" size="sm" className="rounded-xl ml-auto">
            <SlidersHorizontal size={16} />
          </Button>
        </div>

        {/* Barre de spécialités */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 px-4 py-2 min-w-max">
            {staticSpecialties.map(spec => (
              <Button
                key={spec.label}
                variant={filters.specialty === spec.value ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap transition-all"
                onClick={() => handleFilterChange("specialty", spec.value)}
              >
                {spec.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <ProfesseursList
          professeurs={filteredProfesseurs}
          isLoading={isLoading}
        />
      </div>
    </>
  )
}