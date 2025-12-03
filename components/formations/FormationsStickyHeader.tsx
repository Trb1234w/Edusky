'use client'

import React from "react"

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
import { HorizontalCategoryNav } from "../categories/HorizontalCategoryNav"

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

interface FormationsStickyHeaderProps {
    filters: Record<string, any>;
    handleFilterChange: (key: string, value: any) => void;
    handleSearchSubmit: (e: React.FormEvent) => void;
    mainFiltersConfig: any[];
    locationFiltersConfig: any[];
    secondaryFiltersConfig: any[];
    availableTags: string[];
}

export function FormationsStickyHeader({
    filters,
    handleFilterChange,
    handleSearchSubmit,
    mainFiltersConfig,
    locationFiltersConfig,
    secondaryFiltersConfig,
    availableTags,
}: FormationsStickyHeaderProps) {
    const router = useRouter();

    // Hide the static header when this component mounts
    React.useEffect(() => {
        const staticHeader = document.querySelector('[data-static-header="formations"]');
        if (staticHeader) {
            (staticHeader as HTMLElement).style.display = 'none';
        }
    }, []);

    return (
        <div className="lg:hidden" data-dynamic-header="formations">
            <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
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
                                            {filter.options.map((option: any) => (
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
                        const displayValue = filter.options.find((opt: any) => opt.value === filters[filter.name])?.label || filter.label
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
                                        {filter.options.map((option: any) => (
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
                        const displayValue = filter.options.find((opt: any) => opt.value === filters[filter.name])?.label || filter.label
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
                                        {filter.options.map((option: any) => (
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
                    onCategorySelect={(slugs: string[] | undefined) => handleFilterChange("categorySlugs", slugs)}
                />
            </div>
        </div>
    )
}
