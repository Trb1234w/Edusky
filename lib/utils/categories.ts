import { CategoryNode } from '@/components/categories/CategoryDialog';

export type Category = {
    id: string;
    nom: string;
    slug: string;
    parent_id: string | null;
};

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
    const categoryMap = new Map<string, CategoryNode>();
    const rootCategories: CategoryNode[] = [];

    // First pass: create all nodes
    categories.forEach(c => categoryMap.set(c.id, { ...c, children: [] }));

    // Second pass: build tree structure
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
