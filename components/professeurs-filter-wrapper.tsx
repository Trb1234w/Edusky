'use client'

import React, { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { getAllProfesseurs, getDistinctProfesseurLocations, getDistinctProfesseurTypes, getDistinctProfesseurSpecialties, getDistinctProfesseurLangues } from "@/app/professeurs/get-locations"
import { ProfesseursList } from "@/app/professeurs/professeurs-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
    Search,
    SlidersHorizontal,
    Star,
    Award,
    ArrowLeft,
    MapPin,
    Building2,
    Home,
    Briefcase,
    TrendingUp,
    Users,
    CheckCircle,
    Globe,
} from "lucide-react"
import {
    CustomBottomSheet,
    CustomBottomSheetContent,
    CustomBottomSheetHeader,
    CustomBottomSheetTitle,
    CustomBottomSheetTrigger,
    CustomBottomSheetClose,
} from "@/components/ui/custom-bottom-sheet"
import { ProfesseurSidebar } from "@/components/ui/professeur-sidebar"

const iconMap: { [key: string]: React.ElementType } = {
    Star,
    Award,
    MapPin,
    Building2,
    Home,
    Briefcase,
    TrendingUp,
    Users,
    CheckCircle,
    Globe,
}

interface ProfesseursFilterWrapperProps { }

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

