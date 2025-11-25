'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search, FolderTree, Calendar } from 'lucide-react'
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
        <aside className="sticky top-24 h-fit border border-border/50 bg-card/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg space-y-8 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                    <Calendar size={20} />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Filtres</h3>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors" size={18} />
                    <Input
                        placeholder="Rechercher un événement..."
                        className="pl-10 h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all duration-300 focus:ring-2 focus:ring-orange-500/20"
                        value={filters.search}
                        onChange={e => handleFilterChange('search', e.target.value)}
                    />
                </div>
            </div>

            <Accordion type="multiple" defaultValue={['categories', 'mode', 'type_evenement']} className="w-full space-y-4">
                <AccordionItem value="categories" className="border-none">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-orange-500 transition-colors">Catégories</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                        <div className="space-y-1">
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
                                        variant="ghost"
                                        className="w-full justify-start text-muted-foreground hover:text-orange-500 hover:bg-orange-500/5 mt-2 h-9 font-medium"
                                    >
                                        <FolderTree className="mr-2 h-4 w-4" />
                                        Voir tout ({categoryTree.length})
                                    </Button>
                                }
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Location Filters */}
                {locationFiltersConfig.map(filterGroup => (
                    <AccordionItem key={filterGroup.name} value={filterGroup.name} className="border-none">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-orange-500 transition-colors">{filterGroup.label}</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="flex flex-wrap gap-2">
                                {filterGroup.options.map(option => (
                                    <Button
                                        key={option.label}
                                        variant="outline"
                                        size="sm"
                                        className={
                                            filters[filterGroup.name] === option.value
                                                ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                                                : "bg-transparent hover:bg-orange-500/5 hover:text-orange-500 border-border/50"
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
                    <AccordionItem key={filterGroup.name} value={filterGroup.name} className="border-none">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-orange-500 transition-colors">{filterGroup.label}</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="flex flex-wrap gap-2">
                                {filterGroup.options.map(option => (
                                    <Button
                                        key={option.label}
                                        variant="outline"
                                        size="sm"
                                        className={
                                            filters[filterGroup.name] === option.value
                                                ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                                                : "bg-transparent hover:bg-orange-500/5 hover:text-orange-500 border-border/50"
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
                    <AccordionItem value="tags" className="border-none">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-orange-500 transition-colors">Tags</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        filters.tags === undefined
                                            ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                                            : "bg-transparent hover:bg-orange-500/5 hover:text-orange-500 border-border/50"
                                    }
                                    onClick={() => handleFilterChange('tags', undefined)}
                                >
                                    Tous
                                </Button>
                                {availableTags.map(tag => (
                                    <Button
                                        key={tag}
                                        variant="outline"
                                        size="sm"
                                        className={
                                            filters.tags === tag
                                                ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                                                : "bg-transparent hover:bg-orange-500/5 hover:text-orange-500 border-border/50"
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
                    <AccordionItem key={filterGroup.name} value={filterGroup.name} className="border-none">
                        <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-orange-500 transition-colors">{filterGroup.label}</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            <div className="flex flex-wrap gap-2">
                                {filterGroup.options.map(option => (
                                    <Button
                                        key={option.label}
                                        variant="outline"
                                        size="sm"
                                        className={
                                            filters[filterGroup.name] === option.value
                                                ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                                                : "bg-transparent hover:bg-orange-500/5 hover:text-orange-500 border-border/50"
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
