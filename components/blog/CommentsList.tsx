'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface Comment {
    id: string
    article_id: string
    auteur_id: string
    contenu: string
    created_at: string
    auteur_full_name: string
    auteur_avatar_url: string
}

interface CommentsListProps {
    comments: Comment[]
}

export function CommentsList({ comments }: CommentsListProps) {
    if (comments.length === 0) {
        return (
            <Card className="p-6 text-center bg-secondary/50 border-dashed">
                <p className="text-muted-foreground">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.auteur_avatar_url || ''} alt={comment.auteur_full_name || ''} />
                        <AvatarFallback>{comment.auteur_full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{comment.auteur_full_name}</p>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.created_at), {
                                    addSuffix: true,
                                    locale: fr
                                })}
                            </span>
                        </div>

                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {comment.contenu}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
