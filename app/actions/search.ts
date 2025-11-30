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
            total: 0
        }
    }

    const supabase = await createClient()
    const limit = filters.limit || 5 // Limite par type pour la recherche globale

    try {
        const [posts, users, formations, events, clubs, articles] = await Promise.all([
            searchPosts(query, { ...filters, limit }),
            searchUsers(query, { ...filters, limit }),
            searchFormations(query, { ...filters, limit }),
            searchEvents(query, { ...filters, limit }),
            searchClubs(query, { ...filters, limit }),
            searchBlogArticles(query, { ...filters, limit }),
        ])

        return {
            posts: posts.data,
            users: users.data,
            formations: formations.data,
            events: events.data,
            clubs: clubs.data,
            articles: articles.data,
            total: posts.total + users.total + formations.total + events.total + clubs.total + articles.total
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
        auteur:profiles!postes_auteur_id_fkey (
          id,
          full_name,
          username,
          avatar_url,
          is_verified
        ),
        likes:likes(count),
        commentaires:commentaires(count)
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

        if (error) throw error

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching posts:', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE D'UTILISATEURS
export async function searchUsers(query: string, filters: SearchFilters = {}): Promise<SearchResult<any>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
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
        pays:pays(nom),
        ville:villes(nom),
        followers:suivis!suivis_followed_id_fkey(count)
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
        professeur:professeurs(
          id,
          titre,
          profiles(full_name, avatar_url)
        ),
        categorie:categories(nom),
        pays:pays(nom),
        ville:villes(nom)
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

        if (error) throw error

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
        organisateur:profiles!evenements_organisateur_id_fkey(
          id,
          full_name,
          avatar_url,
          is_verified
        ),
        categorie:categories(nom),
        pays:pays(nom),
        ville:villes(nom),
        inscriptions:inscriptions_evenement(count)
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

        if (error) throw error

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching events:', error)
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
        leader:profiles!clubs_leader_id_fkey(
          id,
          full_name,
          avatar_url,
          is_verified
        ),
        categorie:categories(nom),
        pays:pays(nom),
        ville:villes(nom),
        membres:inscriptions_club(count)
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

        if (error) throw error

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching clubs:', error)
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
        auteur:profiles!articles_blog_auteur_id_fkey(
          id,
          full_name,
          avatar_url,
          is_verified
        ),
        categorie:categories(nom)
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

        if (error) throw error

        return {
            data: data || [],
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching blog articles:', error)
        return { data: [], total: 0, hasMore: false }
    }
}
