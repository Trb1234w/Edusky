import { Card } from "@/components/ui/card";
import { Info, Clock, BarChart3, Computer, GraduationCap, Calendar, Users, Globe, Building2, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InfosTabProps {
    formation: any;
    formatPrice: (price: number | null | undefined) => string;
    formatDate: (date: string | null | undefined) => string;
}

export function InfosTab({ formation, formatPrice, formatDate }: InfosTabProps) {
    return (
        <Card className="p-6 bg-background rounded-2xl shadow-lg lg:hidden">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="h-6 w-6 text-primary" /> Informations Clés
            </h3>

            <div className="space-y-4">
                {/* Prix */}
                <div className="flex items-start gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <Tag className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Prix indicatif</span>
                        <span className="text-primary text-lg font-bold">
                            {formatPrice(formation.prix_indicatif)}
                        </span>
                    </div>
                </div>

                {/* Durée */}
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Durée</span>
                        <span className="text-muted-foreground text-sm">{formation.duree_texte || 'N/A'}</span>
                    </div>
                </div>

                {/* Niveau */}
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Niveau</span>
                        <span className="text-muted-foreground text-sm">{formation.niveau || 'Tous niveaux'}</span>
                    </div>
                </div>

                {/* Mode */}
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <Computer className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Mode</span>
                        <Badge variant="outline" className="capitalize">
                            {formation.mode?.replace('_', ' ') || 'Non spécifié'}
                        </Badge>
                    </div>
                </div>

                {/* Certificat */}
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                        <span className="font-bold text-sm block mb-1">Certificat</span>
                        <span className="text-muted-foreground text-sm">{formation.certificat ? 'Oui, inclus' : 'Non'}</span>
                    </div>
                </div>

                {/* Dates */}
                {(formation.date_debut || formation.date_fin) && (
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <span className="font-bold text-sm block mb-1">Dates</span>
                            <div className="text-sm text-muted-foreground">
                                {formation.date_debut && <p>Début : {formatDate(String(formation.date_debut))}</p>}
                                {formation.date_fin && <p>Fin : {formatDate(String(formation.date_fin))}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Lieu */}
                {(formation.lieu || formation.ville || formation.pays) && (
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                            <span className="font-bold text-sm block mb-1">Localisation</span>
                            <p className="text-sm text-muted-foreground">
                                {[formation.lieu, formation.ville?.nom, formation.pays?.nom].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
