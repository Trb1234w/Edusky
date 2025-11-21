'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { HorizontalCategoryNav } from '../categories/HorizontalCategoryNav'
import { getCategories } from '@/lib/data/categories'

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

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await getCategories({ scope: 'formation' });
      if (error) {
        console.error('Failed to fetch categories:', error);
        return;
      }
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const handleCategorySelection = (slugs: string[]) => {
    handleFilterChange('categorySlugs', slugs);
  };


  return (
    <aside className="border bg-card text-card-foreground rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-semibold">Filtres</h3>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Rechercher par mot-clé..."
          className="pl-10 h-10 rounded-xl"
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
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={filters.categorySlugs?.includes(category.slug) ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => {
                  const currentSlugs = filters.categorySlugs || [];
                  const newSlugs = currentSlugs.includes(category.slug)
                    ? currentSlugs.filter((s: string) => s !== category.slug)
                    : [...currentSlugs, category.slug];
                  handleCategorySelection(newSlugs.length > 0 ? newSlugs : undefined);
                }}
              >
                {category.nom}
              </Button>
            ))}
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
                    variant={filters[filterGroup.name] === option.value ? 'default' : 'outline'}
                    onClick={() => handleFilterChange(filterGroup.name, option.value)}
                    className="text-xs h-9"
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
