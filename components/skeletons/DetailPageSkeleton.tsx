import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"

export function DetailPageSkeleton() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Mobile-only Header */}
            <div className="lg:hidden p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between">
                <div className="p-2 -ml-2 rounded-full">
                    <ChevronLeft className="h-6 w-6" />
                </div>
                <Skeleton className="h-6 w-40 flex-1 mx-4" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>

            <main className="flex-1 pb-32 lg:pb-0">
                {/* Section Média (Image/Vidéo) */}
                <Skeleton className="h-56 md:h-80 lg:h-96 w-full" />

                <div className="container mx-auto -mt-24 md:-mt-32 lg:-mt-40 relative z-10 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">

                        {/* Colonne de gauche : Contenu principal */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Carte Hero */}
                            <Card className="p-6 md:p-8 bg-white backdrop-blur-sm shadow-2xl rounded-2xl border-none">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-10 w-full mb-3" />
                                <Skeleton className="h-6 w-3/4 mb-4" />

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                </div>

                                {/* Professeur */}
                                <div className="flex items-center space-x-4 pt-6">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </Card>

                            {/* Barre de statistiques rapide (Mobile/Tablet) */}
                            <Card className="lg:hidden grid grid-cols-2 gap-4 p-4 bg-background/80 backdrop-blur-sm shadow-xl rounded-2xl border-none">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </Card>

                            {/* Contenu principal avec onglets */}
                            <div className="w-full">
                                {/* TabsList */}
                                <div className="flex w-full overflow-x-auto gap-2 mb-6 [&::-webkit-scrollbar]:hidden">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton key={i} className="h-10 w-24 flex-shrink-0 rounded-full" />
                                    ))}
                                </div>

                                {/* TabsContent */}
                                <Card className="p-6 bg-background rounded-2xl shadow-lg">
                                    <Skeleton className="h-6 w-48 mb-4" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t">
                                        {[1, 2, 3, 4].map((i) => (
                                            <Skeleton key={i} className="h-4 w-full" />
                                        ))}
                                    </div>
                                </Card>
                            </div>

                        </div>

                        {/* Colonne de droite : Sidebar (Desktop uniquement) */}
                        <div className="hidden lg:block space-y-6">
                            {/* Card Prix et Inscription */}
                            <Card className="p-6 bg-white shadow-2xl rounded-2xl border-none sticky top-24">
                                <Skeleton className="h-10 w-32 mb-4" />
                                <Skeleton className="h-12 w-full mb-3 rounded-xl" />
                                <Skeleton className="h-12 w-full mb-6 rounded-xl" />

                                <div className="space-y-3 mb-6">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-3/4" />
                                </div>

                                <div className="border-t pt-4 space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </Card>
                        </div>

                    </div>

                    {/* Section "Formations similaires" ou "Related" */}
                    <div className="mt-12 mb-8">
                        <Skeleton className="h-8 w-64 mb-6" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="h-full flex flex-col overflow-hidden rounded-2xl">
                                    <Skeleton className="h-40 w-full" />
                                    <div className="p-4 flex-1 flex flex-col">
                                        <Skeleton className="h-5 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-1/2 mb-3" />
                                        <Skeleton className="h-12 w-full mb-4" />
                                        <div className="flex justify-between mt-auto">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
