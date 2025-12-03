import { getAllFormations } from "./get-locations"
import { FormationsFilterWrapper } from "@/components/formations-filter-wrapper"

export async function FormationsContent() {
    const { data: formations } = await getAllFormations()

    return <FormationsFilterWrapper initialFormations={formations || []} />
}
