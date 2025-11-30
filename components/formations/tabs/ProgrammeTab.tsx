import { Card } from "@/components/ui/card";
import { List, Target, Check } from "lucide-react";
import { normalizeArray } from "@/lib/utils/data-format";

interface ProgrammeTabProps {
    programme: any;
}

export function ProgrammeTab({ programme }: ProgrammeTabProps) {
    if (!programme) return null;

    // Si c'est une simple string
    if (typeof programme === 'string') {
        return (
            <Card className="p-6 bg-background rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <List className="h-6 w-6 text-primary" /> Programme Détaillé
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{programme}</p>
                </div>
            </Card>
        );
    }

    // Si c'est un tableau simple
    if (Array.isArray(programme)) {
        return (
            <Card className="p-6 bg-background rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <List className="h-6 w-6 text-primary" /> Programme Détaillé
                </h3>
                <ul className="space-y-2">
                    {programme.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        );
    }

    // Si c'est un objet structuré (ex: { objectifs: [], contenu: [] })
    return (
        <div className="space-y-6">
            {programme.objectifs && (
                <Card className="p-6 bg-background rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Target className="h-6 w-6 text-primary" /> Objectifs Pédagogiques
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {normalizeArray(programme.objectifs).map((obj: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{obj}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {programme.contenu && (
                <Card className="p-6 bg-background rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <List className="h-6 w-6 text-primary" /> Contenu de la Formation
                    </h3>
                    <div className="space-y-4">
                        {normalizeArray(programme.contenu).map((item: any, i: number) => (
                            <div key={i} className="border-l-2 border-primary/30 pl-4 py-1">
                                <p className="font-medium text-foreground">{typeof item === 'string' ? item : item.titre || JSON.stringify(item)}</p>
                                {typeof item !== 'string' && item.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
