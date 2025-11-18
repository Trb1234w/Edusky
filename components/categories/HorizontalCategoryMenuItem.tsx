"use client";

import * as React from "react";
import { CategoryNode } from "./HorizontalCategoryNav";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ChevronRight } from "lucide-react";

type HorizontalCategoryMenuItemProps = {
  node: CategoryNode;
  onSelect: (slugs: string[]) => void; // Fonction pour remonter les slugs
};

// Fonction utilitaire pour récupérer tous les slugs descendants d'un nœud
const getDescendantSlugs = (node: CategoryNode): string[] => {
  let slugs = [node.slug];
  for (const child of node.children) {
    slugs = slugs.concat(getDescendantSlugs(child));
  }
  return slugs;
};

export function HorizontalCategoryMenuItem({ node, onSelect }: HorizontalCategoryMenuItemProps) {
  const hasChildren = node.children && node.children.length > 0;

  const handleSelect = () => {
    const allSlugs = getDescendantSlugs(node);
    onSelect(allSlugs);
  };

  if (!hasChildren) {
    return (
      <DropdownMenuItem onClick={handleSelect}>
        {node.nom}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>{node.nom}</span>
        <ChevronRight className="h-4 w-4 ml-auto" />
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {/* Option pour sélectionner le parent et tous ses enfants */}
          <DropdownMenuItem onClick={handleSelect}>
            Tous les articles de "{node.nom}"
          </DropdownMenuItem>
          <div className="my-1 border-t border-muted" />
          {node.children.map((child) => (
            <HorizontalCategoryMenuItem
              key={child.id}
              node={child}
              onSelect={onSelect}
            />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
