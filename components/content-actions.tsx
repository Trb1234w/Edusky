'use client'

import { Button } from "@/components/ui/button"
import { Heart, Share2 } from "lucide-react"
import { useOptimistic, useTransition } from "react"
import { toggleFavoriteAction } from "@/app/actions/favorites"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ContentActionsProps {
    itemId: string
    itemTitle: string
    itemType: 'formation' | 'evenement' | 'club' | 'article'
    initialIsFavorited: boolean
    variant?: 'mobile' | 'desktop'
    className?: string
    FavoriteIcon?: React.ElementType
}

export function ContentActions({
    itemId,
    itemTitle,
    itemType,
    initialIsFavorited,
    variant = 'desktop',
    className,
    FavoriteIcon = Heart
}: ContentActionsProps) {
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
            const result = await toggleFavoriteAction(itemType, itemId)

            if (result.success) {
                toast({
                    title: optimisticIsFavorited ? "Retiré des favoris" : "Ajouté aux favoris",
                    description: optimisticIsFavorited
                        ? "L'élément a été retiré de vos favoris."
                        : "L'élément a été ajouté à vos favoris.",
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

        // Determine the correct path based on item type
        let path = '';
        switch (itemType) {
            case 'evenement':
                path = '/evenements';
                break;
            case 'club':
                path = '/clubs';
                break;
            case 'article':
                path = '/blog';
                break;
            default:
                path = '';
        }

        const url = `${window.location.origin}${path}/${itemId}`

        // Try native share API first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: itemTitle,
                    text: `Découvrez ceci : ${itemTitle}`,
                    url: url,
                })
                toast({
                    title: "Partagé avec succès",
                    description: "Le lien a été partagé.",
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
                description: "Le lien a été copié dans le presse-papiers.",
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
            <div className={cn("flex items-center gap-1", className)}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleToggleFavorite}
                    disabled={isPending}
                >
                    <FavoriteIcon className={cn(
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
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-3 w-full", className)}>
            <Button
                size="lg"
                variant="outline"
                className="w-full text-lg font-semibold rounded-xl py-3"
                onClick={handleToggleFavorite}
                disabled={isPending}
            >
                <FavoriteIcon className={cn(
                    "mr-2 h-5 w-5 transition-all",
                    optimisticIsFavorited ? "fill-red-500 text-red-500" : "fill-none"
                )} />
                {optimisticIsFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>
            <Button
                size="lg"
                variant="ghost"
                className="w-full text-lg font-semibold rounded-xl py-3"
                onClick={handleShare}
            >
                <Share2 className="mr-2 h-5 w-5" />
                Partager
            </Button>
        </div>
    )
}
