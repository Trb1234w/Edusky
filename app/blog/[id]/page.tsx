import { Suspense } from "react"
import { DetailPageSkeleton } from "@/components/skeletons/DetailPageSkeleton"
import { ArticleDetailsPageContent } from "./page-content"

export default function ArticleDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<DetailPageSkeleton />}>
      <ArticleDetailsPageContent params={params} />
    </Suspense>
  )
}
