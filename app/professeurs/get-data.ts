'use server';

import { createClient } from "@/lib/supabase/server";

/**
 * Fetches all distinct langues d'enseignement used by professeurs
 */
export async function getDistinctLanguesEnseignement(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_langues_enseignement');

        if (error) {
            console.error("Error fetching langues d'enseignement:", error);
            return { data: null, error: error.message };
        }

        // The RPC returns an array of objects with a 'langue' property
        const langues = data?.map((item: any) => item.langue) || [];

        return { data: langues.sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctLanguesEnseignement:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct méthodes pédagogiques used by professeurs
 */
export async function getDistinctMethodesPedagogiques(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_methodes_pedagogiques');

        if (error) {
            console.error("Error fetching méthodes pédagogiques:", error);
            return { data: null, error: error.message };
        }

        // The RPC returns an array of objects with a 'methode' property
        const methodes = data?.map((item: any) => item.methode) || [];

        return { data: methodes.sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctMethodesPedagogiques:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct domaines d'intervention used by professeurs
 */
export async function getDistinctDomainesIntervention(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_domaines_intervention');

        if (error) {
            console.error("Error fetching domaines d'intervention:", error);
            return { data: null, error: error.message };
        }

        // The RPC returns an array of objects with a 'domaine' property
        const domaines = data?.map((item: any) => item.domaine) || [];

        return { data: domaines.sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctDomainesIntervention:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all distinct modalités de cours used by professeurs
 */
export async function getDistinctModalitesCours(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('get_distinct_modalites_cours');

        if (error) {
            console.error("Error fetching modalités de cours:", error);
            return { data: null, error: error.message };
        }

        // The RPC returns an array of objects with a 'modalite' property
        const modalites = data?.map((item: any) => item.modalite) || [];

        return { data: modalites.sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctModalitesCours:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}
