'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client" // Import client-side supabase client
import { getEvenements } from "@/lib/data/evenements"
import { EvenementsList } from "@/app/evenements/evenements-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  MapPin,
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
  CalendarDays,
  MapPin,
}

interface EvenementsFilterWrapperProps {
  gradient: string
}

export function EvenementsFilterWrapper({
  gradient,
}: EvenementsFilterWrapperProps) {
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Record<string, any>>({
    search: "",
    categorySlugs: undefined, // Changed
    dateFilter: undefined,
    location: undefined,
  })

  useEffect(() => {
    const fetchEventsAndFavorites = async () => {
      setIsLoading(true)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      // Fetch all events
      const { data: eventsData } = await getEvenements({})
      let fetchedEvents = eventsData || [];

      // If user is logged in, fetch their favorites
      if (currentUserId) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favoris')
          .select('item_id')
          .eq('user_id', currentUserId)
          .eq('type_item', 'evenement'); // Specify type_item for evenements

        if (favoritesError) {
          console.error("Error fetching user favorites:", favoritesError);
        } else {
          const favoriteItemIds = new Set(favoritesData.map(fav => fav.item_id));
          fetchedEvents = fetchedEvents.map((event: any) => ({
            ...event,
            is_favorited: favoriteItemIds.has(event.id)
          }));
        }
      }
      
      setAllEvents(fetchedEvents);
      setIsLoading(false);
    }
    fetchEventsAndFavorites();
  }, [])

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredEvents = useMemo(() => {
    const now = new Date()
    const today = new Date(now.setHours(0, 0, 0, 0))
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (7 - today.getDay())
    )
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    return allEvents.filter(event => {
      const eventDate = new Date(event.date_debut)

      const searchMatch =
        !filters.search ||
        event.titre?.toLowerCase().includes(filters.search.toLowerCase())

      // Updated category matching logic
      const categoryMatch =
        !filters.categorySlugs ||
        filters.categorySlugs.includes(event.categories.slug)

      const locationMatch =
        !filters.location || event.mode === filters.location

      const dateMatch = (() => {
        if (!filters.dateFilter) return true
        switch (filters.dateFilter) {
          case "today":
            return eventDate.toDateString() === today.toDateString()
          case "this_week":
            return eventDate >= today && eventDate <= endOfWeek
          case "this_month":
            return eventDate >= today && eventDate <= endOfMonth
          case "upcoming":
            return eventDate >= today
          default:
            return true
        }
      })()

      return searchMatch && categoryMatch && locationMatch && dateMatch
    })
  }, [filters, allEvents])

  const filtersConfig = [
    {
      label: "Date",
      icon: "CalendarDays",
      name: "dateFilter",
      options: [
        { label: "Toutes", value: undefined },
        { label: "Aujourd'hui", value: "today" },
        { label: "Cette semaine", value: "this_week" },
        { label: "Ce mois", value: "this_month" },
        { label: "À venir", value: "upcoming" },
      ],
    },
    {
      label: "Lieu",
      icon: "MapPin",
      name: "location",
      options: [
        { label: "Tous", value: undefined },
        { label: "En ligne", value: "en_ligne" },
        { label: "Présentiel", value: "presentiel" },
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
              placeholder="Rechercher un événement..."
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

        {/* Barre de catégories (REPLACED) */}
        <HorizontalCategoryNav
          scope="event"
          selectedSlugs={filters.categorySlugs}
          onCategorySelect={(slugs) => handleFilterChange("categorySlugs", slugs)}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <EvenementsList events={filteredEvents} isLoading={isLoading} />
      </div>
    </>
  )
}