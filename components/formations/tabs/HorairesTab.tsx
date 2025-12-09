import { Card } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HorairesTabProps {
    horaires: any;
    joursFormation: any;
}

const dayMap: { [key: string]: string } = {
    lu: 'Lundi', ma: 'Mardi', me: 'Mercredi', je: 'Jeudi', ve: 'Vendredi', sa: 'Samedi', di: 'Dimanche',
    lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi', jeudi: 'Jeudi', vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche',
    monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche'
};

export function HorairesTab({ horaires, joursFormation }: HorairesTabProps) {
    const hasJours = joursFormation && Object.keys(joursFormation).length > 0;
    const hasHoraires = horaires && Object.keys(horaires).length > 0;

    if (!hasJours && !hasHoraires) return null;

    return (
        <div className="space-y-6">
            {hasJours && (
                <Card className="p-6 bg-background rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-primary" /> Jours de Formation
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(joursFormation).map(([jour, actif]: [string, any]) => (
                            actif && (
                                <Badge key={jour} variant="secondary" className="text-base px-4 py-2 capitalize">
                                    {dayMap[jour.toLowerCase()] || jour}
                                </Badge>
                            )
                        ))}
                    </div>
                </Card>
            )}

            {hasHoraires && (
                <Card className="p-6 bg-background rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-primary" /> Emploi du Temps
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(horaires).map(([jour, horaire]: [string, any]) => {
                            if (!horaire || (!horaire.actif && !horaire.debut)) return null;

                            const debut = horaire.debut || "N/A";
                            const fin = horaire.fin || "N/A";

                            return (
                                <div key={jour} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-bold text-sm block mb-1">{dayMap[jour.toLowerCase()] || jour}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-mono bg-background px-3 py-1 rounded border">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <span>{debut} - {fin}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
}
