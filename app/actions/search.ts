'use server'

import { createClient } from '@/lib/supabase/server'

export interface SearchFilters {
    dateRange?: 'today' | 'week' | 'month' | 'year' | 'all'
    categoryId?: string
    paysId?: string
    villeId?: string
    tags?: string[]
    limit?: number
    offset?: number
}

export interface SearchResult<T> {
    data: T[]
    total: number
    hasMore: boolean
}

// Fonction utilitaire pour construire le filtre de date
function getDateFilter(dateRange?: string) {
    if (!dateRange || dateRange === 'all') return null

    const now = new Date()
    const filters: Record<string, Date> = {
        today: new Date(now.setHours(0, 0, 0, 0)),
        week: new Date(now.setDate(now.getDate() - 7)),
        month: new Date(now.setMonth(now.getMonth() - 1)),
        year: new Date(now.setFullYear(now.getFullYear() - 1)),
    }

    return filters[dateRange] || null
}

// RECHERCHE GLOBALE - Tous les types
export async function searchAll(query: string, filters: SearchFilters = {}) {
    if (!query || query.trim().length < 2) {
        return {
            posts: [],
            users: [],
            formations: [],
            events: [],
            clubs: [],
            articles: [],
            professeurs: [],
            total: 0
        }
    }

    const supabase = await createClient()
    const limit = filters.limit || 5 // Limite par type pour la recherche globale

    try {
        const [posts, users, formations, events, clubs, articles, professeurs] = await Promise.all([
            searchPosts(query, { ...filters, limit }),
            searchUsers(query, { ...filters, limit }),
            searchFormations(query, { ...filters, limit }),
            searchEvents(query, { ...filters, limit }),
            searchClubs(query, { ...filters, limit }),
            searchBlogArticles(query, { ...filters, limit }),
            searchProfesseurs(query, { ...filters, limit }),
        ])

        return {
            posts: posts.data,
            users: users.data,
            formations: formations.data,
            events: events.data,
            clubs: clubs.data,
            articles: articles.data,
            professeurs: professeurs.data,
            total: posts.total + users.total + formations.total + events.total + clubs.total + articles.total + professeurs.total
        }
    } catch (error) {
        console.error('Error in searchAll:', error)
        throw error
    }
}

