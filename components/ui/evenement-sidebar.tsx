'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search, FolderTree } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { getCategories } from '@/lib/data/categories'
import { buildCategoryTree } from '@/lib/utils/categories'
import { CategoryDialog, CategoryNode } from '@/components/categories/CategoryDialog'
import { SidebarCategoryItem } from './sidebar-category-item'

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

interface EvenementSidebarProps {
    filters: Record<string, any>
    handleFilterChange: (key: string, value: any) => void
    mainFiltersConfig: FilterConfig[]
    secondaryFiltersConfig: FilterConfig[]
    locationFiltersConfig: FilterConfig[]
    locations: {
        countries: Location[];
        villes: Ville[];
        quartiers: Quartier[];
    }
    availableTags: string[]
}

export function EvenementSidebar({
    filters,
    handleFilterChange,
    mainFiltersConfig,
    secondaryFiltersConfig,
    locationFiltersConfig,
    locations,
    availableTags,
}: EvenementSidebarProps) {

    const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await getCategories({ scope: 'evenement' });
            if (error) {
                console.error('Failed to fetch categories:', error);
                return;
            }
            setCategoryTree(buildCategoryTree(data || []));
        };
        fetchCategories();
    }, []);

    const handleCategorySelection = (slugs: string[] | undefined) => {
        handleFilterChange('categorySlugs', slugs);
    };

    const visibleCategories = categoryTree.slice(0, 5);

    return (
        <aside className="border bg-primary text-primary-foreground rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-semibold">Filtres Événements</h3>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground" size={18} />
                <Input
                    placeholder="Rechercher un événement..."
                    className="pl-10 h-10 rounded-xl placeholder-primary-foreground"
                    value={filters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                />
            </div>

            <Accordion type="multiple" defaultValue={['categories']} className="w-full">
                <AccordionItem value="categories">
                    <AccordionTrigger className="text-lg font-semibold">Catégories d'Événements</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                        <div className="space-y-2">
                            {visibleCategories.map((category) => (
                                <SidebarCategoryItem
                                    key={category.id}
                                    node={category}
                                    selectedSlugs={filters.categorySlugs}
                                    onSelect={handleCategorySelection}
                                />
                            ))}

                            <CategoryDialog
                                categories={categoryTree}
                                selectedSlugs={filters.categorySlugs}
                                onCategorySelect={handleCategorySelection}
                                trigger={
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start bg-primary-foreground text-primary border-2 border-dashed border-primary hover:bg-primary-foreground/90"
                                    >
                                        <FolderTree className="mr-2 h-4 w-4" />
                                        Toutes les catégories ({categoryTree.length})
                                    </Button>
                                }
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Location Filters */}
                {locationFiltersConfig.map(filterGroup => (
                    <AccordionItem key={filterGroup.name} value={filterGroup.name}>
                        <AccordionTrigger className="text-lg font-semibold">{filterGroup.label}</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                                {filterGroup.options.map(option => (
                                    <Button
                                        key={option.label}
                                        className={
                                            filters[filterGroup.name] === option.value
                                                ? "text-xs h-9 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                                : "text-xs h-9 bg-primary-foreground text-primary border border-primary hover:bg-primary-foreground/90"
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

                {/* Main Filters */}
                {mainFiltersConfig.map(filterGroup => (
                    <AccordionItem key={filterGroup.name} value={filterGroup.name}>
                        <AccordionTrigger className="text-lg font-semibold">{filterGroup.label}</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                                {filterGroup.options.map(option => (
                                    <Button
                                        key={option.label}
                                        className={
                                            filters[filterGroup.name] === option.value
                                                ? "text-xs h-9 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                                : "text-xs h-9 bg-primary-foreground text-primary border border-primary hover:bg-primary-foreground/90"
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

                {/* Tags Filter */}
                {availableTags.length > 0 && (
                    <AccordionItem value="tags">
                        <AccordionTrigger className="text-lg font-semibold">Tags</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    className={
                                        filters.tags === undefined
                                            ? "text-xs h-9 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                            : "text-xs h-9 bg-primary-foreground text-primary border border-primary hover:bg-primary-foreground/90"
                                    }
                                    onClick={() => handleFilterChange('tags', undefined)}
                                >
                                    Tous
                                </Button>
                                {availableTags.map(tag => (
                                    <Button
                                        key={tag}
                                        className={
                                            filters.tags === tag
                                                ? "text-xs h-9 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                                : "text-xs h-9 bg-primary-foreground text-primary border border-primary hover:bg-primary-foreground/90"
                                        }
                                        onClick={() => handleFilterChange('tags', tag)}
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Secondary Filters */}
                {secondaryFiltersConfig.map(filterGroup => (
                    <AccordionItem key={filterGroup.name} value={filterGroup.name}>
                        <AccordionTrigger className="text-lg font-semibold">{filterGroup.label}</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                                {filterGroup.options.map(option => (
                                    <Button
                                        key={option.label}
                                        className={
                                            filters[filterGroup.name] === option.value
                                                ? "text-xs h-9 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                                : "text-xs h-9 bg-primary-foreground text-primary border border-primary hover:bg-primary-foreground/90"
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
            </Accordion>
        </aside>
    )
}
