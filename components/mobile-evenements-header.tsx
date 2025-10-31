"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, SlidersHorizontal, CalendarDays, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CustomBottomSheet,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetTitle,
  CustomBottomSheetTrigger,
  CustomBottomSheetClose,
  CustomBottomSheetFooter,
} from "@/components/ui/custom-bottom-sheet"

const iconMap = {
  CalendarDays,
  MapPin,
}

interface MobileEvenementsHeaderProps {
  allCategories: { id: string; nom: string; slug: string }[];
  onSearchChange: (searchTerm: string) => void;
  onFilterChange: (filters: Record<string, string | number | undefined>) => void;
  currentFilters: Record<string, string | number | undefined>;
  gradient: string;
}

export function MobileEvenementsHeader({
  allCategories,
  onSearchChange,
  onFilterChange,
  currentFilters,
  gradient,
}: MobileEvenementsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");

  useEffect(() => {
    setSearchTerm(currentFilters.search || "");
  }, [currentFilters.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleCategoryChange = (slug: string) => {
    onFilterChange({ ...currentFilters, categorySlug: slug === "all" ? undefined : slug });
  };

  const handleFilterOptionChange = (filterName: string, value: string | number | undefined) => {
    onFilterChange({ ...currentFilters, [filterName]: value });
  };

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
        { label: "En ligne", value: "en_ligne" }, // Assuming 'en_ligne' is a possible value for lieu or mode
        // Add more specific locations if needed, or make this a text input
      ],
    },
  ];

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      {/* 1. Barre de titre avec bouton retour */}
      <div className="flex items-center gap-1 px-4 py-1 border-b border-border">
                  <Button onClick={() => router.back()} size="icon" className={cn("h-9 w-9 rounded-full", gradient, "text-white")}>
                    <ArrowLeft size={20} />
                  </Button>        <h2 className="text-lg font-bold text-foreground">Événements</h2>
        <Button variant="default" size="sm" className={cn("ml-auto rounded-full", gradient, "text-white")}>
          Proposer un événement
        </Button>
      </div>

      {/* 2. Barre de recherche */}
      <div className="px-4 py-1 border-b border-border">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Rechercher un événement..."
            className="pl-10 h-10 rounded-xl border-border/50 focus:ring-2 focus:ring-orange-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* 3. Barre de filtres */}
      <div className="flex items-center gap-1 px-4 py-1 border-b border-border">
        {filtersConfig.map((filter, index) => {
          const Icon = iconMap[filter.icon as keyof typeof iconMap];
          const currentValue = currentFilters[filter.name];
          const displayValue = filter.options.find(opt => opt.value === currentValue)?.label || filter.label;

          return (
            <CustomBottomSheet key={index}>
              <CustomBottomSheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "rounded-xl bg-transparent text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700",
                    currentValue && "bg-orange-100 border-orange-300"
                  )}
                >
                  <Icon size={16} className="mr-1" />
                  {displayValue}
                </Button>
              </CustomBottomSheetTrigger>
              <CustomBottomSheetContent>
                <CustomBottomSheetHeader>
                  <CustomBottomSheetTitle>Filtrer par {filter.label}</CustomBottomSheetTitle>
                </CustomBottomSheetHeader>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {filter.options.map((option) => (
                    <Button
                      key={option.label}
                      variant={currentValue === option.value ? "default" : "outline"}
                      onClick={() => handleFilterOptionChange(filter.name, option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                <CustomBottomSheetFooter>
                  <CustomBottomSheetClose asChild>
                    <Button>Appliquer</Button>
                  </CustomBottomSheetClose>
                </CustomBottomSheetFooter>
              </CustomBottomSheetContent>
            </CustomBottomSheet>
          );
        })}
        <Button variant="outline" size="sm" className="rounded-xl ml-auto bg-transparent">
          <SlidersHorizontal size={16} />
        </Button>
      </div>

      {/* 4. Barre de catégories */}
      <div className="overflow-x-auto border-b-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="flex gap-1 px-4 py-1 min-w-max">
          <Button
            key="all"
            variant={currentFilters.categorySlug === undefined ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full whitespace-nowrap transition-all",
              currentFilters.categorySlug === undefined && `bg-gradient-to-r ${gradient} text-white border-0`
            )}
            onClick={() => handleCategoryChange("all")}
          >
            Toutes les catégories
          </Button>
          {allCategories.map((category) => (
            <Button
              key={category.slug}
              variant={currentFilters.categorySlug === category.slug ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full whitespace-nowrap transition-all",
                currentFilters.categorySlug === category.slug && `bg-gradient-to-r ${gradient} text-white border-0`
              )}
              onClick={() => handleCategoryChange(category.slug)}
            >
              {category.nom}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
