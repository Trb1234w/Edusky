import { Suspense } from "react"
import { DetailPageSkeleton } from "@/components/skeletons/DetailPageSkeleton"
import { ClubDetailsPageContent } from "./page-content"

export default function ClubDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <ClubDetailsPageContent params={params} />
    </Suspense>
  )
}
