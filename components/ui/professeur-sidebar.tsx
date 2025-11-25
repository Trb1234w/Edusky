'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Search, FolderTree } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface Option {
    label: string
    value: any
}

interface FilterConfig {
    label: string
    name: string
    icon?: string
    options: Option[]
}

interface ProfesseurSidebarProps {
    filters: Record<string, any>
    handleFilterChange: (key: string, value: any) => void
    mainFiltersConfig: FilterConfig[]
    secondaryFiltersConfig: FilterConfig[]
    locationFiltersConfig?: FilterConfig[]
    typeOptions?: string[]
    specialtyOptions?: string[]
    langueOptions?: string[]
}

export function ProfesseurSidebar({
    filters,
    handleFilterChange,
    mainFiltersConfig,
    secondaryFiltersConfig,
    locationFiltersConfig = [],
    typeOptions = [],
    specialtyOptions = [],
    langueOptions = [],
}: ProfesseurSidebarProps) {

    return (
        <aside className="sticky top-24 h-fit border border-border/50 bg-card/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg space-y-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FolderTree size={20} />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Filtres</h3>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-10 h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        value={filters.search}
                        onChange={e => handleFilterChange('search', e.target.value)}
                    />
                </div>
            </div>

            <Accordion type="multiple" defaultValue={['type', 'specialites', 'note']} className="w-full space-y-4">

                {/* Type de Professeur */}
                {typeOptions.length > 0 && (
                    <AccordionItem value="type" className="border-none">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-primary transition-colors">
                            Type de professeur
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        filters.type === undefined
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                            : "bg-transparent hover:bg-primary/5 hover:text-primary border-border/50"
                                    }
                                    onClick={() => handleFilterChange('type', undefined)}
                                >
                                    Tous
                                </Button>
                                {typeOptions.map(type => (
                                    <Button
                                        key={type}
                                        variant="outline"
                                        size="sm"
                                        className={
                                            filters.type === type
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                                : "bg-transparent hover:bg-primary/5 hover:text-primary border-border/50"
                                        }
                                        onClick={() => handleFilterChange('type', type)}
                                    >
                                        {type === 'en_ligne' ? 'En ligne' :
                                            type === 'a_domicile' ? 'À domicile' :
                                                type === 'mentor' ? 'Mentor' :
                                                    type === 'coach' ? 'Coach' :
                                                        type === 'tuteur' ? 'Tuteur' : type}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Spécialités */}
                {specialtyOptions.length > 0 && (
                    <AccordionItem value="specialites" className="border-none">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-primary transition-colors">
                            Spécialités
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        filters.specialite === undefined
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                            : "bg-transparent hover:bg-primary/5 hover:text-primary border-border/50"
                                    }
                                    onClick={() => handleFilterChange('specialite', undefined)}
                                >
                                    Toutes
                                </Button>
                                {specialtyOptions.map(spec => (
                                    <Button
                                        key={spec}
                                        variant="outline"
                                        size="sm"
                                        className={
                                            filters.specialite === spec
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                                : "bg-transparent hover:bg-primary/5 hover:text-primary border-border/50"
                                        }
                                        onClick={() => handleFilterChange('specialite', spec)}
                                    >
                                        {spec}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Dynamic Filters */}
                {[...mainFiltersConfig, ...locationFiltersConfig, ...secondaryFiltersConfig].map(filterGroup => (
                    <AccordionItem key={filterGroup.name} value={filterGroup.name} className="border-none">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-primary transition-colors">
                            {filterGroup.label}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="flex flex-wrap gap-2">
                                {filterGroup.options.map(option => (
                                    <Button
                                        key={option.label}
                                        variant="outline"
                                        size="sm"
                                        className={
                                            filters[filterGroup.name] === option.value
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                                : "bg-transparent hover:bg-primary/5 hover:text-primary border-border/50"
                                        }
                                        onClick={() => handleFilterChange(filterGroup.name, option.value)}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}

                {/* Langues */}
                {langueOptions.length > 0 && (
                    <AccordionItem value="langues" className="border-none">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-primary transition-colors">
                            Langues
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        filters.langue === undefined
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                            : "bg-transparent hover:bg-primary/5 hover:text-primary border-border/50"
                                    }
                                    onClick={() => handleFilterChange('langue', undefined)}
                                >
                                    Toutes
                                </Button>
                                {langueOptions.map(langue => (
                                    <Button
                                        key={langue}
                                        variant="outline"
                                        size="sm"
                                        className={
                                            filters.langue === langue
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                                : "bg-transparent hover:bg-primary/5 hover:text-primary border-border/50"
                                        }
                                        onClick={() => handleFilterChange('langue', langue)}
                                    >
                                        {langue}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Profil Vérifié */}
                <AccordionItem value="verified" className="border-none">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-primary transition-colors">
                        Profil vérifié
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="verified"
                                checked={filters.is_verified === true}
                                onCheckedChange={(checked) => handleFilterChange('is_verified', checked ? true : undefined)}
                            />
                            <Label htmlFor="verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                Afficher uniquement les profils vérifiés
                            </Label>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </aside>
    )
}
