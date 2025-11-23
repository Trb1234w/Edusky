'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { CategoryNode } from '@/components/categories/CategoryDialog'

interface SidebarCategoryItemProps {
    node: CategoryNode
    selectedSlugs: string[] | undefined
    onSelect: (slugs: string[]) => void
    level?: number
}

// Helper to get all descendant slugs
const getDescendantSlugs = (node: CategoryNode): string[] => {
    return [node.slug, ...node.children.flatMap(getDescendantSlugs)]
}

export function SidebarCategoryItem({
    node,
    selectedSlugs,
    onSelect,
    level = 0
}: SidebarCategoryItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const hasChildren = node.children.length > 0
    const isSelected = selectedSlugs?.includes(node.slug)

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-1">
                {hasChildren && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 shrink-0"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                )}
                <Button
                    size={level > 0 ? "sm" : "default"}
                    className={
                        isSelected
                            ? `w-full justify-start ${level > 0 ? 'text-xs' : ''} bg-primary-foreground text-primary hover:bg-primary-foreground/90 ${!hasChildren ? 'ml-7' : ''}`
                            : `w-full justify-start ${level > 0 ? 'text-xs' : ''} bg-primary-foreground text-primary border border-primary hover:bg-primary-foreground/90 ${!hasChildren ? 'ml-7' : ''}`
                    }
                    onClick={() => {
                        const slugs = hasChildren ? getDescendantSlugs(node) : [node.slug]
                        onSelect(slugs)
                    }}
                >
                    {node.nom}
                    {hasChildren && <span className="ml-2 text-xs opacity-60">({node.children.length})</span>}
                </Button>
            </div>

            {/* Recursively show children if expanded */}
            {hasChildren && isExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-border pl-2">
                    {node.children.map(child => (
                        <SidebarCategoryItem
                            key={child.id}
                            node={child}
                            selectedSlugs={selectedSlugs}
                            onSelect={onSelect}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