// RECHERCHE DE POSTES
export async function searchPosts(query: string, filters: SearchFilters = {}): Promise<SearchResult<any>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        let queryBuilder = supabase
            .from('postes')
            .select(`
        id,
        contenu,
        media,
        created_at,
        updated_at,
        statut,
        visibilite,
        auteur_id
      `, { count: 'exact' })
            .eq('statut', 'publie')
            .ilike('contenu', `%${query}%`)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Filtre de date
        const dateFilter = getDateFilter(filters.dateRange)
        if (dateFilter) {
            queryBuilder = queryBuilder.gte('created_at', dateFilter.toISOString())
        }

        const { data, error, count } = await queryBuilder

        if (error) {
            console.error('Error searching posts - Supabase error:', error)
            throw error
        }

        // Fetch author data and engagement metrics
        if (data && data.length > 0) {
            const authorIds = [...new Set(data.map(post => post.auteur_id).filter(Boolean))]
            const postIds = data.map(post => post.id)

            // Fetch authors
            if (authorIds.length > 0) {
                const { data: authors } = await supabase
                    .from('profiles')
                    .select('id, full_name, username, avatar_url, is_verified')
                    .in('id', authorIds)

                const authorsMap = new Map(authors?.map(a => [a.id, a]) || [])
                data.forEach(post => {
                    post.auteur = authorsMap.get(post.auteur_id)
                })
            }

            // Fetch engagement counts
            const [likesData, commentsData, sharesData] = await Promise.all([
                supabase.from('likes_postes').select('poste_id', { count: 'exact', head: true }).in('poste_id', postIds),
                supabase.from('commentaires_postes').select('poste_id', { count: 'exact', head: true }).in('poste_id', postIds),
                supabase.from('partages_postes').select('poste_id', { count: 'exact', head: true }).in('poste_id', postIds)
            ])

            data.forEach(post => {
                post.likes_count = likesData.count || 0
                post.comments_count = commentsData.count || 0
                post.shares_count = sharesData.count || 0
            })

            // Fetch current user's likes if logged in
            if (user) {
                const { data: userLikes } = await supabase
                    .from('likes_postes')
                    .select('poste_id')
                    .eq('utilisateur_id', user.id)
                    .in('poste_id', postIds)

                const likedPostIds = new Set(userLikes?.map(l => l.poste_id) || [])
                data.forEach(post => {
                    post.isLiked = likedPostIds.has(post.id)
                })
            } else {
                data.forEach(post => {
                    post.isLiked = false
                })
            }
        }

        console.log(`Posts search for "${query}":`, data?.length, 'results found')

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching posts (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE D'UTILISATEURS
export async function searchUsers(query: string, filters: SearchFilters = {}): Promise<SearchResult<any>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        let queryBuilder = supabase
            .from('profiles')
            .select(`
        id,
        full_name,
        username,
        avatar_url,
        bio,
        is_verified,
        competences,
        pays_id,
        ville_id,
        followers:suivis!suivis_suivi_id_fkey(count)
      `, { count: 'exact' })
            .or(`full_name.ilike.%${query}%,username.ilike.%${query}%,bio.ilike.%${query}%`)
            .order('is_verified', { ascending: false })
            .order('full_name', { ascending: true })
            .range(offset, offset + limit - 1)

        // Filtre par localisation
        if (filters.paysId) {
            queryBuilder = queryBuilder.eq('pays_id', filters.paysId)
        }
        if (filters.villeId) {
            queryBuilder = queryBuilder.eq('ville_id', filters.villeId)
        }

        const { data, error, count } = await queryBuilder

        if (error) throw error

        // Fetch location and follow status
        if (data && data.length > 0) {
            const paysIds = [...new Set(data.map(u => u.pays_id).filter(Boolean))]
            const villeIds = [...new Set(data.map(u => u.ville_id).filter(Boolean))]
            const userIds = data.map(u => u.id)

            // Fetch pays
            if (paysIds.length > 0) {
                const { data: pays } = await supabase.from('pays').select('id, nom').in('id', paysIds)
                const paysMap = new Map(pays?.map(p => [p.id, p]) || [])
                data.forEach(searchUser => {
                    if (searchUser.pays_id) searchUser.pays = paysMap.get(searchUser.pays_id)
                })
            }

            // Fetch villes
            if (villeIds.length > 0) {
                const { data: villes } = await supabase.from('villes').select('id, nom').in('id', villeIds)
                const villesMap = new Map(villes?.map(v => [v.id, v]) || [])
                data.forEach(searchUser => {
                    if (searchUser.ville_id) searchUser.ville = villesMap.get(searchUser.ville_id)
                })
            }

            // Check follow status if user logged in
            if (user) {
                const { data: following } = await supabase
                    .from('suivis')
                    .select('suivi_id')
                    .eq('suiveur_id', user.id)
                    .in('suivi_id', userIds)

                const followingIds = new Set(following?.map(f => f.suivi_id) || [])
                data.forEach(searchUser => {
                    searchUser.isFollowing = followingIds.has(searchUser.id)
                })
            } else {
                data.forEach(searchUser => {
                    searchUser.isFollowing = false
                })
            }
        }

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching users:', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE DE FORMATIONS
export async function searchFormations(query: string, filters: SearchFilters = {}): Promise<SearchResult<any>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        let queryBuilder = supabase
            .from('formations')
            .select(`
        id,
        titre,
        slug,
        extrait,
        description,
        image_url,
        tags,
        mode,
        niveau,
        duree_texte,
        prix_indicatif,
        note_moyenne,
        nb_avis,
        created_at,
        professeur_id,
        categorie_id,
        pays_id,
        ville_id
      `, { count: 'exact' })
            .eq('statut', 'publie')
            .or(`titre.ilike.%${query}%,description.ilike.%${query}%,extrait.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Filtres
        if (filters.categoryId) {
            queryBuilder = queryBuilder.eq('categorie_id', filters.categoryId)
        }
        if (filters.paysId) {
            queryBuilder = queryBuilder.eq('pays_id', filters.paysId)
        }
        if (filters.villeId) {
            queryBuilder = queryBuilder.eq('ville_id', filters.villeId)
        }

        const dateFilter = getDateFilter(filters.dateRange)
        if (dateFilter) {
            queryBuilder = queryBuilder.gte('created_at', dateFilter.toISOString())
        }

        const { data, error, count } = await queryBuilder

        if (error) {
            console.error('Error searching formations - Supabase error:', error)
            throw error
        }

        console.log(`Formations search for "${query}":`, data?.length, 'results found')

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching formations:', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE D'ÉVÉNEMENTS
export async function searchEvents(query: string, filters: SearchFilters = {}): Promise<SearchResult<any>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        let queryBuilder = supabase
            .from('evenements')
            .select(`
        id,
        titre,
        slug,
        extrait,
        description,
        image_url,
        tags,
        date_debut,
        date_fin,
        mode,
        lieu,
        capacite,
        type_evenement,
        created_at,
        organisateur_id,
        categorie_id,
        pays_id,
        ville_id
      `, { count: 'exact' })
            .eq('statut', 'publie')
            .or(`titre.ilike.%${query}%,description.ilike.%${query}%,extrait.ilike.%${query}%`)
            .order('date_debut', { ascending: true })
            .range(offset, offset + limit - 1)

        // Filtres
        if (filters.categoryId) {
            queryBuilder = queryBuilder.eq('categorie_id', filters.categoryId)
        }
        if (filters.paysId) {
            queryBuilder = queryBuilder.eq('pays_id', filters.paysId)
        }
        if (filters.villeId) {
            queryBuilder = queryBuilder.eq('ville_id', filters.villeId)
        }

        const { data, error, count } = await queryBuilder

        if (error) {
            console.error('Error searching events - Supabase error:', error)
            throw error
        }

        console.log(`Events search for "${query}":`, data?.length, 'results found')

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching events (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE DE CLUBS
export async function searchClubs(query: string, filters: SearchFilters = {}): Promise<SearchResult<any>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        let queryBuilder = supabase
            .from('clubs')
            .select(`
        id,
        nom,
        slug,
        description,
        image_url,
        tags,
        theme_principal,
        capacite,
        statut,
        created_at,
        leader_id,
        categorie_id,
        pays_id,
        ville_id
      `, { count: 'exact' })
            .or(`nom.ilike.%${query}%,description.ilike.%${query}%,theme_principal.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Filtres
        if (filters.categoryId) {
            queryBuilder = queryBuilder.eq('categorie_id', filters.categoryId)
        }
        if (filters.paysId) {
            queryBuilder = queryBuilder.eq('pays_id', filters.paysId)
        }
        if (filters.villeId) {
            queryBuilder = queryBuilder.eq('ville_id', filters.villeId)
        }

        const dateFilter = getDateFilter(filters.dateRange)
        if (dateFilter) {
            queryBuilder = queryBuilder.gte('created_at', dateFilter.toISOString())
        }

        const { data, error, count } = await queryBuilder

        if (error) {
            console.error('Error searching clubs - Supabase error:', error)
            throw error
        }

        console.log(`Clubs search for "${query}":`, data?.length, 'results found')

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching clubs (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE D'ARTICLES BLOG
export async function searchBlogArticles(query: string, filters: SearchFilters = {}): Promise<SearchResult<any>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        let queryBuilder = supabase
            .from('articles_blog')
            .select(`
        id,
        titre,
        slug,
        extrait,
        contenu,
        image_couverture,
        image_url,
        tags,
        vues,
        likes_count,
        comment_count,
        publie_at,
        created_at,
        auteur_id,
        categorie_id
      `, { count: 'exact' })
            .eq('statut', 'publie')
            .or(`titre.ilike.%${query}%,contenu.ilike.%${query}%,extrait.ilike.%${query}%`)
            .order('publie_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // Filtres
        if (filters.categoryId) {
            queryBuilder = queryBuilder.eq('categorie_id', filters.categoryId)
        }

        const dateFilter = getDateFilter(filters.dateRange)
        if (dateFilter) {
            queryBuilder = queryBuilder.gte('publie_at', dateFilter.toISOString())
        }

        const { data, error, count } = await queryBuilder

        if (error) {
            console.error('Error searching blog articles - Supabase error:', error)
            throw error
        }

        console.log(`Blog articles search for "${query}":`, data?.length, 'results found')

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching blog articles (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE DE PROFESSEURS
export async function searchProfesseurs(query: string, filters: SearchFilters = {}): Promise<SearchResult<any>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        // First get professeurs data
        let queryBuilder = supabase
            .from('professeurs')
            .select('*', { count: 'exact' })
            .eq('is_publie', true)
            .or(`titre.ilike.%${query}%,presentation.ilike.%${query}%`)
            .order('note_moyenne', { ascending: false })
            .range(offset, offset + limit - 1)

        // Filtres
        if (filters.paysId) {
            queryBuilder = queryBuilder.eq('pays_id', filters.paysId)
        }
        if (filters.villeId) {
            queryBuilder = queryBuilder.eq('ville_id', filters.villeId)
        }

        const { data, error, count } = await queryBuilder

        if (error) {
            console.error('Error searching professeurs - Supabase error:', error)
            throw error
        }

        console.log(`Professeurs search for "${query}":`, data?.length, 'results found')

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching professeurs (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

