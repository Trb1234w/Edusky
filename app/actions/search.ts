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

// Interfaces for enriched data
export interface SearchPost {
    id: string
    contenu: string
    content?: string // Mapped from contenu
    media: any
    created_at: string
    updated_at: string
    statut: string
    visibilite: string
    auteur_id: string
    author?: string
    authorUsername?: string
    authorAvatar?: string
    authorRole?: string
    authorId?: string
    likes?: number
    comments?: number
    shares?: number
    timestamp?: string
    liked?: boolean
    currentUserId?: string
    followingIds?: string[]
}

export interface SearchUser {
    id: string
    full_name: string
    username: string
    avatar_url: string
    bio: string
    is_verified: boolean
    competences: string[]
    pays_id: string
    ville_id: string
    followers: { count: number }[]
    pays?: { id: string; nom: string }
    ville?: { id: string; nom: string }
    isFollowing?: boolean
}

export interface SearchFormation {
    id: string
    titre: string
    slug: string
    extrait: string
    description: string
    image_url: string
    tags: string[]
    mode: string
    niveau: string
    duree_texte: string
    prix_indicatif: number
    note_moyenne: number
    nb_avis: number
    created_at: string
    professeur_id: string
    categorie_id: string
    pays_id: string
    ville_id: string
    nombre_inscrits: number
    langue_enseignement: string
    certificat: boolean
    certificate?: boolean // Mapped from certificat
    category?: string
    instructor?: string
    is_favorited?: boolean
    level?: string
    duration?: string
    students?: number
    rating?: number
    price?: string
    image?: string
    language?: string
}

export interface SearchEvent {
    id: string
    titre: string
    slug: string
    extrait: string
    description: string
    image_url: string
    tags: string[]
    date_debut: string
    date_fin: string
    mode: string
    lieu: string
    capacite: number
    type_evenement: string
    created_at: string
    organisateur_id: string
    categorie_id: string
    pays_id: string
    ville_id: string
    prix: number
    est_gratuit: boolean
    nombre_participants: number
    heure_ouverture_portes: string
    category?: string
    organizer?: string
    is_favorited?: boolean
    date?: string
    time?: string
    location?: string
    participants?: number
    maxParticipants?: number
    image?: string
    status?: string
    price?: number // Mapped from prix
    isFree?: boolean
}

export interface SearchClub {
    id: string
    nom: string
    slug: string
    description: string
    image_url: string
    tags: string[]
    theme_principal: string
    capacite: number
    statut: string
    created_at: string
    leader_id: string
    categorie_id: string
    pays_id: string
    ville_id: string
    nombre_membres: number
    prix_inscription: number
    cotisation_mensuelle: number
    cotisation_annuelle: number
    category?: string
    president?: string
    is_favorited?: boolean
    members?: number
    fees?: string
    image?: string
}

export interface SearchArticle {
    id: string
    titre: string
    slug: string
    extrait: string
    contenu: string
    image_couverture: string
    image_url: string
    tags: string[]
    vues: number
    likes_count: number
    comment_count: number
    publie_at: string
    created_at: string
    auteur_id: string
    categorie_id: string
    category?: string
    author?: string
    authorAvatar?: string
    authorRole?: string
    is_favorited?: boolean
    date?: string
    readTime?: string
    image?: string
    likes?: number
    comments?: number
    views?: number
}

