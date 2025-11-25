'use client'

import { useState, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Send, User } from "lucide-react"
import { addArticleComment } from "@/app/blog/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CommentFormProps {
    articleId: string
    userAvatar?: string | null
    userFullName?: string | null
}

export function CommentForm({ articleId, userAvatar, userFullName }: CommentFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [comment, setComment] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!comment.trim()) {
            toast.error('Le commentaire ne peut pas être vide')
            return
        }

        startTransition(async () => {
            const result = await addArticleComment(articleId, comment)

            if (result.success) {
                toast.success('Commentaire ajouté avec succès !')
                setComment('')
                router.refresh()
            } else {
                if (result.error === 'User not authenticated') {
                    toast.error('Vous devez être connecté pour commenter')
                    router.push('/login')
                } else {
                    toast.error('Erreur lors de l\'ajout du commentaire')
                }
            }
        })
    }

    return (
        <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">Laisser un commentaire</h3>
            <form onSubmit={handleSubmit}>
                <div className="flex items-start gap-4">
                    <Avatar>
                        {userAvatar ? (
                            <AvatarImage src={userAvatar} alt={userFullName || ''} />
                        ) : null}
                        <AvatarFallback>
                            {userFullName ? userFullName.charAt(0).toUpperCase() : <User />}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 relative">
                        <textarea
                            placeholder="Écrivez votre commentaire..."
                            className="w-full p-4 border rounded-lg resize-none pr-12 focus:ring-2 focus:ring-primary focus:border-transparent"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isPending}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-3 bottom-3 rounded-full"
                            disabled={isPending || !comment.trim()}
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
