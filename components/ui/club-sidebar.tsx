'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search, FolderTree, Users } from 'lucide-react'
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

interface ClubSidebarProps {
  filters: Record<string, any>
  handleFilterChange: (key: string, value: any) => void
  filtersConfig: FilterConfig[]
  availableTags: string[]
}

export function ClubSidebar({
  filters,
  handleFilterChange,
  filtersConfig,
  availableTags,
}: ClubSidebarProps) {

  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await getCategories({ scope: 'club' });
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
    <aside className="sticky top-24 h-fit border border-border/50 bg-card/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg space-y-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
          <Users size={20} />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Filtres</h3>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-500 transition-colors" size={18} />
          <Input
            placeholder="Rechercher un club..."
            className="pl-10 h-11 rounded-xl border-border/50 bg-background/50 focus:bg-background transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'statut']} className="w-full space-y-4">
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-blue-500 transition-colors">Catégories</AccordionTrigger>
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
                    className="w-full justify-start text-muted-foreground hover:text-blue-500 hover:bg-blue-500/5 mt-2 h-9 font-medium"
                  >
                    <FolderTree className="mr-2 h-4 w-4" />
                    Voir tout ({categoryTree.length})
                  </Button>
                }
              /> </div>
          </AccordionContent>
        </AccordionItem>

        {filtersConfig.map(filterGroup => (
          <AccordionItem key={filterGroup.name} value={filterGroup.name} className="border-none">
            <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-blue-500 transition-colors">{filterGroup.label}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="flex flex-wrap gap-2">
                {filterGroup.options.map(option => (
                  <Button
                    key={option.label}
                    variant="outline"
                    size="sm"
                    className={
                      filters[filterGroup.name] === option.value
                        ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                        : "bg-transparent hover:bg-blue-500/5 hover:text-blue-500 border-border/50"
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
            <AccordionTrigger className="text-base font-semibold hover:no-underline py-2 hover:text-blue-500 transition-colors">Tags</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    filters.tags === undefined
                      ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                      : "bg-transparent hover:bg-blue-500/5 hover:text-blue-500 border-border/50"
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
                        ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                        : "bg-transparent hover:bg-blue-500/5 hover:text-blue-500 border-border/50"
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
      </Accordion>
    </aside>
  )
}
