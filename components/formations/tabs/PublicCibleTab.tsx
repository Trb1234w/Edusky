import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { normalizeArray } from "@/lib/utils/data-format";

interface PublicCibleTabProps {
    publicCible: any;
}

export function PublicCibleTab({ publicCible }: PublicCibleTabProps) {
    const items = normalizeArray(publicCible);

    if (items.length === 0) return null;

    return (
        <Card className="p-6 bg-background rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" /> Public Cible
            </h3>
            <div className="flex flex-wrap gap-3">
                {items.map((item: any, index: number) => (
                    <Badge
                        key={index}
                        variant="outline"
                        className="text-base px-4 py-2 bg-blue-50 border-blue-200"
                    >
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                    </Badge>
                ))}
            </div>
        </Card>
    );
}
