'use server';

import { createClient } from "@/lib/supabase/server";

interface Location {
    id: string;
    nom: string;
}

interface Ville extends Location {
    pays_id: string;
}

interface Quartier extends Location {
    ville_id: string;
}

interface LocationsData {
    countries: Location[];
    villes: Ville[];
    quartiers: Quartier[];
}

/**
 * Fetches all distinct locations (countries, cities, neighborhoods) from the database
 * using the get_distinct_locations SQL function.
 */
export async function getDistinctLocations(): Promise<{ data: LocationsData | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_locations');

        if (error) {
            console.error("Error fetching locations:", error);
            return { data: null, error: error.message };
        }

        return { data: data as LocationsData, error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctLocations:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct tags used in formations
 */
export async function getDistinctTags(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        // Get all formations with tags
        const { data, error } = await supabase
            .from('formations')
            .select('tags')
            .eq('statut', 'publie')
            .not('tags', 'is', null);

        if (error) {
            console.error("Error fetching tags:", error);
            return { data: null, error: error.message };
        }

        // Extract unique tags from all formations
        const allTags = new Set<string>();
        data?.forEach((formation: any) => {
            if (formation.tags && Array.isArray(formation.tags)) {
                formation.tags.forEach((tag: string) => allTags.add(tag));
            }
        });

        return { data: Array.from(allTags).sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctTags:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct venues (lieu) used in formations
 */
export async function getDistinctVenues(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('formations')
            .select('lieu')
            .eq('statut', 'publie')
            .not('lieu', 'is', null);

        if (error) {
            console.error("Error fetching venues:", error);
            return { data: null, error: error.message };
        }

        const venues = Array.from(new Set(data?.map((item: any) => item.lieu).filter(Boolean) as string[])).sort();
        return { data: venues, error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctVenues:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all formations using the get_formations RPC function with admin client
 */
/**
 * Fetches all formations using direct query to ensure we get all columns including lieu
 */
export async function getAllFormations(): Promise<{ data: any[] | null; error: string | null }> {
    try {
        // console.log('[getAllFormations] Starting to fetch formations...');
        const supabase = await createClient();
        // console.log('[getAllFormations] Supabase client created');

        // 1. Fetch user and formations in parallel
        const [userResponse, formationsResponse] = await Promise.all([
            supabase.auth.getUser(),
            supabase
                .from('formations')
                .select(`
                    *,
                    categorie:categorie_id(*),
                    professeur:professeurs(*),
                    pays:pays_id(*),
                    ville:ville_id(*),
                    quartier:quartier_id(*),
                    duree_heures,
                    nombre_jours
                `)
                .eq('statut', 'publie')
                .eq('est_visible', true)
                .order('date_publication', { ascending: false })
        ]);

        const currentUserId = userResponse.data.user?.id;
        const { data: formations, error } = formationsResponse;

        // console.log('[getAllFormations] Query completed');
        // console.log('[getAllFormations] Data received:', formations ? `${formations.length} formations` : 'null');

        if (error) {
            console.error("Error fetching formations:", error);
            return { data: null, error: error.message };
        }

        let formationsWithFavorites = formations || [];

        // 2. Prepare promises for additional data (profiles and favorites)
        const promises = [];

        // Fetch profiles for professors
        if (formationsWithFavorites.length > 0) {
            const professorIds = Array.from(new Set(formationsWithFavorites
                .map((f: any) => f.professeur?.id)
                .filter((id: any) => id)));

            if (professorIds.length > 0) {
                promises.push(
                    supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url')
                        .in('id', professorIds)
                        .then(({ data: profiles }) => ({ type: 'profiles', data: profiles }))
                );
            }
        }

        // Fetch favorites if user is logged in
        if (currentUserId && formationsWithFavorites.length > 0) {
            promises.push(
                supabase
                    .from('favoris')
                    .select('item_id')
                    .eq('user_id', currentUserId)
                    .eq('type_item', 'formation')
                    .then(({ data: favorites }) => ({ type: 'favorites', data: favorites }))
            );
        }

        // 3. Await all additional data
        if (promises.length > 0) {
            const results = await Promise.all(promises);

            // Process results
            let profilesMap = new Map();
            let favoriteItemIds = new Set();

            results.forEach((result: any) => {
                if (result.type === 'profiles' && result.data) {
                    profilesMap = new Map(result.data.map((p: any) => [p.id, p]));
                } else if (result.type === 'favorites' && result.data) {
                    favoriteItemIds = new Set(result.data.map((fav: any) => fav.item_id));
                }
            });

            // Apply data to formations
            formationsWithFavorites = formationsWithFavorites.map((formation: any) => {
                // Attach profile
                if (formation.professeur && formation.professeur.id && profilesMap.has(formation.professeur.id)) {
                    formation.professeur.profiles = profilesMap.get(formation.professeur.id);
                }

                // Attach favorite status
                return {
                    ...formation,
                    is_favorited: favoriteItemIds.has(formation.id)
                };
            });
        } else {
            // If no user, ensure is_favorited is false
            formationsWithFavorites = formationsWithFavorites.map((formation: any) => ({
                ...formation,
                is_favorited: false
            }));
        }

        return { data: formationsWithFavorites, error: null };
    } catch (e: any) {
        console.error("Unexpected error in getAllFormations:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}
