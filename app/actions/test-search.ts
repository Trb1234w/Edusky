'use server'

import { createClient } from '@/lib/supabase/server'

// Test simple pour vérifier les données
export async function testSearchData() {
    const supabase = await createClient()

    console.log('=== TESTING SEARCH DATA ===')

    // Test formations
    const { data: formations, error: formError } = await supabase
        .from('formations')
        .select('id, titre, statut')
        .limit(5)

    console.log('Formations (all statuses):', formations)
    console.log('Formations error:', formError)

    // Test formations publiées
    const { data: formPub, error: formPubError } = await supabase
        .from('formations')
        .select('id, titre, statut')
        .eq('statut', 'publie')
        .limit(5)

    console.log('Formations (publie only):', formPub)
    console.log('Formations publie error:', formPubError)

    // Test événements
    const { data: events } = await supabase
        .from('evenements')
        .select('id, titre, statut')
        .limit(5)

    console.log('Events (all):', events)

    // Test clubs
    const { data: clubs } = await supabase
        .from('clubs')
        .select('id, nom')
        .limit(5)

    console.log('Clubs (all):', clubs)

    // Test articles
    const { data: articles } = await supabase
        .from('articles_blog')
        .select('id, titre, statut')
        .limit(5)

    console.log('Articles (all):', articles)

    return { formations, events, clubs, articles }
}
