"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Briefcase, FolderRoot, Target, Calendar, MapPin, ExternalLink, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProfileEliteViewProps {
    data: {
        education: any[]
        experience: any[]
        portfolio: any[]
        goals: any[]
    }
}

export function ProfileEliteView({ data }: ProfileEliteViewProps) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Section Expérience */}
            {data.experience.length > 0 && (
                <section className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-2 border-primary/20">
                        <Briefcase className="w-7 h-7 text-primary" />
                        Expériences Professionnelles
                    </h3>
                    <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-muted-foreground/20">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="relative group">
                                <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-background border-2 border-background" />
                                <div className="space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                                        <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{exp.title}</h4>
                                        <span className="text-sm font-semibold bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(exp.start_date).getFullYear()} — {exp.current ? "Présent" : new Date(exp.end_date).getFullYear()}
                                        </span>
                                    </div>
                                    <p className="text-lg text-primary/80 font-medium">{exp.company_name}</p>
                                    {exp.location && (
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm italic">
                                            <MapPin className="w-4 h-4" /> {exp.location}
                                        </div>
                                    )}
                                    {exp.description && (
                                        <p className="mt-4 text-foreground/80 leading-relaxed text-sm max-w-3xl whitespace-pre-line bg-muted/30 p-4 rounded-lg border-l-4 border-primary/40">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Section Éducation */}
            {data.education.length > 0 && (
                <section className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-2 border-secondary/20">
                        <GraduationCap className="w-7 h-7 text-secondary" />
                        Parcours Académique
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.education.map((edu) => (
                            <Card key={edu.id} className="relative overflow-hidden group hover:shadow-lg transition-all border-secondary/10 hover:border-secondary/40">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <GraduationCap className="w-12 h-12" />
                                </div>
                                <CardContent className="p-6 space-y-3">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold leading-tight group-hover:text-secondary transition-colors">
                                            {edu.degree} {edu.field_of_study ? `en ${edu.field_of_study}` : ''}
                                        </h4>
                                        <p className="text-secondary font-semibold">{edu.school_name}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(edu.start_date).getFullYear()} — {edu.end_date ? new Date(edu.end_date).getFullYear() : "En cours"}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Section Portfolio */}
            {data.portfolio.length > 0 && (
                <section className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-2 border-accent/20">
                        <FolderRoot className="w-7 h-7 text-accent" />
                        Réalisations & Portfolio
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.portfolio.map((item) => (
                            <Card key={item.id} className="group overflow-hidden flex flex-col hover:shadow-xl transition-all border-accent/10 hover:border-accent/30">
                                {item.image_url ? (
                                    <div className="aspect-video w-full overflow-hidden relative">
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {item.project_url && (
                                                <Button size="sm" variant="secondary" className="gap-2" asChild>
                                                    <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                                                        Voir <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground/30">
                                        <FolderRoot className="w-12 h-12" />
                                    </div>
                                )}
                                <CardContent className="p-5 flex-1 flex flex-col space-y-4">
                                    <div>
                                        <h4 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">{item.title}</h4>
                                        {item.description && <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{item.description}</p>}
                                    </div>

                                    <div className="mt-auto pt-4">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {item.skills_used?.map((skill: string) => (
                                                <Badge key={skill} variant="outline" className="text-[10px] uppercase tracking-wider font-bold border-accent/30 text-accent/80">{skill}</Badge>
                                            ))}
                                        </div>
                                        {item.project_url && !item.image_url && (
                                            <Button variant="link" className="p-0 h-auto text-accent text-sm gap-2 font-bold" asChild>
                                                <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                                                    Explorer le projet <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Section Objectifs (Optionnelle en vue publique selon le choix, mais on l'affiche) */}
            {data.goals.length > 0 && (
                <section className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 border-b pb-2 border-orange-500/20">
                        <Target className="w-7 h-7 text-orange-500" />
                        Objectifs en cours
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.goals.map((goal) => (
                            <div key={goal.id} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-card border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-all">
                                <div className={goal.status === 'atteint' ? "text-green-500 bg-green-50 dark:bg-green-500/10 p-2 rounded-full" : "text-orange-500 bg-orange-50 dark:bg-orange-500/10 p-2 rounded-full"}>
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-lg font-bold ${goal.status === 'atteint' ? 'line-through text-muted-foreground' : ''}`}>
                                        {goal.goal_title}
                                    </h4>
                                    {goal.target_date && <p className="text-sm text-muted-foreground">Prévu pour le {new Date(goal.target_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>}
                                </div>
                                <Badge variant={goal.status === 'atteint' ? "default" : "secondary"} className={goal.status === 'atteint' ? "bg-green-500 hover:bg-green-600" : ""}>
                                    {goal.status === 'atteint' ? "Atteint" : "Focus"}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Message si vide */}
            {data.experience.length === 0 && data.education.length === 0 && data.portfolio.length === 0 && data.goals.length === 0 && (
                <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-muted-foreground/20">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/40">
                            <Briefcase className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-muted-foreground">Profil en attente d'enrichissement</h3>
                        <p className="text-muted-foreground/60">Cet utilisateur n'a pas encore partagé son parcours ou ses réalisations.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
