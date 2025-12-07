"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { CategoryNode } from "./HorizontalCategoryNav";
import { CategoryModal } from "./CategoryModal";

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedSlugs?.includes(node.slug);

  const handleCategorySelect = (slugs: string[]) => {
    onCategorySelect(slugs);
  };

  // Si pas d'enfants, bouton simple
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

  // Si a des enfants, bouton qui ouvre le modal
  return (
    <>
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        className="rounded-full whitespace-nowrap pr-2"
        onClick={() => setIsModalOpen(true)}
      >
        {activeLabel || node.nom}
        <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", isModalOpen && "rotate-180")} />
      </Button>

      <CategoryModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        category={node}
        selectedSlugs={selectedSlugs}
        onCategorySelect={handleCategorySelect}
        onLabelSelect={onLabelSelect}
      />
    </>
  );
}
