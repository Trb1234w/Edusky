'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import {
    Search,
    SlidersHorizontal,
    ArrowLeft,
} from "lucide-react"

export function EvenementsStickyHeaderStatic() {
    const router = useRouter();

    return (
        <div className="lg:hidden" data-static-header="evenements">
            <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="md:hidden px-4 py-2 border-b flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <span className="text-lg font-semibold ml-2">Événements</span>
                </div>
                <div className="px-4 py-2 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Rechercher un événement..."
                            className="pl-10 h-10 rounded-xl border-border/50 focus:ring-2 focus:ring-primary"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <Button variant="outline" size="sm" className="rounded-xl pointer-events-none">
                        <SlidersHorizontal size={16} />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl whitespace-nowrap pointer-events-none">
                        Date
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl whitespace-nowrap pointer-events-none">
                        Type
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl whitespace-nowrap pointer-events-none">
                        Prix
                    </Button>
                </div>

                {/* Skeleton for HorizontalCategoryNav */}
                <div className="flex items-center gap-2 px-4 py-2 border-b overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap pointer-events-none">
                        Toutes
                    </Button>
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
            </div>
        </div>
    )
}
