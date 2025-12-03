import { getAllEvenements } from "./get-data"
import { EvenementsFilterWrapper } from "@/components/evenements-filter-wrapper"

export async function EvenementsContent() {
    const { data: evenements } = await getAllEvenements()

    return <EvenementsFilterWrapper initialEvents={evenements || []} />
}
