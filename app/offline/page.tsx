import Link from "next/link"
import { WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <WifiOff className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">Vous êtes hors ligne</h1>
            <p className="mb-8 text-muted-foreground">
                Il semble que vous n'ayez pas de connexion internet. Vérifiez votre réseau et réessayez.
            </p>
            <Button asChild>
                <Link href="/">Réessayer</Link>
            </Button>
        </div>
    )
}
