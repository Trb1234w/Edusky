import { Card } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeArray } from "@/lib/utils/data-format";

interface RessourcesTabProps {
    ressources: any;
}

export function RessourcesTab({ ressources }: RessourcesTabProps) {
    const items = normalizeArray(ressources);

    if (items.length === 0) return null;

    return (
        <Card className="p-6 bg-background rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" /> Ressources Incluses
            </h3>
            <div className="grid gap-4">
                {items.map((item: any, index: number) => {
                    const isString = typeof item === 'string';
                    const titre = isString ? item : (item.titre || item.name || 'Ressource');
                    const type = !isString && item.type ? item.type : 'file';
                    const url = !isString && item.url ? item.url : null;

                    return (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{titre}</p>
                                    {!isString && item.description && (
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    )}
                                </div>
                            </div>
                            {url && (
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                        {type === 'link' ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                                    </a>
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
