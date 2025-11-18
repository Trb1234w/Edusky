"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { HorizontalCategoryMenuItem } from "./HorizontalCategoryMenuItem";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Types
export type Category = {
  id: string;
  nom: string;
  slug: string;
  parent_id: string | null;
};

export type CategoryNode = Category & {
  children: CategoryNode[];
};

type HorizontalCategoryNavProps = {
  scope: "formation" | "event" | "club" | "blog";
  selectedSlugs: string[] | undefined;
  onCategorySelect: (slugs: string[] | undefined) => void;
};

// Fonction pour construire l'arbre (inchangée)
function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();
  const rootCategories: CategoryNode[] = [];
  categories.forEach(c => categoryMap.set(c.id, { ...c, children: [] }));
  categories.forEach(c => {
    if (c.parent_id) {
      const parent = categoryMap.get(c.parent_id);
      const child = categoryMap.get(c.id);
      if (parent && child) parent.children.push(child);
    } else {
      const root = categoryMap.get(c.id);
      if (root) rootCategories.push(root);
    }
  });
  return rootCategories;
}

// Fonction utilitaire pour récupérer tous les slugs descendants d'un nœud
const getDescendantSlugs = (node: CategoryNode): string[] => {
  return [node.slug, ...node.children.flatMap(getDescendantSlugs)];
};

export function HorizontalCategoryNav({ scope, selectedSlugs, onCategorySelect }: HorizontalCategoryNavProps) {
  const supabase = createClient();
  const [categoryTree, setCategoryTree] = React.useState<CategoryNode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchAndBuildTree = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, nom, slug, parent_id")
          .eq("scope", scope)
          .order("nom", { ascending: true });
        if (error) throw new Error(`Erreur Supabase: ${error.message}`);
        if (data) setCategoryTree(buildCategoryTree(data as Category[]));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAndBuildTree();
  }, [scope, supabase]);

  if (loading) {
    return (
      <div className="flex gap-2 px-4 py-2 min-w-max">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive px-4 py-2">{error}</p>;
  }

  return (
    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2 px-4 py-2 min-w-max">
        <Button
          key="all-categories"
          variant={!selectedSlugs ? "default" : "outline"}
          size="sm"
          className="rounded-full whitespace-nowrap transition-all"
          onClick={() => onCategorySelect(undefined)}
        >
          Toutes
        </Button>
        
        {categoryTree.map(node => {
          const hasChildren = node.children.length > 0;
          const isSelected = selectedSlugs?.includes(node.slug);

          if (!hasChildren) {
            return (
              <Button
                key={node.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap"
                onClick={() => onCategorySelect([node.slug])}
              >
                {node.nom}
              </Button>
            );
          }

                    return (

                      <DropdownMenu key={node.id} onOpenChange={setIsDropdownOpen}>

                        <DropdownMenuTrigger asChild>

                          <Button

                            variant={isSelected ? "default" : "outline"}

                            size="sm"

                            className="rounded-full whitespace-nowrap pr-2" // Adjusted padding for icon

                          >

                            {node.nom}

                            <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isDropdownOpen && "rotate-180")} />

                          </Button>

                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                {/* Option pour sélectionner le parent et tous ses enfants */}
                <DropdownMenuItem onClick={() => onCategorySelect(getDescendantSlugs(node))}>
                  Tous les articles de "{node.nom}"
                </DropdownMenuItem>
                <div className="my-1 border-t border-muted" />
                {node.children.map(child => (
                  <HorizontalCategoryMenuItem
                    key={child.id}
                    node={child}
                    onSelect={onCategorySelect}
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </div>
  );
}
