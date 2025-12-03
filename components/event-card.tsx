'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock, Users, Heart, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toggleFavoriteAction } from "@/app/actions/favorites"

interface EventCardProps {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    category: string
    participants: number
    maxParticipants: number
    organizer: string
    image: string
    status: string
    is_favorited: boolean
    price?: number
    isFree?: boolean
    onToggle?: (newStatus: boolean) => void
}

export function EventCard({
    id,
    title,
    description,
    date,
    time,
    location,
    category,
    participants,
    maxParticipants,
    organizer,
    image,
    status,
    is_favorited: initialIsFavorited,
    price,
    isFree,
    onToggle,
}: EventCardProps) {
    const router = useRouter();
    const [optimisticIsFavorited, addOptimisticFavorite] = useOptimistic(
        initialIsFavorited,
        (state) => !state
    );
    const [isPending, startTransition] = useTransition();

    const handleToggleFavorite = () => {
        const newStatus = !optimisticIsFavorited;
        startTransition(async () => {
            addOptimisticFavorite(null);
            if (onToggle) {
                onToggle(newStatus);
            }
            await toggleFavoriteAction('evenement', id);
        });
    };

    const eventDate = new Date(date)
    const isValidDate = !isNaN(eventDate.getTime())
    const day = isValidDate ? format(eventDate, 'dd', { locale: fr }) : '??'
    const month = isValidDate ? format(eventDate, 'MMM', { locale: fr }).toUpperCase() : '??'

    const formatPrice = (price?: number, isFree?: boolean) => {
        if (isFree) return "Gratuit";
        if (!price) return "Prix non spécifié";
        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "GNF" }).format(price);
    }

    return (
        <Link href={`/evenements/${id}`} className="group block h-full">
            <Card className="relative overflow-hidden h-full flex flex-col bg-card border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 rounded-2xl mb-0 lg:mb-3">

                {/* Image Section */}
                <div className="relative h-40 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${image || '/placeholder.svg'}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Date Badge */}
                    <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-white/20 flex flex-col items-center min-w-[50px]">
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase w-full text-center py-0.5">
                            {month}
                        </span>
                        <span className="text-xl font-bold text-foreground py-1">
                            {day}
                        </span>
                    </div>

                    {/* Favorite Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white border border-white/20"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleFavorite();
                        }}
                    >
                        <Heart className={cn(
                            "h-4 w-4 transition-all",
                            optimisticIsFavorited ? "fill-red-500 text-red-500" : "fill-none text-white"
                        )} />
                    </Button>

                    {/* Category Badge */}
                    <Badge
                        variant="secondary"
                        className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md text-white border-white/20 hover:bg-black/60"
                    >
                        {category}
                    </Badge>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-2 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors flex-1 mr-2">
                            {title}
                        </h3>
                        <Badge variant={isFree ? "secondary" : "default"} className="shrink-0 text-[10px] px-1.5 h-5">
                            {isFree ? "Gratuit" : (price ? `${price.toLocaleString()} GNF` : "Payant")}
                        </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {description}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-primary shrink-0" />
                            <span>{time}</span>
                        </div>
                        <span className="text-border">|</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <MapPin size={16} className="text-primary shrink-0" />
                            <span className="truncate">{location}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-2 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Users size={16} className="text-primary" />
                            <span>{participants} participants</span>
                        </div>

                        <Button size="sm" className="h-9 text-sm rounded-full px-5 group/btn">
                            Réserver
                            <Sparkles className="ml-2 w-3.5 h-3.5 transition-transform group-hover/btn:rotate-12" />
                        </Button>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

EventCard.Skeleton = function EventCardSkeleton() {
    return (
        <Card className="h-full flex flex-col overflow-hidden rounded-2xl">
            <div className="h-40 bg-muted relative">
                <Skeleton className="absolute top-3 left-3 h-12 w-12 rounded-xl" />
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="mt-auto pt-3 border-t border-border/50 flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </div>
        </Card>
    )
}
