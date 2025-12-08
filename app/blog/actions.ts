'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Incrémente le compteur de vues d'un article
 */
export async function incrementArticleViews(articleId: string) {
    try {
        const supabase = await createClient()
        const { error } = await supabase.rpc('increment_article_views', {
            article_id_param: articleId
        })

        if (error) throw error
        return { success: true }
    } catch (error: any) {
        console.error('Error incrementing views:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Toggle le like d'un article (like si pas liké, unlike si déjà liké)
 */
export async function toggleArticleLike(articleId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'User not authenticated' }
        }

        // Vérifier si l'utilisateur a déjà liké cet article
        const { data: existingLike } = await supabase
            .from('likes')
            .select('id')
            .eq('user_id', user.id)
            .eq('parent_type', 'article_blog')
            .eq('parent_id', articleId)
            .maybeSingle()

        if (existingLike) {
            // Unlike: supprimer le like
            await supabase
                .from('likes')
                .delete()
                .eq('id', existingLike.id)

            // Décrémenter likes_count
            // Décrémenter likes_count
            await supabase.rpc('decrement_article_likes', {
                article_id_param: articleId
            })

            revalidatePath(`/blog/${articleId}`)
            return { success: true, liked: false }
        } else {
            // Like: ajouter le like
            await supabase
                .from('likes')
                .insert({
                    user_id: user.id,
                    parent_type: 'article_blog',
                    parent_id: articleId
                })

            // Incrémenter likes_count
            // Incrémenter likes_count
            await supabase.rpc('increment_article_likes', {
                article_id_param: articleId
            })

            revalidatePath(`/blog/${articleId}`)
            return { success: true, liked: true }
        }
    } catch (error: any) {
        console.error('Error toggling like:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Ajoute un commentaire à un article
 */
export async function addArticleComment(articleId: string, contenu: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'User not authenticated' }
        }

        if (!contenu.trim()) {
            return { success: false, error: 'Comment cannot be empty' }
        }

        const { error } = await supabase
            .from('commentaires_blog')
            .insert({
                article_id: articleId,
                auteur_id: user.id,
                contenu: contenu.trim()
            })

        if (error) throw error

        revalidatePath(`/blog/${articleId}`)
        return { success: true }
    } catch (error: any) {
        console.error('Error adding comment:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Récupère tous les commentaires d'un article
 */
export async function getArticleComments(articleId: string) {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.rpc('get_article_comments', {
            article_id_param: articleId
        })

        if (error) throw error
        return { success: true, data: data || [] }
    } catch (error: any) {
        console.error('Error fetching comments:', error)
        return { success: false, error: error.message, data: [] }
    }
}

/**
 * Vérifie si l'utilisateur connecté a liké un article
 */
export async function checkUserLiked(articleId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: true, liked: false }
        }

        const { data, error } = await supabase.rpc('has_user_liked_article', {
            user_id_param: user.id,
            article_id_param: articleId
        })

        if (error) throw error
        return { success: true, liked: data || false }
    } catch (error: any) {
        console.error('Error checking like status:', error)
        return { success: false, liked: false }
    }
}
