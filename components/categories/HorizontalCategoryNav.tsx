"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CategoryButton } from "./CategoryButton";
import { CategoryDialog } from "./CategoryDialog";
import { FolderTree } from "lucide-react";

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

// Helper function
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

export function HorizontalCategoryNav({ scope, selectedSlugs, onCategorySelect }: HorizontalCategoryNavProps) {
  const supabase = createClient();
  const [categoryTree, setCategoryTree] = React.useState<CategoryNode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeLabels, setActiveLabels] = React.useState<Record<string, string>>({});

  // Simple in-memory cache to prevent re-fetching on every mount
  const globalCache = (globalThis as any)._categoryCache = (globalThis as any)._categoryCache || {};

  React.useEffect(() => {
    const fetchAndBuildTree = async () => {
      // Check cache first
      if (globalCache[scope]) {
        setCategoryTree(globalCache[scope]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, nom, slug, parent_id")
          .eq("scope", scope)
          .order("nom", { ascending: true });

        if (error) throw new Error(`Erreur Supabase: ${error.message}`);

        if (data) {
          const tree = buildCategoryTree(data as Category[]);
          setCategoryTree(tree);
          // Update cache
          globalCache[scope] = tree;
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndBuildTree();
  }, [scope, supabase, globalCache]);

  const handleLabelSelect = (name: string, rootNodeId: string) => {
    setActiveLabels(prev => ({ ...prev, [rootNodeId]: name }));
  };

  const handleReset = () => {
    onCategorySelect(undefined);
    setActiveLabels({});
  };

  if (loading) {
    return (
      <div className="flex gap-2 px-4 py-2 min-w-max">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive px-2 py-2">{error}</p>;
  }

  return (
    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">

      <div className="flex gap-2 px-4 py-2 min-w-max">
        {/* Dialog for all categories - always show */}
        <CategoryDialog
          categories={categoryTree}
          selectedSlugs={selectedSlugs}
          onCategorySelect={onCategorySelect}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="rounded-full whitespace-nowrap border-dashed"
            >
              <FolderTree className="mr-1.5 h-4 w-4" />
              Toutes ({categoryTree.length})
            </Button>
          }
        />
        <Button
          key="all-categories"
          variant={!selectedSlugs ? "default" : "outline"}
          size="sm"
          className="rounded-full whitespace-nowrap transition-all"
          onClick={handleReset}
        >
          Toutes
        </Button>

        {categoryTree.map(node => (
          <CategoryButton
            key={node.id}
            node={node}
            selectedSlugs={selectedSlugs}
            onCategorySelect={onCategorySelect}
            onLabelSelect={(name) => handleLabelSelect(name, node.id)}
            activeLabel={activeLabels[node.id]}
          />
        ))}


      </div>
    </div>
  );
}