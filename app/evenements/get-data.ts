'use server';

import { createClient } from "@/lib/supabase/server";

/**
 * Fetches all distinct tags used in events
 */
export async function getDistinctEventTags(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('evenements')
            .select('tags')
            .eq('statut', 'publie')
            .not('tags', 'is', null);

        if (error) {
            console.error("Error fetching event tags:", error);
            return { data: null, error: error.message };
        }

        const allTags = new Set<string>();
        data?.forEach((event: any) => {
            if (event.tags && Array.isArray(event.tags)) {
                event.tags.forEach((tag: string) => allTags.add(tag));
            }
        });

        return { data: Array.from(allTags).sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctEventTags:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct event types
 */
export async function getDistinctEventTypes(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('evenements')
            .select('type_evenement')
            .eq('statut', 'publie')
            .not('type_evenement', 'is', null);

        if (error) {
            console.error("Error fetching event types:", error);
            return { data: null, error: error.message };
        }

        const types = new Set<string>();
        data?.forEach((event: any) => {
            if (event.type_evenement) {
                types.add(event.type_evenement);
            }
        });

        return { data: Array.from(types).sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctEventTypes:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all events using the get_evenements RPC function with admin client
 */
export async function getAllEvenements(): Promise<{ data: any[] | null; error: string | null }> {
    try {
        console.log('[getAllEvenements] Starting to fetch events...');
        const supabase = await createClient();
        console.log('[getAllEvenements] Supabase client created');

        const { data, error } = await supabase.rpc('get_evenements', {
            search_term: null,
            category_slug: null,
            mode_filter: null,
            pays_filter: null,
            ville_filter: null,
            quartier_filter: null,
            type_filter: null,
            sort_by: 'date_debut_asc'
        });

        console.log('[getAllEvenements] RPC call completed');
        console.log('[getAllEvenements] Data received:', data ? `${data.length} events` : 'null');
        console.log('[getAllEvenements] Error:', error);

        if (error) {
            console.error("Error fetching events via RPC:", error);
            return { data: null, error: error.message };
        }

        console.log('[getAllEvenements] Returning data successfully');
        return { data: data || [], error: null };
    } catch (e: any) {
        console.error("Unexpected error in getAllEvenements:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}
