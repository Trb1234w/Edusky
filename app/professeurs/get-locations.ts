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
 * Fetches all distinct locations (countries, cities, neighborhoods) for professeurs
 * using the get_distinct_professeur_locations SQL function.
 */
export async function getDistinctProfesseurLocations(): Promise<{ data: LocationsData | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_professeur_locations');

        if (error) {
            console.error("Error fetching professeur locations:", error);
            return { data: null, error: error.message };
        }

        return { data: data as LocationsData, error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctProfesseurLocations:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct types of professeurs
 */
export async function getDistinctProfesseurTypes(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_professeur_types');

        if (error) {
            console.error("Error fetching professeur types:", error);
            return { data: null, error: error.message };
        }

        return { data: data?.map((row: any) => row.type) || [], error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctProfesseurTypes:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct specialties from professeurs
 */
export async function getDistinctProfesseurSpecialties(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_professeur_specialties');

        if (error) {
            console.error("Error fetching professeur specialties:", error);
            return { data: null, error: error.message };
        }

        return { data: data?.map((row: any) => row.specialite) || [], error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctProfesseurSpecialties:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct languages spoken by professeurs
 */
export async function getDistinctProfesseurLangues(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_professeur_langues');

        if (error) {
            console.error("Error fetching professeur langues:", error);
            return { data: null, error: error.message };
        }

        return { data: data?.map((row: any) => row.langue) || [], error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctProfesseurLangues:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all professeurs using the get_professeurs RPC function
 */
export async function getAllProfesseurs(): Promise<{ data: any[] | null; error: string | null }> {
    try {
        console.log('[getAllProfesseurs] Starting to fetch professeurs...');
        const supabase = await createClient();
        console.log('[getAllProfesseurs] Supabase client created');

        const { data, error } = await supabase.rpc('get_professeurs', {
            search_term: null,
            min_rating: 0,
            has_certification: null,
            sort_by: 'note_moyenne_desc',
            p_limit: 100,
            p_offset: 0,
            type_filter: null,
            specialite_filter: null,
            pays_id_filter: null,
            ville_id_filter: null,
            quartier_id_filter: null,
            min_experience: null,
            max_experience: null,
            min_tarif: null,
            max_tarif: null,
            langue_filter: null,
            min_etudiants: null,
            is_verified_filter: null,
            genre_filter: null
        });

        console.log('[getAllProfesseurs] RPC call completed');
        console.log('[getAllProfesseurs] Data received:', data ? `${data.length} professeurs` : 'null');
        console.log('[getAllProfesseurs] Error:', error);

        if (error) {
            console.error("Error fetching professeurs via RPC:", error);
            return { data: null, error: error.message };
        }

        console.log('[getAllProfesseurs] Returning data successfully');
        return { data: data || [], error: null };
    } catch (e: any) {
        console.error("Unexpected error in getAllProfesseurs:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}
