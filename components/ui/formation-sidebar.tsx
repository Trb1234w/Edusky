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

interface FormationSidebarProps {
  filters: Record<string, any>
  handleFilterChange: (key: string, value: any) => void
  mainFiltersConfig: FilterConfig[]
  secondaryFiltersConfig: FilterConfig[]
}

export function FormationSidebar({
  filters,
  handleFilterChange,
  mainFiltersConfig,
  secondaryFiltersConfig,
}: FormationSidebarProps) {

  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await getCategories({ scope: 'formation' });
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

  // Get first 5 root categories
  const visibleCategories = categoryTree.slice(0, 5);

  return (
    <aside className="border bg-primary text-primary-foreground rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-semibold">Filtres</h3>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground" size={18} />
        <Input
          placeholder="Rechercher par mot-clé..."
          className="pl-10 h-10 rounded-xl placeholder-primary-foreground"
          value={filters.search}
          onChange={e => handleFilterChange('search', e.target.value)}
        />
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'niveau']} className="w-full">
        {/* Categories Section */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-lg font-semibold">Catégories</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            <div className="space-y-2">
              {/* Visible categories (first 5) - using recursive component */}
              {visibleCategories.map((category) => (
                <SidebarCategoryItem
                  key={category.id}
                  node={category}
                  selectedSlugs={filters.categorySlugs}
                  onSelect={handleCategorySelection}
                />
              ))}

              {/* "Toutes" button to open dialog - always show */}
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

        {/* Dynamic Filters */}
        {[...mainFiltersConfig, ...secondaryFiltersConfig].map(filterGroup => (
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
