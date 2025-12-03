import { Suspense } from "react"
import { FormationsHero } from "@/components/formations/FormationsHero"
import { FormationsContent } from "./formations-content"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { FormationsStickyHeaderStatic } from "@/components/formations/FormationsStickyHeaderStatic"

export default function FormationsPage() {
  return (
    <main className="flex-1 pt-1 lg:pt-20">
      {/* Hero Section (Desktop Only) */}
      <div className="hidden lg:block">
        <FormationsHero />
      </div>

      {/* Static Sticky Header for Mobile - Shows immediately */}
      <FormationsStickyHeaderStatic />

      <Suspense fallback={
        <div className="container mx-auto px-4 lg:px-8 pt-52 lg:pt-0 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-full flex flex-col overflow-hidden rounded-2xl">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <div className="flex justify-between mt-auto pt-3 border-t border-border/50">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      }>
        <FormationsContent />
      </Suspense>

    </main>
  )
}
