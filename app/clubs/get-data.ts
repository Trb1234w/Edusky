'use server';

import { createClient } from "@/lib/supabase/server";

/**
 * Fetches all distinct tags used in clubs
 */
export async function getDistinctClubTags(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('clubs')
            .select('tags')
            .not('tags', 'is', null);

        if (error) {
            console.error("Error fetching club tags:", error);
            return { data: null, error: error.message };
        }

        const allTags = new Set<string>();
        data?.forEach((club: any) => {
            if (club.tags && Array.isArray(club.tags)) {
                club.tags.forEach((tag: string) => allTags.add(tag));
            }
        });

        return { data: Array.from(allTags).sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctClubTags:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct themes used in clubs
 */
export async function getDistinctClubThemes(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('clubs')
            .select('theme_principal')
            .not('theme_principal', 'is', null);

        if (error) {
            console.error("Error fetching club themes:", error);
            return { data: null, error: error.message };
        }

        const themes = new Set<string>();
        data?.forEach((club: any) => {
            if (club.theme_principal) {
                themes.add(club.theme_principal);
            }
        });

        return { data: Array.from(themes).sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctClubThemes:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct locations used in clubs
 */
export async function getDistinctClubLocations(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('clubs')
            .select('lieu')
            .not('lieu', 'is', null);

        if (error) {
            console.error("Error fetching club locations:", error);
            return { data: null, error: error.message };
        }

        const locations = new Set<string>();
        data?.forEach((club: any) => {
            if (club.lieu) {
                locations.add(club.lieu);
            }
        });

        return { data: Array.from(locations).sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctClubLocations:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

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
 * Fetches all distinct locations (countries, cities, neighborhoods) from clubs
 * using the get_distinct_locations SQL function.
 */
export async function getDistinctClubLocationsData(): Promise<{ data: LocationsData | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_locations');

        if (error) {
            console.error("Error fetching club locations data:", error);
            return { data: null, error: error.message };
        }

        return { data: data as LocationsData, error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctClubLocationsData:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all clubs using the get_clubs RPC function with admin client
 */
export async function getAllClubs(): Promise<{ data: any[] | null; error: string | null }> {
    try {
        console.log('[getAllClubs] Starting to fetch clubs...');
        const supabase = await createClient();
        console.log('[getAllClubs] Supabase client created');

        const { data: clubsData, error } = await supabase.rpc('get_clubs', {
            search_term: null,
            category_slug: null,
            statut_filter: null,
            theme_filter: null,
            sort_by: 'created_at_desc'
        });

        if (error) {
            console.error("Error fetching clubs via RPC:", error);
            return { data: null, error: error.message };
        }

        let clubs = clubsData || [];
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: favoritesData, error: favoritesError } = await supabase
                .from('favoris')
                .select('item_id')
                .eq('user_id', user.id)
                .eq('type_item', 'club');

            if (favoritesError) {
                console.error("Error fetching user favorites:", favoritesError);
            } else {
                const favoriteItemIds = new Set(favoritesData?.map(fav => fav.item_id));
                clubs = clubs.map((club: any) => ({
                    ...club,
                    is_favorited: favoriteItemIds.has(club.id)
                }));
            }
        } else {
            clubs = clubs.map((club: any) => ({
                ...club,
                is_favorited: false
            }));
        }

        console.log('[getAllClubs] Returning data successfully');
        return { data: clubs, error: null };
    } catch (e: any) {
        console.error("Unexpected error in getAllClubs:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct langues used in clubs
 */
export async function getDistinctClubLangues(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_club_langues');

        if (error) {
            console.error("Error fetching club langues:", error);
            return { data: null, error: error.message };
        }

        // The RPC returns an array of objects with a 'langue' property
        const langues = data?.map((item: any) => item.langue) || [];

        return { data: langues.sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctClubLangues:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

