'use client'

import { useState, useTransition } from 'react';
import { PostCard } from "@/components/PostCard";
import { SharedPostCard } from "@/components/shared-post-card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye, EyeOff, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { deletePostAction, updatePostVisibilityAction, updatePostStatusAction } from "@/app/dashboard/actions";
import { useToast } from "@/components/ui/use-toast";

interface DashboardPostCardProps {
    post: any;
    currentUserId: string;
    followingIds: string[];
}

export function DashboardPostCard({ post, currentUserId, followingIds }: DashboardPostCardProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [isVisible, setIsVisible] = useState(true); // Pour cacher le post après suppression

    const handleDelete = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
            startTransition(async () => {
                const result = await deletePostAction(post.id);
                if (result.error) {
                    toast({
                        title: "Erreur",
                        description: result.error,
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Succès",
                        description: "Post supprimé avec succès",
                    });
                    setIsVisible(false);
                }
            });
        }
    };

    const handleVisibilityChange = (value: string) => {
        startTransition(async () => {
            const result = await updatePostVisibilityAction(post.id, value);
            if (result.error) {
                toast({
                    title: "Erreur",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Succès",
                    description: `Visibilité changée en ${value}`,
                });
                // Refresh page or update local state could be better, but for now toast is enough
                window.location.reload();
            }
        });
    };

    const handleStatusChange = (value: string) => {
        startTransition(async () => {
            const result = await updatePostStatusAction(post.id, value);
            if (result.error) {
                toast({
                    title: "Erreur",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Succès",
                    description: `Statut changé en ${value}`,
                });
                window.location.reload();
            }
        });
    };

    if (!isVisible) return null;

    const commonProps = {
        ...post,
        currentUserId,
        followingIds,
        authorUsername: post.authorUsername || post.auteur?.username,
    };

    return (
        <div className="relative group">
            {post.sharedPost ? (
                <SharedPostCard {...commonProps} />
            ) : (
                <PostCard post={post} />
            )}

            <div className="absolute top-4 right-4 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Gérer le post</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                {post.visibilite === 'public' ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                                <span>Visibilité</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={post.visibilite} onValueChange={handleVisibilityChange}>
                                    <DropdownMenuRadioItem value="public">Public</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="prive">Privé</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="amis">Amis uniquement</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                {post.statut === 'publie' ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                                <span>Statut</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={post.statut} onValueChange={handleStatusChange}>
                                    <DropdownMenuRadioItem value="publie">Publié</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="brouillon">Brouillon</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="archive">Archivé</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            <span>Supprimer</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
