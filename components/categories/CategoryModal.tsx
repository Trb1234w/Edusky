"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryNode } from "./HorizontalCategoryNav";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    category: CategoryNode;
    selectedSlugs: string[] | undefined;
    onCategorySelect: (slugs: string[]) => void;
    onLabelSelect: (name: string) => void;
};

// Helper to get all descendant slugs (récursif pour tous les niveaux)
const getDescendantSlugs = (node: CategoryNode): string[] => {
    return [node.slug, ...node.children.flatMap(getDescendantSlugs)];
};

export function CategoryModal({
    isOpen,
    onOpenChange,
    category,
    selectedSlugs,
    onCategorySelect,
    onLabelSelect,
}: CategoryModalProps) {
    // État pour gérer quelle sous-catégorie est étendue (pour les sous-sous-catégories)
    const [expandedSubcategory, setExpandedSubcategory] = React.useState<string | null>(null);

    const handleSelectAll = () => {
        const allSlugs = getDescendantSlugs(category);
        onCategorySelect(allSlugs);
        onLabelSelect(category.nom);
        onOpenChange(false);
    };

    const handleSelectSubcategory = (child: CategoryNode) => {
        const slugs = getDescendantSlugs(child);
        onCategorySelect(slugs);
        onLabelSelect(child.nom);
        onOpenChange(false);
    };

    const isSubcategorySelected = (child: CategoryNode) => {
        return selectedSlugs?.includes(child.slug);
    };

    const toggleExpand = (childId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Empêche la sélection de la catégorie
        setExpandedSubcategory(expandedSubcategory === childId ? null : childId);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col ">
                <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl font-bold break-words pr-8">
                        {category.nom}
                    </DialogTitle>
                    <DialogDescription className="text-sm break-words">
                        Sélectionnez une sous-catégorie ou choisissez toutes les options
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 px-1">
                    {/* Option "Tous" */}
                    <div className="mb-6">
                        <Button
                            onClick={handleSelectAll}
                            variant="outline"
                            size="lg"
                            className="w-full justify-start text-left h-auto py-3 md:py-4 px-4 md:px-6 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            <div className="flex items-center gap-3 w-full min-w-0">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm md:text-base break-words line-clamp-2">
                                        Sous catégories de "{category.nom}"
                                    </div>
                                    <div className="text-xs md:text-sm text-muted-foreground">
                                        {category.children.length} sous-catégorie{category.children.length > 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </div>

                    {/* Grille de sous-catégories */}
                    <div className="space-y-3">
                        <h3 className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Sous-catégories
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {category.children.map((child) => {
                                const isSelected = isSubcategorySelected(child);
                                const hasGrandChildren = child.children.length > 0;
                                const isExpanded = expandedSubcategory === child.id;

                                return (
                                    <div key={child.id} className="space-y-2">
                                        {/* Carte principale de la sous-catégorie */}
                                        <div
                                            className={cn(
                                                "group relative w-full p-3 md:p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer",
                                                isSelected
                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-2 min-w-0">
                                                <div
                                                    className="flex-1 min-w-0"
                                                    onClick={() => handleSelectSubcategory(child)}
                                                >
                                                    <div className={cn(
                                                        "font-medium text-xs md:text-sm mb-1 break-words line-clamp-3",
                                                        isSelected ? "text-primary" : "text-foreground"
                                                    )}>
                                                        {child.nom}
                                                    </div>
                                                    {hasGrandChildren && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <span>{child.children.length} sous-catégorie{child.children.length > 1 ? 's' : ''}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    {isSelected && (
                                                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                                    )}
                                                    {hasGrandChildren && (
                                                        <div
                                                            onClick={(e) => toggleExpand(child.id, e)}
                                                            className="p-1 hover:bg-accent rounded transition-colors cursor-pointer"
                                                            title="Voir les sous-catégories"
                                                        >
                                                            <ChevronRight className={cn(
                                                                "w-4 h-4 transition-transform",
                                                                isExpanded && "rotate-90"
                                                            )} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sous-sous-catégories (si étendues) */}
                                        {hasGrandChildren && isExpanded && (
                                            <div className="ml-4 space-y-2 pl-3 border-l-2 border-border">
                                                {child.children.map((grandChild) => {
                                                    const isGrandChildSelected = selectedSlugs?.includes(grandChild.slug);
                                                    return (
                                                        <button
                                                            key={grandChild.id}
                                                            onClick={() => {
                                                                const slugs = getDescendantSlugs(grandChild);
                                                                onCategorySelect(slugs);
                                                                onLabelSelect(grandChild.nom);
                                                                onOpenChange(false);
                                                            }}
                                                            className={cn(
                                                                "w-full p-2 md:p-3 rounded-md border text-left text-xs md:text-sm transition-all hover:shadow-sm",
                                                                isGrandChildSelected
                                                                    ? "border-primary bg-primary/5 text-primary font-medium"
                                                                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                                                            )}
                                                        >
                                                            <div className="flex items-center justify-between gap-2 min-w-0">
                                                                <span className="break-words line-clamp-2 flex-1">
                                                                    {grandChild.nom}
                                                                </span>
                                                                {isGrandChildSelected && (
                                                                    <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
