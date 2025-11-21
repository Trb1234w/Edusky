'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Users, MapPin } from 'lucide-react' // Updated icons
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { getCategories } from '@/lib/data/categories'

// Define a map for icons if needed for filtersConfig
const iconMap: { [key: string]: React.ElementType } = {
  Users, // Icon for clubs
  MapPin, // Example: for location if clubs have one
}

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

interface ClubSidebarProps {
  filters: Record<string, any>
  handleFilterChange: (key: string, value: any) => void
  filtersConfig: FilterConfig[] // Use filtersConfig
}

export function ClubSidebar({
  filters,
  handleFilterChange,
  filtersConfig,
}: ClubSidebarProps) {

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      // Ensure the scope is 'club' or 'clubs' as per your category data
      const { data, error } = await getCategories({ scope: 'club' }); // Assuming 'club' is the scope for clubs
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
    <aside className="border bg-primary text-primary-foreground rounded-xl p-6 shadow-sm space-y-6">
      <h3 className="text-xl font-semibold">Filtres Clubs</h3>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground" size={18} />
        <Input
          placeholder="Rechercher un club..."
          className="pl-10 h-10 rounded-xl placeholder-primary-foreground"
          value={filters.search}
          onChange={e => handleFilterChange('search', e.target.value)}
        />
      </div>

      <Accordion type="multiple" defaultValue={['categories']} className="w-full">
        {/* Categories Section */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-lg font-semibold">Catégories de Clubs</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.slug}
                className={
                  filters.categorySlugs?.includes(category.slug)
                    ? "w-full justify-start bg-primary-foreground text-primary hover:bg-primary-foreground/90" // Selected style
                    : "w-full justify-start bg-primary-foreground text-primary border border-primary hover:bg-primary-foreground/90" // Unselected style
                }
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
        {filtersConfig.map(filterGroup => (
          <AccordionItem key={filterGroup.name} value={filterGroup.name}>
            <AccordionTrigger className="text-lg font-semibold">{filterGroup.label}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                {filterGroup.options.map(option => (
                  <Button
                    key={option.label}
                    className={
                      filters[filterGroup.name] === option.value
                        ? "text-xs h-9 bg-primary-foreground text-primary hover:bg-primary-foreground/90" // Selected style
                        : "text-xs h-9 bg-primary-foreground text-primary border border-primary hover:bg-primary-foreground/90" // Unselected style
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
