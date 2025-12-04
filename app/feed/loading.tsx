import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-muted/30">
            <main className="pt-10">
                <section className="container mx-auto py-2 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Left Sidebar - Hidden on mobile */}
                        <div className="hidden lg:block">
                            <Card className="sticky top-22 border-border">
                                <CardContent className="p-4">
                                    <Skeleton className="h-6 w-32 mb-4" />
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <Skeleton className="w-12 h-12 rounded-full" />
                                                <div className="flex-1 min-w-0">
                                                    <Skeleton className="h-4 w-24 mb-1" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                                <Skeleton className="h-8 w-16" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Feed */}
                        <div className="lg:col-span-2">
                            {/* Mobile Header */}
                            <div className="md:hidden">
                                <div className="bg-background border-b pt-20 space-y-2">
                                    <div className="grid w-full grid-cols-2 bg-muted/60 p-1.5 rounded-full">
                                        <Skeleton className="h-10 rounded-full" />
                                        <Skeleton className="h-10 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Header */}
                            <div className="hidden md:block space-y-4">
                                <Card className="border-border">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <Skeleton className="w-12 h-12 rounded-full" />
                                            <div className="flex-1">
                                                <Skeleton className="h-24 w-full mb-4" />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-2">
                                                        <Skeleton className="h-8 w-8 rounded-full" />
                                                        <Skeleton className="h-8 w-8 rounded-full" />
                                                        <Skeleton className="h-8 w-8 rounded-full" />
                                                        <Skeleton className="h-8 w-8 rounded-full" />
                                                    </div>
                                                    <Skeleton className="h-8 w-24" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="grid w-full grid-cols-2 bg-muted/60 p-1.5 rounded-full">
                                    <Skeleton className="h-10 rounded-full" />
                                    <Skeleton className="h-10 rounded-full" />
                                </div>
                            </div>

                            {/* Posts Skeleton */}
                            <div className="space-y-4 mt-4 divide-y divide-border">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Card key={index} className="p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-48" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-24 w-full mb-4" />
                                        <div className="flex justify-between">
                                            <Skeleton className="h-8 w-24" />
                                            <Skeleton className="h-8 w-24" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
