import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SessionsTabProps {
    sessions: any[];
    formatDate: (date: string | null | undefined) => string;
}

export function SessionsTab({ sessions, formatDate }: SessionsTabProps) {
    return (
        <Card className="p-6 bg-background rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" /> Sessions disponibles
            </h3>
            {sessions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {sessions.map((session: any) => (
                        <Card key={session.id} className="p-4 border-l-4 border-l-primary hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <span className="font-bold text-lg">
                                            {formatDate(session.debut)} - {formatDate(session.fin)}
                                        </span>
                                    </div>
                                    {session.lieu && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{session.lieu}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{session.places_reservees || 0} / {session.capacite} places réservées</span>
                                    </div>
                                </div>
                                <div>
                                    <Badge variant={session.statut === 'ouvert' ? 'default' : 'secondary'} className="capitalize mb-2 md:mb-0">
                                        {session.statut}
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">Aucune session programmée pour le moment.</p>
            )}
        </Card>
    );
}
