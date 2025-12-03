'use client'

import { Button } from "@/components/ui/button"
import { Heart, Share2 } from "lucide-react"
import { useOptimistic, useTransition } from "react"
import { toggleFavoriteAction } from "@/app/actions/favorites"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface FormationActionsProps {
    formationId: string
    formationTitle: string
    initialIsFavorited: boolean
    variant?: 'mobile' | 'desktop'
}

export function FormationActions({
    formationId,
    formationTitle,
    initialIsFavorited,
    variant = 'desktop'
}: FormationActionsProps) {
    const { toast } = useToast()
    const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
        initialIsFavorited,
        (state) => !state
    )
    const [isPending, startTransition] = useTransition()

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        startTransition(async () => {
            addOptimisticFavorite(null)
            const result = await toggleFavoriteAction('formation', formationId)

            if (result.success) {
                toast({
                    title: optimisticIsFavorited ? "Retiré des favoris" : "Ajouté aux favoris",
                    description: optimisticIsFavorited
                        ? "La formation a été retirée de vos favoris."
                        : "La formation a été ajoutée à vos favoris.",
                })
            } else {
                toast({
                    title: "Erreur",
                    description: result.error || "Une erreur est survenue.",
                    variant: "destructive",
                })
            }
        })
    }

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const url = `${window.location.origin}/formations/${formationId}`

        // Try native share API first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: formationTitle,
                    text: `Découvrez cette formation : ${formationTitle}`,
                    url: url,
                })
                toast({
                    title: "Partagé avec succès",
                    description: "La formation a été partagée.",
                })
                return
            } catch (err) {
                // User cancelled or share failed, fall back to clipboard
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err)
                }
            }
        }

        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(url)
            toast({
                title: "Lien copié !",
                description: "Le lien de la formation a été copié dans le presse-papiers.",
            })
        } catch (err) {
            console.error('Error copying to clipboard:', err)
            toast({
                title: "Erreur",
                description: "Impossible de copier le lien.",
                variant: "destructive",
            })
        }
    }

    if (variant === 'mobile') {
        return (
            <>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleToggleFavorite}
                    disabled={isPending}
                >
                    <Heart className={cn(
                        "h-5 w-5 transition-all",
                        optimisticIsFavorited ? "fill-red-500 text-red-500" : "fill-none"
                    )} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleShare}
                >
                    <Share2 className="h-5 w-5" />
                </Button>
            </>
        )
    }

    return (
        <Button
            size="lg"
            variant="outline"
            className="w-full text-lg font-semibold rounded-xl py-3"
            onClick={handleToggleFavorite}
            disabled={isPending}
        >
            <Heart className={cn(
                "mr-2 h-5 w-5 transition-all",
                optimisticIsFavorited ? "fill-red-500 text-red-500" : "fill-none"
            )} />
            {optimisticIsFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
        </Button>
    )
}
