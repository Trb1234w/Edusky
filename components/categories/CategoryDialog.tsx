'use client';

import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export type CategoryNode = {
    id: string;
    nom: string;
    slug: string;
    parent_id: string | null;
    children: CategoryNode[];
};

interface CategoryDialogProps {
    categories: CategoryNode[];
    selectedSlugs: string[] | undefined;
    onCategorySelect: (slugs: string[] | undefined) => void;
    trigger: React.ReactNode;
}

// Helper to get all descendant slugs
const getDescendantSlugs = (node: CategoryNode): string[] => {
    return [node.slug, ...node.children.flatMap(getDescendantSlugs)];
};

// Recursive category item component
function CategoryItem({
    node,
    selectedSlugs,
    onSelect,
    searchTerm,
}: {
    node: CategoryNode;
    selectedSlugs: string[] | undefined;
    onSelect: (slugs: string[]) => void;
    searchTerm: string;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedSlugs?.includes(node.slug);

    // Check if this node or any descendant matches the search
    const matchesSearch = (n: CategoryNode, term: string): boolean => {
        if (n.nom.toLowerCase().includes(term.toLowerCase())) return true;
        return n.children.some(child => matchesSearch(child, term));
    };

    const matches = matchesSearch(node, searchTerm);
    if (!matches) return null;

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-1">
                {hasChildren && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
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
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className={`flex-1 justify-start ${!hasChildren ? 'ml-7' : ''}`}
                    onClick={() => {
                        if (hasChildren) {
                            onSelect(getDescendantSlugs(node));
                        } else {
                            onSelect([node.slug]);
                        }
                    }}
                >
                    {node.nom}
                    {hasChildren && <span className="ml-2 text-xs opacity-60">({node.children.length})</span>}
                </Button>
            </div>
            {hasChildren && isExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-border pl-2">
                    {node.children.map(child => (
                        <CategoryItem
                            key={child.id}
                            node={child}
                            selectedSlugs={selectedSlugs}
                            onSelect={onSelect}
                            searchTerm={searchTerm}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function CategoryDialog({
    categories,
    selectedSlugs,
    onCategorySelect,
    trigger,
}: CategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelect = (slugs: string[]) => {
        onCategorySelect(slugs);
        setOpen(false);
    };

    const handleReset = () => {
        onCategorySelect(undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Toutes les catégories</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Rechercher une catégorie..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Reset button */}
                    <Button
                        variant={!selectedSlugs ? "default" : "outline"}
                        className="w-full"
                        onClick={handleReset}
                    >
                        Toutes les catégories
                    </Button>

                    {/* Categories list */}
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-1">
                            {categories.map(node => (
                                <CategoryItem
                                    key={node.id}
                                    node={node}
                                    selectedSlugs={selectedSlugs}
                                    onSelect={handleSelect}
                                    searchTerm={searchTerm}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
