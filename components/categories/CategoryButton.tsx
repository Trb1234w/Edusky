"use client";

import * as React from "react";
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
import { CategoryNode } from "./HorizontalCategoryNav";

type CategoryButtonProps = {
  node: CategoryNode;
  selectedSlugs: string[] | undefined;
  onCategorySelect: (slugs: string[] | undefined) => void;
  onLabelSelect: (name: string) => void;
  activeLabel?: string;
};

// Helper to get all descendant slugs
const getDescendantSlugs = (node: CategoryNode): string[] => {
  return [node.slug, ...node.children.flatMap(getDescendantSlugs)];
};

export function CategoryButton({ 
  node, 
  selectedSlugs, 
  onCategorySelect,
  onLabelSelect,
  activeLabel
}: CategoryButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedSlugs?.includes(node.slug);

  const handleSelect = (slugs: string[], name: string) => {
    onCategorySelect(slugs);
    onLabelSelect(name);
  };

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
    <DropdownMenu onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="rounded-full whitespace-nowrap pr-2"
        >
          {activeLabel || node.nom}
          <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSelect(getDescendantSlugs(node), node.nom)}>
          Tous les articles de "{node.nom}"
        </DropdownMenuItem>
        <div className="my-1 border-t border-muted" />
        {node.children.map(child => (
          <HorizontalCategoryMenuItem
            key={child.id}
            node={child}
            onSelect={handleSelect}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
