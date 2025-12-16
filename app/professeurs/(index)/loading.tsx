
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { ProfesseursHero } from "@/components/professeurs/ProfesseursHero"

export default function Loading() {
    return (
        <main className="flex-1 pt-1 lg:pt-20">
            {/* Hero Section */}
            <div className="hidden lg:block">
                <ProfesseursHero />
            </div>

            {/* Simulated Search Bar / Filter Area */}
            <div className="container mx-auto px-4 lg:px-8 mt-4 mb-4 lg:hidden">
                <Skeleton className="h-10 w-full rounded-xl" />
                <div className="flex gap-2 mt-2 overflow-x-hidden">
                    <Skeleton className="h-8 w-20 rounded-xl" />
                    <Skeleton className="h-8 w-24 rounded-xl" />
                    <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
            </div>

            {/* Sidebar Skeleton (Desktop) */}
            <div className="container mx-auto px-4 lg:px-8 lg:pt-0">
                <div className="flex gap-8">
                    <div className="hidden lg:block w-full max-w-xs mt-4">
                        <Card className="p-6 space-y-6">
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-1/3" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main List Skeleton */}
                    <div className="flex-1 py-4">
                        <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                            <div>
                                <Skeleton className="h-8 w-48 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="flex flex-col overflow-hidden rounded-2xl h-full">
                                    <div className="relative">
                                        <Skeleton className="h-48 w-full" />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col space-y-3">
                                        <div className="flex justify-between items-start">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-5 w-10" />
                                        </div>
                                        <Skeleton className="h-4 w-1/2" />

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                        </div>

                                        <div className="pt-4 mt-auto flex items-center justify-between border-t border-border/50">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
