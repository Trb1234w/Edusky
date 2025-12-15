'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { getDistinctEventTags, getDistinctEventTypes } from "@/app/evenements/get-data"
import { getDistinctLocations } from "@/app/formations/get-locations"
import { EvenementsList } from "@/app/evenements/evenements-list"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
    Search,
    SlidersHorizontal,
    Video,
    Tag,
    MapPin,
    Building2,
    Home,
    Users,
    Calendar,
    ArrowLeft,
    Handshake, // Added Handshake import
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
import { EvenementSidebar } from "./ui/evenement-sidebar"
import { ProfessionalInquiryDialog } from "@/components/professional-inquiry-dialog" // Added Dialog import

const iconMap: { [key: string]: React.ElementType } = {
    Video,
    Tag,
    MapPin,
    Building2,
    Home,
    Users,
    Calendar,
}

interface EvenementsFilterWrapperProps {
    initialEvents: any[]
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

export function EvenementsFilterWrapper({ initialEvents }: EvenementsFilterWrapperProps) {
    const router = useRouter();
    const [allEvenements, setAllEvenements] = useState<any[]>(initialEvents)
    const [isLoading, setIsLoading] = useState(false)

    // Location data
    const [locations, setLocations] = useState<{
        countries: FilterLocation[];
        villes: Ville[];
        quartiers: Quartier[];
    }>({ countries: [], villes: [], quartiers: [] })

    // Available tags and types
    const [availableTags, setAvailableTags] = useState<string[]>([])
    const [availableTypes, setAvailableTypes] = useState<string[]>([])

    const [filters, setFilters] = useState<Record<string, any>>({
        search: "",
        categorySlugs: undefined,
        pays_id: undefined,
        ville_id: undefined,
        quartier_id: undefined,
        mode: undefined,
        type_evenement: undefined,
        tags: undefined,
        hasCapacity: undefined,
        dateFilter: undefined,
        // Nouveaux filtres
        prix: undefined,
        statut_evenement: undefined,
        placesDisponibles: undefined,
        is_gratuit: undefined,
    })

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    // Sync with initialEvents if they change (e.g. after server action revalidation)
    useEffect(() => {
        setAllEvenements(initialEvents);
    }, [initialEvents]);

    // Fetch locations, tags, and types on mount
    useEffect(() => {
        const fetchFiltersData = async () => {
            const [locationsResult, tagsResult, typesResult] = await Promise.all([
                getDistinctLocations(),
                getDistinctEventTags(),
                getDistinctEventTypes()
            ]);

            if (locationsResult.data) {
                setLocations(locationsResult.data);
            }

            if (tagsResult.data) {
                setAvailableTags(tagsResult.data);
            }

            if (typesResult.data) {
                setAvailableTypes(typesResult.data);
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

    const filteredEvenements = useMemo(() => {
        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        return allEvenements.filter(evenement => {
            const searchMatch =
                !filters.search ||
                evenement.titre?.toLowerCase().includes(filters.search.toLowerCase())

            const categoryMatch =
                !filters.categorySlugs ||
                filters.categorySlugs.includes(evenement.categorie_slug)

            // Location filters
            const paysMatch = !filters.pays_id || evenement.pays_id === filters.pays_id
            const villeMatch = !filters.ville_id || evenement.ville_id === filters.ville_id
            const quartierMatch = !filters.quartier_id || evenement.quartier_id === filters.quartier_id

            const modeMatch = !filters.mode || evenement.mode === filters.mode

            const typeMatch = !filters.type_evenement ||
                evenement.type_evenement === filters.type_evenement

            // Tags filter
            const tagsMatch = !filters.tags || (
                evenement.tags &&
                Array.isArray(evenement.tags) &&
                evenement.tags.includes(filters.tags)
            )

            // Capacity filter
            const capacityMatch = !filters.hasCapacity || (
                evenement.capacite && evenement.capacite > 0
            )

            // Date filter
            const dateMatch = (() => {
                if (!filters.dateFilter) return true
                const eventDate = new Date(evenement.date_debut)
                switch (filters.dateFilter) {
                    case "today": return eventDate >= todayStart
                    case "this_week": return eventDate >= weekStart
                    case "this_month": return eventDate >= monthStart
                    default: return true
                }
            })()

            // Prix filter
            const prixMatch = (() => {
                if (!filters.prix) return true;
                if (filters.prix === 'gratuit') {
                    return evenement.est_gratuit || evenement.prix === 0 || evenement.prix === null;
                }
                return true;
            })();

            // Statut filter
            const statutMatch = !filters.statut_evenement ||
                evenement.statut_evenement === filters.statut_evenement;

            // Places disponibles filter
            const placesDisponiblesMatch = !filters.placesDisponibles || (
                evenement.capacite &&
                evenement.nombre_participants !== null &&
                evenement.nombre_participants !== undefined &&
                evenement.nombre_participants < evenement.capacite
            );

            const isGratuitMatch = !filters.is_gratuit || evenement.est_gratuit === true || evenement.prix === 0 || evenement.prix === null;

            return (
                searchMatch &&
                categoryMatch &&
                paysMatch &&
                villeMatch &&
                quartierMatch &&
                modeMatch &&
                typeMatch &&
                tagsMatch &&
                capacityMatch &&
                dateMatch &&
                prixMatch &&
                statutMatch &&
                placesDisponiblesMatch &&
                isGratuitMatch
            )
        })
    }, [filters, allEvenements])

    // Pagination logic
    const totalPages = Math.ceil(filteredEvenements.length / itemsPerPage)
    const paginatedEvenements = filteredEvenements.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const mainFiltersConfig = [
        {
            name: "mode",
            label: "Mode",
            icon: "Video",
            options: [
                { label: "Mode", value: undefined },
                { label: "En ligne", value: "en_ligne" },
                { label: "Présentiel", value: "presentiel" },
                { label: "Hybride", value: "hybride" }
            ]
        },
        {
            name: "type_evenement",
            label: "Type",
            icon: "Tag",
            options: [
                { label: "Type", value: undefined },
                ...availableTypes.map(type => ({ label: type, value: type }))
            ]
        }
    ]

    const locationFiltersConfig = [
        {
            name: "pays_id",
            label: "Pays",
            icon: "MapPin",
            options: [
                { label: "Tous les pays", value: undefined },
                ...locations.countries.map(c => ({ label: c.nom, value: c.id }))
            ]
        },
        {
            name: "ville_id",
            label: "Ville",
            icon: "Building2",
            options: [
                { label: "Toutes les villes", value: undefined },
                ...getFilteredVilles().map(v => ({ label: v.nom, value: v.id }))
            ]
        },
        {
            name: "quartier_id",
            label: "Quartier",
            icon: "Home",
            options: [
                { label: "Tous les quartiers", value: undefined },
                ...getFilteredQuartiers().map(q => ({ label: q.nom, value: q.id }))
            ]
        }
    ]

    const secondaryFiltersConfig = [
        {
            name: "dateFilter",
            label: "Date",
            icon: "Calendar",
            options: [
                { label: "Date", value: undefined },
                { label: "Aujourd'hui", value: "today" },
                { label: "Cette semaine", value: "this_week" },
                { label: "Ce mois", value: "this_month" }
            ]
        },
        {
            name: "hasCapacity",
            label: "Capacité",
            icon: "Users",
            options: [
                { label: "Capacité", value: undefined },
                { label: "Places disponibles", value: true }
            ]
        },
        {
            name: "prix",
            label: "Prix",
            options: [
                { label: "Prix", value: undefined },
                { label: "Gratuit", value: "gratuit" }
            ]
        },
        {
            name: "statut_evenement",
            label: "Statut",
            options: [
                { label: "Statut", value: undefined },
                { label: "Ouvert", value: "ouvert" },
                { label: "Complet", value: "complet" },
                { label: "Annulé", value: "annule" },
                { label: "Reporté", value: "reporte" }
            ]
        },
        {
            name: "placesDisponibles",
            label: "Disponibilité",
            icon: "Users",
            options: [
                { label: "Disponibilité", value: undefined },
                { label: "Places disponibles", value: true }
            ]
        }
    ]

    return (
        <>
            {/* Mobile-only Filter UI - Fixed at top */}
            <div className="lg:hidden">
                <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
                    <div className="md:hidden px-4 py-2 border-b flex items-center justify-between"> {/* Added justify-between */}
                        <div className="flex items-center"> {/* New div to group back button and title */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-0 h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft size={16} />
                            </Button>
                            <span className="text-lg font-semibold ml-2">Événements</span>
                        </div>
                        <ProfessionalInquiryDialog
                            inquiryType="sponsor_evenement"
                            dialogTitle="Sponsoriser un événement"
                            dialogDescription="Vous souhaitez associer votre marque à nos événements ? Remplissez ce formulaire et nous vous contacterons pour discuter des opportunités."
                            triggerButton={
                                <Button size="sm">
                                    <Handshake size={16} className="mr-2" />
                                    Sponsoriser
                                </Button>
                            }
                        />
                    </div>                    <div className="px-4 py-2 border-b">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Rechercher un événement..."
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
                        {/* Secondary filters in mobile */}
                        {secondaryFiltersConfig.map(filter => {
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
                    </div>

                    <HorizontalCategoryNav
                        scope="event"
                        selectedSlugs={filters.categorySlugs}
                        onCategorySelect={(slugs) => handleFilterChange("categorySlugs", slugs)}
                    />
                </div>
            </div>

            {/* Main Content with proper spacing for fixed header on mobile */}
            <div className="container mx-auto px-4 lg:px-8 pt-48 lg:pt-0">

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between mb-6 mt-8">
                    <div>
                        <h2 className="text-2xl font-bold">Tous les événements</h2>
                        <p className="text-muted-foreground">Découvrez et participez aux événements à venir</p>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                        {filteredEvenements.length} événement{filteredEvenements.length > 1 ? 's' : ''}
                    </div>
                </div>

                <div className="flex gap-8 lg:animate-fade-in-up">
                    <div className="hidden lg:block w-full max-w-xs mt-4 lg:animate-fade-in-left lg:animation-delay-300">
                        <EvenementSidebar
                            filters={filters}
                            handleFilterChange={handleFilterChange}
                            mainFiltersConfig={mainFiltersConfig}
                            secondaryFiltersConfig={secondaryFiltersConfig}
                            locationFiltersConfig={locationFiltersConfig}
                            locations={locations}
                            availableTags={availableTags}
                        />
                    </div>
                    <div className="flex-1 py-4">
                        <EvenementsList events={paginatedEvenements} isLoading={isLoading} />

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
