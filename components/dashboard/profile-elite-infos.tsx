"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Briefcase, FolderRoot, Target, Plus, Trash2, Calendar, MapPin, ExternalLink, CheckCircle2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addEducationAction, deleteEducationAction, addExperienceAction, deleteExperienceAction, addPortfolioAction, deletePortfolioAction, addLearningGoalAction, deleteLearningGoalAction, updateLearningGoalStatusAction } from "@/app/dashboard/actions"

interface ProfileEliteInfosProps {
    profileId: string
    initialData: {
        education: any[]
        experience: any[]
        portfolio: any[]
        goals: any[]
    }
}

export function ProfileEliteInfos({ profileId, initialData }: ProfileEliteInfosProps) {
    const [data, setData] = useState(initialData)
    const [isPending, startTransition] = useTransition()

    // États pour les Dialogs
    const [isEduOpen, setIsEduOpen] = useState(false)
    const [isExpOpen, setIsExpOpen] = useState(false)
    const [isPortOpen, setIsPortOpen] = useState(false)
    const [isGoalOpen, setIsGoalOpen] = useState(false)

    // Handlers pour l'ajout
    const handleAddEducation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const payload = Object.fromEntries(formData.entries())

        startTransition(async () => {
            const result = await addEducationAction(payload)
            if (result.error) toast.error(result.error)
            else {
                toast.success("Parcours ajouté")
                setIsEduOpen(false)
                window.location.reload()
            }
        })
    }

    const handleAddExperience = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const payload = Object.fromEntries(formData.entries())

        startTransition(async () => {
            const result = await addExperienceAction(payload)
            if (result.error) toast.error(result.error)
            else {
                toast.success("Expérience ajoutée")
                setIsExpOpen(false)
                window.location.reload()
            }
        })
    }

    const handleAddPortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await addPortfolioAction(formData)
            if (result.error) toast.error(result.error)
            else {
                toast.success("Projet ajouté au portfolio")
                setIsPortOpen(false)
                window.location.reload()
            }
        })
    }

    const handleAddGoal = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const payload = Object.fromEntries(formData.entries())

        startTransition(async () => {
            const result = await addLearningGoalAction(payload)
            if (result.error) toast.error(result.error)
            else {
                toast.success("Objectif enregistré")
                setIsGoalOpen(false)
                window.location.reload()
            }
        })
    }

    const handleToggleGoalStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'en_cours' ? 'atteint' : 'en_cours'
        startTransition(async () => {
            const result = await updateLearningGoalStatusAction(id, newStatus)
            if (result.error) toast.error(result.error)
            else {
                toast.success(`Objectif marqué comme ${newStatus === 'atteint' ? 'atteint' : 'en cours'}`)
                window.location.reload()
            }
        })
    }

    const handleDelete = async (id: string, type: 'education' | 'experience' | 'portfolio' | 'goal') => {
        if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return

        startTransition(async () => {
            let result;
            switch (type) {
                case 'education': result = await deleteEducationAction(id); break;
                case 'experience': result = await deleteExperienceAction(id); break;
                case 'portfolio': result = await deletePortfolioAction(id); break;
                case 'goal': result = await deleteLearningGoalAction(id); break;
            }

            if (result?.error) {
                toast.error("Erreur", { description: result.error })
            } else {
                toast.success("Supprimé avec succès")
                // Mise à jour locale de l'état
                setData(prev => ({
                    ...prev,
                    [type === 'goal' ? 'goals' : type]: prev[type === 'goal' ? 'goals' : type as keyof typeof prev].filter((item: any) => item.id !== id)
                }))
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Section Expérience */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        Expériences Professionnelles
                    </h3>
                    <Dialog open={isExpOpen} onOpenChange={setIsExpOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> Ajouter
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Ajouter une expérience</DialogTitle>
                                <DialogDescription>Décrivez votre parcours professionnel.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddExperience} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Poste</Label>
                                        <Input id="title" name="title" placeholder="ex: Développeur Fullstack" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">Entreprise</Label>
                                        <Input id="company_name" name="company_name" placeholder="ex: Google" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Lieu</Label>
                                    <Input id="location" name="location" placeholder="ex: Paris, France (ou Télétravail)" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Date de début</Label>
                                        <Input id="start_date" name="start_date" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">Date de fin</Label>
                                        <Input id="end_date" name="end_date" type="date" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" placeholder="Quelles étaient vos missions ?" className="h-24" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Enregistrer
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid gap-4">
                    {data.experience.length > 0 ? data.experience.map((exp) => (
                        <Card key={exp.id} className="group overflow-hidden border-primary/10 hover:border-primary/30 transition-all shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-lg">{exp.title}</h4>
                                        <p className="text-primary font-medium">{exp.company_name}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(exp.start_date).getFullYear()} - {exp.current ? "Présent" : new Date(exp.end_date).getFullYear()}</span>
                                            {exp.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {exp.location}</span>}
                                        </div>
                                        {exp.description && <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{exp.description}</p>}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(exp.id, 'experience')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <p className="text-muted-foreground text-center py-8 bg-muted/20 rounded-xl border-2 border-dashed">Aucune expérience ajoutée</p>
                    )}
                </div>
            </section>

            {/* Section Éducation */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-secondary" />
                        Parcours Scolaire & Diplômes
                    </h3>
                    <Dialog open={isEduOpen} onOpenChange={setIsEduOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> Ajouter
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Ajouter un diplôme ou une formation</DialogTitle>
                                <DialogDescription>Votre parcours éducatif.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddEducation} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="school_name">École / Université</Label>
                                    <Input id="school_name" name="school_name" placeholder="ex: Université de Conakry" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="degree">Diplôme</Label>
                                        <Input id="degree" name="degree" placeholder="ex: Master" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="field_of_study">Domaine d'étude</Label>
                                        <Input id="field_of_study" name="field_of_study" placeholder="ex: Informatique" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">Date de début</Label>
                                        <Input id="start_date" name="start_date" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">Date de fin (optionnel)</Label>
                                        <Input id="end_date" name="end_date" type="date" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Enregistrer
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid gap-4">
                    {data.education.length > 0 ? data.education.map((edu) => (
                        <Card key={edu.id} className="group border-secondary/10 hover:border-secondary/30 transition-all shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-lg">{edu.degree} {edu.field_of_study ? `en ${edu.field_of_study}` : ''}</h4>
                                        <p className="text-secondary font-medium">{edu.school_name}</p>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                                            <Calendar className="w-4 h-4" /> {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : "En cours"}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(edu.id, 'education')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <p className="text-muted-foreground text-center py-8 bg-muted/20 rounded-xl border-2 border-dashed">Aucun parcours ajouté</p>
                    )}
                </div>
            </section>

            {/* Section Portfolio */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <FolderRoot className="w-6 h-6 text-accent" />
                        Portfolio & Projets
                    </h3>
                    <Dialog open={isPortOpen} onOpenChange={setIsPortOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> Ajouter
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Ajouter un projet</DialogTitle>
                                <DialogDescription>Montrez vos réalisations concrètes.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddPortfolio} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre du projet</Label>
                                    <Input id="title" name="title" placeholder="ex: Application de gestion" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description courte</Label>
                                    <Textarea id="description" name="description" placeholder="Expliquez brièvement le projet" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project_url">Lien du projet (URL)</Label>
                                    <Input id="project_url" name="project_url" type="url" placeholder="https://..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image / Capture (optionnel)</Label>
                                    <Input id="image" name="image" type="file" accept="image/*" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="skills">Compétences utilisées (séparées par des virgules)</Label>
                                    <Input id="skills" name="skills" placeholder="ex: React, Node.js, CSS" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Enregistrer
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.portfolio.length > 0 ? data.portfolio.map((item) => (
                        <Card key={item.id} className="group overflow-hidden border-accent/10 hover:border-accent/30 transition-all shadow-md">
                            {item.image_url && (
                                <div className="aspect-video w-full overflow-hidden">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                </div>
                            )}
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg leading-tight">{item.title}</h4>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive -mt-1 -mr-1"
                                        onClick={() => handleDelete(item.id, 'portfolio')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {item.skills_used?.map((skill: string) => (
                                        <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">{skill}</Badge>
                                    ))}
                                </div>
                                {item.project_url && (
                                    <Button variant="link" className="p-0 h-auto text-primary text-sm gap-1" asChild>
                                        <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                                            Voir le projet <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="col-span-full">
                            <p className="text-muted-foreground text-center py-8 bg-muted/20 rounded-xl border-2 border-dashed">Aucun projet dans votre portfolio</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Section Objectifs */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Target className="w-6 h-6 text-orange-500" />
                        Objectifs d'Apprentissage
                    </h3>
                    <Dialog open={isGoalOpen} onOpenChange={setIsGoalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> Ajouter
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle>Établir un objectif</DialogTitle>
                                <DialogDescription>Qu'êtes-vous en train d'apprendre ?</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddGoal} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="goal_title">Votre objectif</Label>
                                    <Input id="goal_title" name="goal_title" placeholder="ex: Apprendre Python" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="target_date">Date cible (optionnel)</Label>
                                    <Input id="target_date" name="target_date" type="date" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Fixer l'objectif
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid gap-3">
                    {data.goals.length > 0 ? data.goals.map((goal) => (
                        <div key={goal.id} className="group flex items-center justify-between p-4 bg-white dark:bg-card rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-all shadow-sm">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleToggleGoalStatus(goal.id, goal.status)}
                                    className={goal.status === 'atteint' ? "text-green-500 hover:scale-110 transition-transform" : "text-muted-foreground hover:text-orange-500 hover:scale-110 transition-transform"}
                                    title={goal.status === 'atteint' ? "Marquer comme en cours" : "Marquer comme atteint"}
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                </button>
                                <div>
                                    <h4 className={`font-semibold ${goal.status === 'atteint' ? 'line-through text-muted-foreground' : ''}`}>{goal.goal_title}</h4>
                                    {goal.target_date && <p className="text-xs text-muted-foreground">Échéance : {new Date(goal.target_date).toLocaleDateString()}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={goal.status === 'atteint' ? "default" : "secondary"}>
                                    {goal.status === 'atteint' ? "Atteint" : "En cours"}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDelete(goal.id, 'goal')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-center py-8 bg-muted/20 rounded-xl border-2 border-dashed">Aucun objectif défini</p>
                    )}
                </div>
            </section>
        </div>
    )
}
