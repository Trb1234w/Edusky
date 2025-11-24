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
 * Fetches all formations using the get_formations RPC function with admin client
 */
export async function getAllFormations(): Promise<{ data: any[] | null; error: string | null }> {
    try {
        console.log('[getAllFormations] Starting to fetch formations...');
        const supabase = await createClient();
        console.log('[getAllFormations] Supabase client created');

        const { data, error } = await supabase.rpc('get_formations', {
            search_term: null,
            category_slug: null,
            niveau_filter: null,
            min_price: null,
            max_price: null,
            min_rating: null,
            sort_by: 'date_publication_desc'
        });

        console.log('[getAllFormations] RPC call completed');
        console.log('[getAllFormations] Data received:', data ? `${data.length} formations` : 'null');
        console.log('[getAllFormations] Error:', error);

        if (error) {
            console.error("Error fetching formations via RPC:", error);
            return { data: null, error: error.message };
        }

        console.log('[getAllFormations] Returning data successfully');
        return { data: data || [], error: null };
    } catch (e: any) {
        console.error("Unexpected error in getAllFormations:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}
