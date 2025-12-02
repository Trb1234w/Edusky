'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, SlidersHorizontal, X, FileText, Users, GraduationCap, Calendar, UsersRound, BookmarkIcon, UserCheck } from 'lucide-react'
import {
    searchAll,
    searchPosts,
    searchUsers,
    searchFormations,
    searchEvents,
    searchClubs,
    searchBlogArticles,
    searchProfesseurs,
    SearchFilters
} from '@/app/actions/search'
import { SearchResultPost } from '@/components/search/search-result-post'
import { SearchResultUser } from '@/components/search/search-result-user'
import { SearchResultFormation } from '@/components/search/search-result-formation'
import { SearchResultEvent } from '@/components/search/search-result-event'
import { SearchResultClub } from '@/components/search/search-result-club'
import { SearchResultArticle } from '@/components/search/search-result-article'
import { SearchResultProfesseur } from '@/components/search/search-result-professeur'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type TabValue = 'all' | 'posts' | 'users' | 'formations' | 'events' | 'clubs' | 'articles' | 'professeurs'

export function SearchContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [activeTab, setActiveTab] = useState<TabValue>('all')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any>(null)
    const [filters, setFilters] = useState<SearchFilters>({
        dateRange: 'all',
        limit: 20,
        offset: 0
    })

    // Debounced search
    const performSearch = useCallback(async (searchQuery: string, tab: TabValue) => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setResults(null)
            return
        }

        setLoading(true)
        try {
            let data
            if (tab === 'all') {
                data = await searchAll(searchQuery, filters)
            } else if (tab === 'posts') {
                data = await searchPosts(searchQuery, filters)
            } else if (tab === 'users') {
                data = await searchUsers(searchQuery, filters)
            } else if (tab === 'formations') {
                data = await searchFormations(searchQuery, filters)
            } else if (tab === 'events') {
                data = await searchEvents(searchQuery, filters)
            } else if (tab === 'clubs') {
                data = await searchClubs(searchQuery, filters)
            } else if (tab === 'articles') {
                data = await searchBlogArticles(searchQuery, filters)
            } else if (tab === 'professeurs') {
                data = await searchProfesseurs(searchQuery, filters)
            }
            setResults(data)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setLoading(false)
        }
    }, [filters])

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                performSearch(query, activeTab)
                // Update URL
                const params = new URLSearchParams()
                params.set('q', query)
                router.replace(`/search?${params.toString()}`, { scroll: false })
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query, activeTab, performSearch, router])

    // Initial search from URL
    useEffect(() => {
        const initialQuery = searchParams.get('q')
        if (initialQuery) {
            setQuery(initialQuery)
        }
    }, [searchParams])

    const handleClearSearch = () => {
        setQuery('')
        setResults(null)
        router.replace('/search', { scroll: false })
    }

    const getTotalResults = () => {
        if (!results) return 0
        if (activeTab === 'all') {
            return results.total || 0
        }
        return results.total || 0
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header avec barre de recherche */}
            <div className="sticky top-0 lg:top-16 z-30 bg-background/95 backdrop-blur-lg border-b border-border">
                <div className="container max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        {/* Barre de recherche */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher des postes, personnes, formations..."
                                className="pl-10 pr-10 h-12 text-base border-2 focus-visible:ring-2"
                                autoFocus
                            />
                            {query && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                    onClick={handleClearSearch}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Bouton filtres (mobile) */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
                                    <SlidersHorizontal className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Filtres</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Période</label>
                                        <Select
                                            value={filters.dateRange}
                                            onValueChange={(value: any) => setFilters({ ...filters, dateRange: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tout</SelectItem>
                                                <SelectItem value="today">Aujourd'hui</SelectItem>
                                                <SelectItem value="week">Cette semaine</SelectItem>
                                                <SelectItem value="month">Ce mois</SelectItem>
                                                <SelectItem value="year">Cette année</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setFilters({ dateRange: 'all', limit: 20, offset: 0 })}
                                    >
                                        Réinitialiser
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Résultats count */}
                    {query && results && (
                        <div className="mt-3 text-sm text-muted-foreground">
                            {getTotalResults()} résultat{getTotalResults() > 1 ? 's' : ''} pour "{query}"
                        </div>
                    )}
                </div>
            </div>

            {/* Contenu principal */}
            <div className="container max-w-4xl mx-auto px-4 py-6">
                {!query ? (
                    // État vide
                    <Card className="p-12 text-center">
                        <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h2 className="text-xl font-semibold mb-2">Rechercher sur EduSky</h2>
                        <p className="text-muted-foreground">
                            Trouvez des postes, des personnes, des formations, des événements et plus encore
                        </p>
                    </Card>
                ) : (
                    // Résultats
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
                        {/* TABS LIST - STICKY BELOW HEADER */}
                        <div className="sticky top-[72px] lg:top-[180px] z-20 bg-background pb-4 -mx-4 px-4">
                            <TabsList className="w-full grid grid-cols-8 h-auto p-1 overflow-x-auto scrollbar-hide bg-muted">
                                <TabsTrigger
                                    value="all"
                                    className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    <Search className="h-4 w-4" />
                                    <span className="hidden md:inline">Tous</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="posts"
                                    className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden md:inline">Postes</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="users"
                                    className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    <Users className="h-4 w-4" />
                                    <span className="hidden md:inline">Personnes</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="formations"
                                    className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    <GraduationCap className="h-4 w-4" />
                                    <span className="hidden md:inline">Formations</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="events"
                                    className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span className="hidden md:inline">Événements</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="clubs"
                                    className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    <UsersRound className="h-4 w-4" />
                                    <span className="hidden md:inline">Clubs</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="articles"
                                    className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    <BookmarkIcon className="h-4 w-4" />
                                    <span className="hidden md:inline">Articles</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="professeurs"
                                    className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    <UserCheck className="h-4 w-4" />
                                    <span className="hidden md:inline">Professeurs</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Card key={i} className="p-6">
                                        <div className="flex gap-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <>
                                <TabsContent value="all" className="space-y-6 mt-0">
                                    {results?.posts?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Postes</h3>
                                            <div className="space-y-3">
                                                {results.posts.map((post: any) => (
                                                    <SearchResultPost key={post.id} {...post} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {results?.users?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Personnes</h3>
                                            <div className="space-y-3">
                                                {results.users.map((user: any) => (
                                                    <SearchResultUser key={user.id} {...user} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {results?.formations?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Formations</h3>
                                            <div className="space-y-3">
                                                {results.formations.map((formation: any) => (
                                                    <SearchResultFormation key={formation.id} {...formation} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {results?.events?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Événements</h3>
                                            <div className="space-y-3">
                                                {results.events.map((event: any) => (
                                                    <SearchResultEvent key={event.id} {...event} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {results?.clubs?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Clubs</h3>
                                            <div className="space-y-3">
                                                {results.clubs.map((club: any) => (
                                                    <SearchResultClub key={club.id} {...club} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {results?.articles?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Articles</h3>
                                            <div className="space-y-3">
                                                {results.articles.map((article: any) => (
                                                    <SearchResultArticle key={article.id} {...article} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {results?.professeurs?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3">Professeurs</h3>
                                            <div className="space-y-3">
                                                {results.professeurs.map((prof: any) => (
                                                    <SearchResultProfesseur key={prof.id} {...prof} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {results && getTotalResults() === 0 && (
                                        <Card className="p-12 text-center">
                                            <p className="text-muted-foreground">Aucun résultat trouvé pour "{query}"</p>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="posts" className="space-y-3 mt-0">
                                    {results?.data?.map((post: any) => (
                                        <SearchResultPost key={post.id} {...post} />
                                    ))}
                                    {results?.data?.length === 0 && (
                                        <Card className="p-12 text-center">
                                            <p className="text-muted-foreground">Aucun poste trouvé</p>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="users" className="space-y-3 mt-0">
                                    {results?.data?.map((user: any) => (
                                        <SearchResultUser key={user.id} {...user} />
                                    ))}
                                    {results?.data?.length === 0 && (
                                        <Card className="p-12 text-center">
                                            <p className="text-muted-foreground">Aucune personne trouvée</p>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="formations" className="space-y-3 mt-0">
                                    {results?.data?.map((formation: any) => (
                                        <SearchResultFormation key={formation.id} {...formation} />
                                    ))}
                                    {results?.data?.length === 0 && (
                                        <Card className="p-12 text-center">
                                            <p className="text-muted-foreground">Aucune formation trouvée</p>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="events" className="space-y-3 mt-0">
                                    {results?.data?.map((event: any) => (
                                        <SearchResultEvent key={event.id} {...event} />
                                    ))}
                                    {results?.data?.length === 0 && (
                                        <Card className="p-12 text-center">
                                            <p className="text-muted-foreground">Aucun événement trouvé</p>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="clubs" className="space-y-3 mt-0">
                                    {results?.data?.map((club: any) => (
                                        <SearchResultClub key={club.id} {...club} />
                                    ))}
                                    {results?.data?.length === 0 && (
                                        <Card className="p-12 text-center">
                                            <p className="text-muted-foreground">Aucun club trouvé</p>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="articles" className="space-y-3 mt-0">
                                    {results?.data?.map((article: any) => (
                                        <SearchResultArticle key={article.id} {...article} />
                                    ))}
                                    {results?.data?.length === 0 && (
                                        <Card className="p-12 text-center">
                                            <p className="text-muted-foreground">Aucun article trouvé</p>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="professeurs" className="space-y-3 mt-0">
                                    {results?.data?.map((prof: any) => (
                                        <SearchResultProfesseur key={prof.id} {...prof} />
                                    ))}
                                    {results?.data?.length === 0 && (
                                        <Card className="p-12 text-center">
                                            <p className="text-muted-foreground">Aucun professeur trouvé</p>
                                        </Card>
                                    )}
                                </TabsContent>
                            </>
                        )}
                    </Tabs>
                )}
            </div>
        </div>
    )
}
