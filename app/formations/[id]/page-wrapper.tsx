import { Suspense } from "react"
import { DetailPageSkeleton } from "@/components/skeletons/DetailPageSkeleton"
import { FormationDetailsPageContent } from "./page-content"

export default function FormationDetailsPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<DetailPageSkeleton />}>
            <FormationDetailsPageContent params={params} />
        </Suspense>
    )
}
