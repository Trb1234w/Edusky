import { Card } from "@/components/ui/card";
import { Accessibility } from "lucide-react";
import { normalizeArray } from "@/lib/utils/data-format";

interface AccessibiliteTabProps {
    accessibilite: any;
}

export function AccessibiliteTab({ accessibilite }: AccessibiliteTabProps) {
    const items = normalizeArray(accessibilite);

    if (items.length === 0) return null;

    return (
        <Card className="p-6 bg-background rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Accessibility className="h-6 w-6 text-primary" /> Accessibilité
            </h3>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <ul className="space-y-2">
                    {items.map((item: any, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-foreground/90">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                            <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
}
