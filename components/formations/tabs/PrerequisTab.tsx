import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { normalizeArray } from "@/lib/utils/data-format";

interface PrerequisTabProps {
    prerequis: any;
}

export function PrerequisTab({ prerequis }: PrerequisTabProps) {
    const items = normalizeArray(prerequis);

    if (items.length === 0) return null;

    return (
        <Card className="p-6 bg-background rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" /> Prérequis
            </h3>
            <ul className="space-y-3">
                {items.map((item: any, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/90">{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
