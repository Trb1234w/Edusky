import { Suspense } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getSuggestedProfiles } from "@/lib/data/users.server"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FeedContent } from "./feed-content"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = 'force-dynamic'

// Skeleton pour le feed pendant le chargement
function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-6">
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
  )
}

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/connexion")
  }

  // Récupérer SEULEMENT les données rapides (pas les posts)
  const [profileResult, followingResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .single(),
    supabase
      .from('suivis')
      .select('followed_id')
      .eq('follower_id', user.id)
  ])

  const profile = profileResult.data
  const followingIds = followingResult.data ? followingResult.data.map(f => f.followed_id) : []

  // Récupérer les profils suggérés (rapide)
  const { data: suggestedProfiles } = await getSuggestedProfiles(user.id, followingIds)

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="pt-10">
        <section className="container mx-auto py-2 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Sidebar */}
            <div className="hidden lg:block">
              <Card className="sticky top-22 border-border">
                <CardContent className="p-4">
                  <h3 className="font-bold text-foreground mb-3">Suggestions</h3>
                  <div className="space-y-3">
                    {suggestedProfiles && suggestedProfiles.length > 0 ? (
                      suggestedProfiles.map((suggestion: any) => (
                        <div key={suggestion.id} className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={suggestion.avatar_url || "/placeholder.svg"} alt={suggestion.full_name || suggestion.username} />
                            <AvatarFallback>{suggestion.full_name ? suggestion.full_name[0] : suggestion.username[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{suggestion.full_name || suggestion.username}</p>
                            <p className="text-xs text-muted-foreground truncate">{suggestion.role}</p>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            Suivre
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucune suggestion pour le moment.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Feed avec Suspense */}
            <div className="lg:col-span-2">
              <Suspense fallback={<FeedSkeleton />}>
                <FeedContent
                  userId={user.id}
                  followingIds={followingIds}
                  profile={profile}
                />
              </Suspense>
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