export function ProfesseursFilterWrapper({ }: ProfesseursFilterWrapperProps) {
    const router = useRouter();
    const [allProfesseurs, setAllProfesseurs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [locations, setLocations] = useState<{
        countries: Location[];
        villes: Ville[];
        quartiers: Quartier[];
    }>({ countries: [], villes: [], quartiers: [] })

    const [availableTypes, setAvailableTypes] = useState<string[]>([])
    const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([])
    const [availableLangues, setAvailableLangues] = useState<string[]>([])

    const [filters, setFilters] = useState<Record<string, any>>({
        search: "",
        type: undefined,
        specialite: undefined,
        note: undefined,
        experience: undefined,
        certifications: undefined,
        pays_id: undefined,
        ville_id: undefined,
        quartier_id: undefined,
        tarif: undefined,
        langue: undefined,
        etudiants: undefined,
        is_verified: undefined,
        genre: undefined,
    })

    useEffect(() => {
        const fetchProfesseursAndData = async () => {
            setIsLoading(true)
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            const { data: professeursData } = await getAllProfesseurs()
            setAllProfesseurs(professeursData || []);
            setIsLoading(false);
        }
        fetchProfesseursAndData();
    }, [])

    useEffect(() => {
        const fetchFiltersData = async () => {
            const [locationsResult, typesResult, specialtiesResult, languesResult] = await Promise.all([
                getDistinctProfesseurLocations(),
                getDistinctProfesseurTypes(),
                getDistinctProfesseurSpecialties(),
                getDistinctProfesseurLangues()
            ]);

            if (locationsResult.data) {
                setLocations(locationsResult.data);
            }

            if (typesResult.data) {
                setAvailableTypes(typesResult.data);
            }

            if (specialtiesResult.data) {
                setAvailableSpecialties(specialtiesResult.data);
            }

            if (languesResult.data) {
                setAvailableLangues(languesResult.data);
            }
        };

        fetchFiltersData();
    }, []);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            if (key === 'pays_id') {
                newFilters.ville_id = undefined;
                newFilters.quartier_id = undefined;
            } else if (key === 'ville_id') {
                newFilters.quartier_id = undefined;
            }

            return newFilters;
        });
    }

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

    const filteredProfesseurs = useMemo(() => {
        return allProfesseurs.filter(prof => {
            const searchMatch =
                !filters.search ||
                prof.profile_full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                prof.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
                prof.specialites?.some((spec: string) => spec.toLowerCase().includes(filters.search.toLowerCase()))

            const typeMatch = !filters.type || prof.type === filters.type
            const specialiteMatch = !filters.specialite || prof.specialites?.includes(filters.specialite)

            const noteMatch = (() => {
                if (!filters.note) return true;
                return (prof.note_moyenne || 0) >= parseFloat(filters.note);
            })();

            const experienceMatch = (() => {
                if (!filters.experience) return true;
                const exp = prof.annees_experience || 0;
                const [min, max] = filters.experience.split('-').map(Number);
                if (filters.experience === "10+") {
                    return exp >= 10;
                }
                return exp >= min && exp < max;
            })();

            const certificationsMatch =
                filters.certifications === undefined ||
                (filters.certifications === "true" && prof.certifications && Array.isArray(prof.certifications) && prof.certifications.length > 0) ||
                (filters.certifications === "false" && (!prof.certifications || !Array.isArray(prof.certifications) || prof.certifications.length === 0))

            const paysMatch = !filters.pays_id || prof.pays_id === filters.pays_id
            const villeMatch = !filters.ville_id || prof.ville_id === filters.ville_id
            const quartierMatch = !filters.quartier_id || prof.quartier_id === filters.quartier_id

            const tarifMatch = (() => {
                if (!filters.tarif) return true;
                const tarif = prof.tarif_indicatif || 0;
                if (filters.tarif === "0") return tarif === 0;
                if (filters.tarif === "50000") return tarif > 0 && tarif < 50000;
                if (filters.tarif === "50000-100000") return tarif >= 50000 && tarif < 100000;
                if (filters.tarif === "100000-200000") return tarif >= 100000 && tarif < 200000;
                if (filters.tarif === "200000+") return tarif >= 200000;
                return true;
            })();

            const langueMatch = !filters.langue || (
                prof.profile_langues &&
                Array.isArray(prof.profile_langues) &&
                prof.profile_langues.includes(filters.langue)
            )

            const etudiantsMatch = (() => {
                if (!filters.etudiants) return true;
                const nb = prof.nb_etudiants_formes || 0;
                return nb >= parseInt(filters.etudiants);
            })();

            const verifiedMatch = !filters.is_verified || prof.profile_is_verified === true
            const genreMatch = !filters.genre || prof.profile_genre === filters.genre

            return (
                searchMatch &&
                typeMatch &&
                specialiteMatch &&
                noteMatch &&
                experienceMatch &&
                certificationsMatch &&
                paysMatch &&
                villeMatch &&
                quartierMatch &&
                tarifMatch &&
                langueMatch &&
                etudiantsMatch &&
                verifiedMatch &&
                genreMatch
            )
        })
    }, [filters, allProfesseurs])

    const mainFiltersConfig = [
        { label: "Note", name: "note", icon: "Star", options: [{ label: "Toutes", value: undefined }, { label: "4+", value: 4 }, { label: "3+", value: 3 }] },
        { label: "Expérience", name: "experience", icon: "Award", options: [{ label: "Toutes", value: undefined }, { label: "0-2 ans", value: "0-2" }, { label: "2-5 ans", value: "2-5" }, { label: "5-10 ans", value: "5-10" }, { label: "10+ ans", value: "10+" }] },
        { label: "Certifications", name: "certifications", icon: "CheckCircle", options: [{ label: "Tous", value: undefined }, { label: "Oui", value: "true" }, { label: "Non", value: "false" }] },
    ]

    const locationFiltersConfig = [
        { label: "Pays", name: "pays_id", icon: "MapPin", options: [{ label: "Tous les pays", value: undefined }, ...locations.countries.map(c => ({ label: c.nom, value: c.id }))] },
        { label: "Ville", name: "ville_id", icon: "Building2", options: [{ label: "Toutes les villes", value: undefined }, ...getFilteredVilles().map(v => ({ label: v.nom, value: v.id }))] },
        { label: "Quartier", name: "quartier_id", icon: "Home", options: [{ label: "Tous les quartiers", value: undefined }, ...getFilteredQuartiers().map(q => ({ label: q.nom, value: q.id }))] },
    ]

    const secondaryFiltersConfig = [
        { label: "Tarif", name: "tarif", icon: "TrendingUp", options: [{ label: "Tous", value: undefined }, { label: "Gratuit", value: "0" }, { label: "< 50k GNF", value: "50000" }, { label: "50k-100k", value: "50000-100000" }, { label: "100k-200k", value: "100000-200000" }, { label: "200k+", value: "200000+" }] },
        { label: "Étudiants", name: "etudiants", icon: "Users", options: [{ label: "Tous", value: undefined }, { label: "10+", value: "10" }, { label: "50+", value: "50" }, { label: "100+", value: "100" }, { label: "500+", value: "500" }] },
        { label: "Genre", name: "genre", icon: "Globe", options: [{ label: "Tous", value: undefined }, { label: "Homme", value: "Homme" }, { label: "Femme", value: "Femme" }] },
    ]

    return (
        <div className="container mx-auto px-4 lg:px-8">
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
                        <span className="text-lg font-semibold ml-2">Professeurs</span>
                    </div>
                    <div className="px-4 py-2 border-b">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Rechercher un professeur..."
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
                    </div>

                    {availableSpecialties.length > 0 && (
                        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                            <div className="flex gap-2 px-4 py-2 min-w-max">
                                <Button
                                    variant={filters.specialite === undefined ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full whitespace-nowrap transition-all"
                                    onClick={() => handleFilterChange("specialite", undefined)}
                                >
                                    Toutes
                                </Button>
                                {availableSpecialties.map(spec => (
                                    <Button
                                        key={spec}
                                        variant={filters.specialite === spec ? "default" : "outline"}
                                        size="sm"
                                        className="rounded-full whitespace-nowrap transition-all"
                                        onClick={() => handleFilterChange("specialite", spec)}
                                    >
                                        {spec}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-8">
                <div className="hidden lg:block w-full max-w-xs mt-4 lg:animate-fade-in-left lg:animation-delay-300">
                    <ProfesseurSidebar
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                        mainFiltersConfig={mainFiltersConfig}
                        secondaryFiltersConfig={secondaryFiltersConfig}
                        locationFiltersConfig={locationFiltersConfig}
                        typeOptions={availableTypes}
                        specialtyOptions={availableSpecialties}
                        langueOptions={availableLangues}
                    />
                </div>
                <div className="flex-1 py-4 lg:animate-fade-in-up lg:animation-delay-500">
                    <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                        <div>
                            <h2 className="text-2xl font-bold">Catalogue</h2>
                            <p className="text-muted-foreground text-sm">Explorez nos meilleurs professeurs</p>
                        </div>
                        <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {filteredProfesseurs.length} résultats
                        </div>
                    </div>

                    <ProfesseursList professeurs={filteredProfesseurs} isLoading={isLoading} />
                </div>
            </div>
        </div>
    )
}
