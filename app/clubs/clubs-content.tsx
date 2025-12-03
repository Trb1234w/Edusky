import { getAllClubs } from "./get-data"
import { ClubsFilterWrapper } from "@/components/clubs-filter-wrapper"

export async function ClubsContent() {
    const { data: clubs } = await getAllClubs()

    return <ClubsFilterWrapper initialClubs={clubs || []} />
}
