import { Suspense } from "react"
import { DetailPageSkeleton } from "@/components/skeletons/DetailPageSkeleton"
import { EvenementDetailsPageContent } from "./page-content"

export default function EvenementDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <EvenementDetailsPageContent params={params} />
    </Suspense>
  )
}
