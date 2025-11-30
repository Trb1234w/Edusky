import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { normalizeArray } from "@/lib/utils/data-format";

interface JobsTabProps {
    jobs: any;
}

export function JobsTab({ jobs }: JobsTabProps) {
    const items = normalizeArray(jobs);

    if (items.length === 0) return null;

    return (
        <Card className="p-6 bg-background rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" /> Débouchés Métiers
            </h3>
            <p className="text-muted-foreground mb-4">Cette formation vous prépare aux métiers suivants :</p>
            <div className="flex flex-wrap gap-3">
                {items.map((item: any, index: number) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="text-base px-4 py-2 hover:bg-primary/20 transition-colors"
                    >
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                    </Badge>
                ))}
            </div>
        </Card>
    );
}
