"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, TrendingUp, Star, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CustomBottomSheet,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetTitle,
  CustomBottomSheetTrigger,
  CustomBottomSheetClose,
  CustomBottomSheetFooter,
} from "@/components/ui/custom-bottom-sheet"

// This iconMap is specific to the needs of the Professors page
const iconMap = {
  TrendingUp,
  Star,
  Award,
}

interface MobilePageHeaderProps {
  categories: { label: string; value: string }[]
  filters: { label: string; icon: keyof typeof iconMap; options: string[] }[] // Updated filters type
  gradient: string
  activeCategory?: string
  onCategoryChange?: (category: string) => void
}

export function MobilePageHeader({
  categories,
  filters,
  gradient,
  activeCategory = "all",
  onCategoryChange,
}: MobilePageHeaderProps) {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      {/* Categories Section */}
      <div className="overflow-x-auto border-b border-border [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full whitespace-nowrap transition-all",
                activeCategory === category.value && `bg-gradient-to-r ${gradient} text-white border-0`
              )}
              onClick={() => onCategoryChange?.(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters Section with Bottom Sheet */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        {filters.map((filter, index) => {
          const Icon = iconMap[filter.icon]
          return (
            <CustomBottomSheet key={index}>
              <CustomBottomSheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                  <Icon size={16} className="mr-1" />
                  {filter.label}
                </Button>
              </CustomBottomSheetTrigger>
              <CustomBottomSheetContent>
                <CustomBottomSheetHeader>
                  <CustomBottomSheetTitle>Filtrer par {filter.label}</CustomBottomSheetTitle>
                </CustomBottomSheetHeader>
                <div className="grid grid-cols-2 gap-2 px-4">
                  {filter.options.map((option) => (
                    <Button key={option} variant="outline">
                      {option}
                    </Button>
                  ))}
                </div>
                <CustomBottomSheetFooter>
                  <CustomBottomSheetClose asChild>
                    <Button>Valider</Button>
                  </CustomBottomSheetClose>
                </CustomBottomSheetFooter>
              </CustomBottomSheetContent>
            </CustomBottomSheet>
          )
        })}
        <Button variant="outline" size="sm" className="rounded-xl ml-auto bg-transparent">
          <SlidersHorizontal size={16} />
        </Button>
      </div>

      {/* Search Section */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Rechercher..." className="pl-10 h-10 rounded-xl border-border/50" />
        </div>
      </div>
    </div>
  )
}
