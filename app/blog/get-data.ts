'use server';

import { createClient } from "@/lib/supabase/server";

/**
 * Fetches all distinct tags used in blog articles
 */
export async function getDistinctArticleTags(): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('articles_blog')
            .select('tags')
            .eq('statut', 'publie')
            .not('tags', 'is', null);

        if (error) {
            console.error("Error fetching article tags:", error);
            return { data: null, error: error.message };
        }

        const allTags = new Set<string>();
        data?.forEach((article: any) => {
            if (article.tags && Array.isArray(article.tags)) {
                article.tags.forEach((tag: string) => allTags.add(tag));
            }
        });

        return { data: Array.from(allTags).sort(), error: null };
    } catch (e: any) {
        console.error("Unexpected error in getDistinctArticleTags:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}

/**
 * Fetches all blog articles using the get_articles RPC function with admin client
 */
export async function getAllArticles(): Promise<{ data: any[] | null; error: string | null }> {
    try {
        // console.log('[getAllArticles] Starting to fetch articles...');
        const supabase = await createClient();
        // console.log('[getAllArticles] Supabase client created');

        // 1. Fetch user and articles in parallel
        const [userResponse, articlesResponse] = await Promise.all([
            supabase.auth.getUser(),
            supabase.rpc('get_articles', {
                search_term: null,
                category_slug: null,
                min_vues: null,
                min_likes: null,
                sort_by: 'publie_at_desc'
            })
        ]);

        const user = userResponse.data.user;
        let articles = articlesResponse.data || [];
        const error = articlesResponse.error;

        if (error) {
            console.error("Error fetching articles via RPC:", error);
            return { data: null, error: error.message };
        }

        // 2. Fetch favorites if user is logged in
        if (user) {
            const { data: favoritesData, error: favoritesError } = await supabase
                .from('favoris')
                .select('item_id')
                .eq('user_id', user.id)
                .eq('type_item', 'article');

            if (favoritesError) {
                console.error("Error fetching user favorites:", favoritesError);
            } else {
                const favoriteItemIds = new Set(favoritesData?.map(fav => fav.item_id));
                articles = articles.map((article: any) => ({
                    ...article,
                    is_favorited: favoriteItemIds.has(article.id)
                }));
            }
        } else {
            articles = articles.map((article: any) => ({
                ...article,
                is_favorited: false
            }));
        }

        // console.log('[getAllArticles] Returning data successfully');
        return { data: articles, error: null };
    } catch (e: any) {
        console.error("Unexpected error in getAllArticles:", e);
        return { data: null, error: e.message || "An unexpected error occurred." };
    }
}