export interface SearchProfessor {
    id: string
    titre: string
    presentation: string
    specialites: string[]
    annees_experience: number
    tarif_indicatif: number
    tarif_horaire_min: number
    tarif_horaire_max: number
    nb_etudiants_formes: number
    disponibilite: any
    portfolio: any
    is_publie: boolean
    note_moyenne: number
    nb_notes: number
    certifications: any
    created_at: string
    updated_at: string
    pays_id: string
    ville_id: string
    quartier_id: string
    type: string
    methodes_pedagogiques: string[]
    modalites_cours: string[]
    reseaux_sociaux: any
    site_web: string
    full_name: string
    image_url: string
    linkedin_url: string
    diplomes: any
    formations_parcours: any
    email_contact: string
    telephone_professionnel: string
    langues_enseignement: string[]
    domaines_intervention: string[]
    pays_nom?: string
    ville_nom?: string
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
export async function searchPosts(query: string, filters: SearchFilters = {}): Promise<SearchResult<SearchPost>> {
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

        const posts = (data || []) as unknown as SearchPost[]

        // Fetch author data and engagement metrics
        if (posts.length > 0) {
            const authorIds = [...new Set(posts.map(post => post.auteur_id).filter(Boolean))]
            const postIds = posts.map(post => post.id)

            // Fetch authors
            if (authorIds.length > 0) {
                const { data: authors } = await supabase
                    .from('profiles')
                    .select('id, full_name, username, avatar_url, is_verified, role')
                    .in('id', authorIds)

                const authorsMap = new Map(authors?.map(a => [a.id, a]) || [])
                posts.forEach(post => {
                    const author = authorsMap.get(post.auteur_id)
                    post.author = author?.full_name || 'Utilisateur'
                    post.authorUsername = author?.username
                    post.authorAvatar = author?.avatar_url
                    post.authorRole = author?.role || 'Utilisateur'
                    post.authorId = post.auteur_id
                    post.content = post.contenu // Map content
                })
            }

            // Fetch engagement counts
            await Promise.all(posts.map(async (post) => {
                const [l, c, s] = await Promise.all([
                    supabase.from('likes_postes').select('id', { count: 'exact', head: true }).eq('poste_id', post.id),
                    supabase.from('commentaires_postes').select('id', { count: 'exact', head: true }).eq('poste_id', post.id),
                    supabase.from('partages_postes').select('id', { count: 'exact', head: true }).eq('poste_id', post.id)
                ])
                post.likes = l.count || 0
                post.comments = c.count || 0
                post.shares = s.count || 0
                post.timestamp = post.created_at
            }))

            // Fetch current user's likes and following status if logged in
            let followingIds: string[] = []
            if (user) {
                const { data: userLikes } = await supabase
                    .from('likes_postes')
                    .select('poste_id')
                    .eq('utilisateur_id', user.id)
                    .in('poste_id', postIds)

                const likedPostIds = new Set(userLikes?.map(l => l.poste_id) || [])

                // Fetch following
                const { data: following } = await supabase
                    .from('suivis')
                    .select('suivi_id')
                    .eq('suiveur_id', user.id)

                followingIds = following?.map(f => f.suivi_id) || []

                posts.forEach(post => {
                    post.liked = likedPostIds.has(post.id)
                    post.currentUserId = user.id
                    post.followingIds = followingIds
                })
            } else {
                posts.forEach(post => {
                    post.liked = false
                    post.followingIds = []
                })
            }
        }

        console.log(`Posts search for "${query}":`, posts.length, 'results found')

        return {
            data: posts,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching posts (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE D'UTILISATEURS
export async function searchUsers(query: string, filters: SearchFilters = {}): Promise<SearchResult<SearchUser>> {
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

        const usersList = (data || []) as unknown as SearchUser[]

        // Fetch location and follow status
        if (usersList.length > 0) {
            const paysIds = [...new Set(usersList.map(u => u.pays_id).filter(Boolean))]
            const villeIds = [...new Set(usersList.map(u => u.ville_id).filter(Boolean))]
            const userIds = usersList.map(u => u.id)

            // Fetch pays
            if (paysIds.length > 0) {
                const { data: pays } = await supabase.from('pays').select('id, nom').in('id', paysIds)
                const paysMap = new Map(pays?.map(p => [p.id, p]) || [])
                usersList.forEach(searchUser => {
                    if (searchUser.pays_id) searchUser.pays = paysMap.get(searchUser.pays_id)
                })
            }

            // Fetch villes
            if (villeIds.length > 0) {
                const { data: villes } = await supabase.from('villes').select('id, nom').in('id', villeIds)
                const villesMap = new Map(villes?.map(v => [v.id, v]) || [])
                usersList.forEach(searchUser => {
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
                usersList.forEach(searchUser => {
                    searchUser.isFollowing = followingIds.has(searchUser.id)
                })
            } else {
                usersList.forEach(searchUser => {
                    searchUser.isFollowing = false
                })
            }
        }

        return {
            data: usersList,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching users:', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE DE FORMATIONS
export async function searchFormations(query: string, filters: SearchFilters = {}): Promise<SearchResult<SearchFormation>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        const { data: { user } } = await supabase.auth.getUser()

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
        ville_id,
        nombre_inscrits,
        langue_enseignement,
        certificat
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

        const formations = (data || []) as unknown as SearchFormation[]

        if (formations.length > 0) {
            const categoryIds = [...new Set(formations.map(f => f.categorie_id).filter(Boolean))]
            const professorIds = [...new Set(formations.map(f => f.professeur_id).filter(Boolean))]
            const formationIds = formations.map(f => f.id)

            // Fetch categories
            if (categoryIds.length > 0) {
                const { data: categories } = await supabase.from('categories').select('id, nom').in('id', categoryIds)
                const catMap = new Map(categories?.map(c => [c.id, c.nom]) || [])
                formations.forEach(f => f.category = catMap.get(f.categorie_id) || 'Formation')
            }

            // Fetch professors
            if (professorIds.length > 0) {
                const { data: professors } = await supabase.from('professeurs').select('id, full_name').in('id', professorIds)
                const profMap = new Map(professors?.map(p => [p.id, p.full_name]) || [])
                formations.forEach(f => f.instructor = profMap.get(f.professeur_id) || 'Professeur')
            }

            // Check favorites
            if (user) {
                const { data: favorites } = await supabase
                    .from('favoris')
                    .select('item_id')
                    .eq('user_id', user.id)
                    .eq('type_item', 'formation')
                    .in('item_id', formationIds)

                const favSet = new Set(favorites?.map(f => f.item_id) || [])
                formations.forEach(f => f.is_favorited = favSet.has(f.id))
            } else {
                formations.forEach(f => f.is_favorited = false)
            }

            // Map fields for CourseCard
            formations.forEach(f => {
                f.level = f.niveau
                f.duration = f.duree_texte
                f.students = f.nombre_inscrits || 0
                f.rating = f.note_moyenne || 0
                f.price = f.prix_indicatif ? `${f.prix_indicatif.toLocaleString()} GNF` : 'Gratuit'
                f.image = f.image_url
                f.language = f.langue_enseignement
                f.certificate = f.certificat // Map certificate
            })
        }

        console.log(`Formations search for "${query}":`, formations.length, 'results found')

        return {
            data: formations,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching formations:', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE D'ÉVÉNEMENTS
export async function searchEvents(query: string, filters: SearchFilters = {}): Promise<SearchResult<SearchEvent>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        const { data: { user } } = await supabase.auth.getUser()

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
        ville_id,
        prix,
        est_gratuit,
        nombre_participants,
        heure_ouverture_portes
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

        const events = (data || []) as unknown as SearchEvent[]

        if (events.length > 0) {
            const categoryIds = [...new Set(events.map(e => e.categorie_id).filter(Boolean))]
            const organizerIds = [...new Set(events.map(e => e.organisateur_id).filter(Boolean))]
            const eventIds = events.map(e => e.id)

            // Fetch categories
            if (categoryIds.length > 0) {
                const { data: categories } = await supabase.from('categories').select('id, nom').in('id', categoryIds)
                const catMap = new Map(categories?.map(c => [c.id, c.nom]) || [])
                events.forEach(e => e.category = catMap.get(e.categorie_id) || 'Événement')
            }

            // Fetch organizers
            if (organizerIds.length > 0) {
                const { data: organizers } = await supabase.from('profiles').select('id, full_name').in('id', organizerIds)
                const orgMap = new Map(organizers?.map(o => [o.id, o.full_name]) || [])
                events.forEach(e => e.organizer = orgMap.get(e.organisateur_id) || 'Organisateur')
            }

            // Check favorites
            if (user) {
                const { data: favorites } = await supabase
                    .from('favoris')
                    .select('item_id')
                    .eq('user_id', user.id)
                    .eq('type_item', 'evenement')
                    .in('item_id', eventIds)

                const favSet = new Set(favorites?.map(f => f.item_id) || [])
                events.forEach(e => e.is_favorited = favSet.has(e.id))
            } else {
                events.forEach(e => e.is_favorited = false)
            }

            // Map fields for EventCard
            events.forEach(e => {
                e.date = e.date_debut
                e.time = e.heure_ouverture_portes ? e.heure_ouverture_portes.substring(0, 5) : (e.date_debut ? new Date(e.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '')
                e.location = e.lieu || 'En ligne'
                e.participants = e.nombre_participants || 0
                e.maxParticipants = e.capacite || 0
                e.image = e.image_url
                e.status = e.type_evenement || 'ouvert'
                e.price = e.prix // Map price
                e.isFree = e.est_gratuit
            })
        }

        console.log(`Events search for "${query}":`, events.length, 'results found')

        return {
            data: events,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching events (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE DE CLUBS
export async function searchClubs(query: string, filters: SearchFilters = {}): Promise<SearchResult<SearchClub>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        const { data: { user } } = await supabase.auth.getUser()

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
        ville_id,
        nombre_membres,
        prix_inscription,
        cotisation_mensuelle,
        cotisation_annuelle
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

        const clubs = (data || []) as unknown as SearchClub[]

        if (clubs.length > 0) {
            const categoryIds = [...new Set(clubs.map(c => c.categorie_id).filter(Boolean))]
            const leaderIds = [...new Set(clubs.map(c => c.leader_id).filter(Boolean))]
            const clubIds = clubs.map(c => c.id)

            // Fetch categories
            if (categoryIds.length > 0) {
                const { data: categories } = await supabase.from('categories').select('id, nom').in('id', categoryIds)
                const catMap = new Map(categories?.map(c => [c.id, c.nom]) || [])
                clubs.forEach(c => c.category = catMap.get(c.categorie_id) || 'Club')
            }

            // Fetch leaders (presidents)
            if (leaderIds.length > 0) {
                const { data: leaders } = await supabase.from('profiles').select('id, full_name').in('id', leaderIds)
                const leaderMap = new Map(leaders?.map(l => [l.id, l.full_name]) || [])
                clubs.forEach(c => c.president = leaderMap.get(c.leader_id) || 'Président')
            }

            // Check favorites
            if (user) {
                const { data: favorites } = await supabase
                    .from('favoris')
                    .select('item_id')
                    .eq('user_id', user.id)
                    .eq('type_item', 'club')
                    .in('item_id', clubIds)

                const favSet = new Set(favorites?.map(f => f.item_id) || [])
                clubs.forEach(c => c.is_favorited = favSet.has(c.id))
            } else {
                clubs.forEach(c => c.is_favorited = false)
            }

            // Map fields for ClubCard
            clubs.forEach(c => {
                c.members = c.nombre_membres || 0
                c.image = c.image_url

                // Format fees
                if (c.prix_inscription && c.prix_inscription > 0) {
                    c.fees = `${c.prix_inscription.toLocaleString()} GNF (Inscription)`
                } else if (c.cotisation_mensuelle && c.cotisation_mensuelle > 0) {
                    c.fees = `${c.cotisation_mensuelle.toLocaleString()} GNF / mois`
                } else if (c.cotisation_annuelle && c.cotisation_annuelle > 0) {
                    c.fees = `${c.cotisation_annuelle.toLocaleString()} GNF / an`
                } else {
                    c.fees = 'Gratuit'
                }
            })
        }

        console.log(`Clubs search for "${query}":`, clubs.length, 'results found')

        return {
            data: clubs,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching clubs (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE D'ARTICLES BLOG
export async function searchBlogArticles(query: string, filters: SearchFilters = {}): Promise<SearchResult<SearchArticle>> {
    const supabase = await createClient()
    const limit = filters.limit || 20
    const offset = filters.offset || 0

    try {
        const { data: { user } } = await supabase.auth.getUser()

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

        const articles = (data || []) as unknown as SearchArticle[]

        if (articles.length > 0) {
            const categoryIds = [...new Set(articles.map(a => a.categorie_id).filter(Boolean))]
            const authorIds = [...new Set(articles.map(a => a.auteur_id).filter(Boolean))]
            const articleIds = articles.map(a => a.id)

            // Fetch categories
            if (categoryIds.length > 0) {
                const { data: categories } = await supabase.from('categories').select('id, nom').in('id', categoryIds)
                const catMap = new Map(categories?.map(c => [c.id, c.nom]) || [])
                articles.forEach(a => a.category = catMap.get(a.categorie_id) || 'Article')
            }

            // Fetch authors
            if (authorIds.length > 0) {
                const { data: authors } = await supabase.from('profiles').select('id, full_name, avatar_url, role').in('id', authorIds)
                const authMap = new Map(authors?.map(a => [a.id, a]) || [])
                articles.forEach(a => {
                    const author = authMap.get(a.auteur_id)
                    a.author = author?.full_name || 'Auteur'
                    a.authorAvatar = author?.avatar_url
                    a.authorRole = author?.role || 'Rédacteur'
                })
            }

            // Check favorites
            if (user) {
                const { data: favorites } = await supabase
                    .from('favoris')
                    .select('item_id')
                    .eq('user_id', user.id)
                    .eq('type_item', 'article')
                    .in('item_id', articleIds)

                const favSet = new Set(favorites?.map(f => f.item_id) || [])
                articles.forEach(a => a.is_favorited = favSet.has(a.id))
            } else {
                articles.forEach(a => a.is_favorited = false)
            }

            // Map fields for BlogCard
            articles.forEach(a => {
                a.date = a.publie_at
                a.readTime = '5 min' // Placeholder
                a.image = a.image_couverture || a.image_url
                a.views = a.vues || 0
                a.likes = a.likes_count || 0
                a.comments = a.comment_count || 0
            })
        }

        console.log(`Blog articles search for "${query}":`, articles.length, 'results found')

        return {
            data: articles,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching blog articles (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}

// RECHERCHE DE PROFESSEURS
export async function searchProfesseurs(query: string, filters: SearchFilters = {}): Promise<SearchResult<SearchProfessor>> {
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

        const professors = (data || []) as unknown as SearchProfessor[]

        if (professors.length > 0) {
            const paysIds = [...new Set(professors.map(p => p.pays_id).filter(Boolean))]
            const villeIds = [...new Set(professors.map(p => p.ville_id).filter(Boolean))]

            // Fetch pays
            if (paysIds.length > 0) {
                const { data: pays } = await supabase.from('pays').select('id, nom').in('id', paysIds)
                const paysMap = new Map(pays?.map(p => [p.id, p.nom]) || [])
                professors.forEach(p => p.pays_nom = paysMap.get(p.pays_id))
            }

            // Fetch villes
            if (villeIds.length > 0) {
                const { data: villes } = await supabase.from('villes').select('id, nom').in('id', villeIds)
                const villesMap = new Map(villes?.map(v => [v.id, v.nom]) || [])
                professors.forEach(p => p.ville_nom = villesMap.get(p.ville_id))
            }
        }

        console.log(`Professeurs search for "${query}":`, professors.length, 'results found')

        return {
            data: professors,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
        }
    } catch (error) {
        console.error('Error searching professeurs (caught):', error)
        return { data: [], total: 0, hasMore: false }
    }
}
