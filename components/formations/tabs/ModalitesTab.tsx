import { Card } from "@/components/ui/card";
import { Award, CheckCircle } from "lucide-react";
import { normalizeArray } from "@/lib/utils/data-format";

interface ModalitesTabProps {
    modalites: any;
}

export function ModalitesTab({ modalites }: ModalitesTabProps) {
    const items = normalizeArray(modalites);

    if (items.length === 0) return null;

    return (
        <Card className="p-6 bg-background rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" /> Modalités d'évaluation
            </h3>
            <div className="space-y-4">
                {items.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-foreground/90">{typeof item === 'string' ? item : JSON.stringify(item)}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
