'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, Loader2, Link as LinkIcon, Send } from "lucide-react";
import {
  CustomBottomSheet,
  CustomBottomSheetContent,
  CustomBottomSheetHeader,
  CustomBottomSheetTitle,
  CustomBottomSheetTrigger,
  CustomBottomSheetDescription,
} from "@/components/ui/custom-bottom-sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { getCommentsByPostId } from "@/lib/data/comments";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toggleLike, addComment, sharePostAction } from "@/app/actions";
import { deletePostAction, updatePostStatusAction, updatePostVisibilityAction } from "@/app/dashboard/actions";
import { Trash2, Eye, EyeOff, Archive, Globe, Lock } from "lucide-react";
import { followUserAction } from "@/app/users/actions";
import { findOrCreateConversationAction } from "@/app/messages/actions";
import { useRouter } from "next/navigation";

interface PostCardProps {
  id: string;
  authorId: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  authorUsername: string;
  content: string;
  image: string | null;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  currentUserId: string;
  followingIds: string[];
}

interface Comment {
  id: string;
  contenu: string;
  created_at: string;
  auteur: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function PostCard(props: PostCardProps) {
  const {
    id,
    authorId,
    author,
    authorRole,
    authorAvatar,
    authorUsername,
    content,
    image,
    timestamp,
    likes,
    comments,
    shares,
    liked,
    currentUserId,
    followingIds,
  } = props;

  const router = useRouter();
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(liked);
  const [isFollowing, setIsFollowing] = useState(followingIds.includes(authorId));
  const [isSubmittingFollow, setIsSubmittingFollow] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const handleDeletePost = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;
    setIsDeleting(true);
    const { error } = await deletePostAction(id);
    if (error) {
      toast({ title: "Erreur", description: error, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Post supprimé avec succès" });
      router.refresh();
    }
    setIsDeleting(false);
  };

  const handleUpdateStatus = async (status: string) => {
    setIsUpdatingStatus(true);
    const { error } = await updatePostStatusAction(id, status);
    if (error) {
      toast({ title: "Erreur", description: error, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Statut mis à jour" });
      router.refresh();
    }
    setIsUpdatingStatus(false);
  };

  const handleUpdateVisibility = async (visibility: string) => {
    setIsUpdatingStatus(true);
    const { error } = await updatePostVisibilityAction(id, visibility);
    if (error) {
      toast({ title: "Erreur", description: error, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Visibilité mise à jour" });
      router.refresh();
    }
    setIsUpdatingStatus(false);
  };

  useEffect(() => {
    setCurrentLikes(likes);
    setIsLiked(liked);
    setIsFollowing(followingIds.includes(authorId));
  }, [likes, liked, followingIds, authorId]);

  const fetchComments = async () => {
    setLoadingComments(true);
    const { data, error } = await getCommentsByPostId(id);
    if (data) {
      setCommentsData(data as Comment[]);
    }
    if (error) {
      console.error("Error fetching comments:", error);
    }
    setLoadingComments(false);
  };

  useEffect(() => {
    if (showCommentsDialog) {
      fetchComments();
    }
  }, [showCommentsDialog, id]);

  const handleLikeClick = async () => {
    console.log(`handleLikeClick: Liking post ${id} as user ${currentUserId}`);
    if (!currentUserId) return;

    const previousIsLiked = isLiked;
    const previousLikes = currentLikes;

    setIsLiked(!previousIsLiked);
    setCurrentLikes(previousIsLiked ? previousLikes - 1 : previousLikes + 1);

    const { error } = await toggleLike(id, currentUserId);

    if (error) {
      console.error("Erreur lors de l'action de like:", error);
      setIsLiked(previousIsLiked);
      setCurrentLikes(previousLikes);
    }
  };

  const handleAddComment = async () => {
    if (!currentUserId || !newCommentContent.trim()) return;
    setAddingComment(true);
    const { error } = await addComment(id, currentUserId, newCommentContent);
    if (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    } else {
      setNewCommentContent('');
      await fetchComments();
    }
    setAddingComment(false);
  };

  const handleShare = async () => {
    if (!currentUserId) return;
    const { error } = await sharePostAction(id, currentUserId);
    if (error) {
      toast({ title: "Erreur", description: "Le partage a échoué.", variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Post partagé avec succès!" });
    }
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      toast({ title: "Copié!", description: "Le lien du post a été copié dans le presse-papiers." });
    });
  };

  const handleFollow = async () => {
    console.log(`handleFollow: User ${currentUserId} is following user ${authorId}`);
    if (!currentUserId || !authorId || isSubmittingFollow) return;
    setIsSubmittingFollow(true);
    const { error } = await followUserAction(currentUserId, authorId);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de suivre l'utilisateur.", variant: "destructive" });
    } else {
      setIsFollowing(true);
    }
    setIsSubmittingFollow(false);
  };

  const handleMessageUser = async () => {
    console.log(`handleMessageUser: Starting conversation with user ${authorId}`);
    if (isCreatingConversation) {
      console.log("handleMessageUser: Conversation creation already in progress.");
      return;
    }
    setIsCreatingConversation(true);
    console.log("handleMessageUser: Calling findOrCreateConversationAction...");
    const { data: conversationId, error } = await findOrCreateConversationAction(authorId);
    console.log("handleMessageUser: findOrCreateConversationAction returned. Data:", conversationId, "Error:", error);
    if (error) {
      toast({ title: "Erreur de messagerie", description: error, variant: "destructive" });
    } else {
      console.log(`handleMessageUser: Redirecting to /messages?conversation=${conversationId}`);
      router.push(`/messages?conversation=${conversationId}`);
    }
    setIsCreatingConversation(false);
  };

  return (
    <Card className="rounded-none md:rounded-xl border-border/50 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden group">
      <CardContent className="p-2 lg:p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-1 lg:mb-4">
          <Link href={`/profile/${authorUsername}`} className="flex items-center gap-2 lg:gap-3">
            <Avatar className="w-10 h-10 rounded-none lg:w-12 lg:h-12 lg:rounded-full">
              <AvatarImage src={authorAvatar || undefined} alt={author} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{author}</p>
              <div className="hidden lg:block"> {/* Desktop only */}
                <p className="text-sm text-muted-foreground">{authorRole}</p>
                {timestamp && (
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr })}</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground lg:hidden"> {/* Mobile only */}
                {authorRole} • {timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr }) : ''}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {currentUserId !== authorId && (
              <>
                {!isFollowing && (
                  <Button size="sm" variant="outline" onClick={handleFollow} disabled={isSubmittingFollow}>
                    {isSubmittingFollow ? <Loader2 className="h-4 w-4 animate-spin" /> : "Suivre"}
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={handleMessageUser} disabled={isCreatingConversation}>
                  {isCreatingConversation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-5 w-5 text-muted-foreground" />}
                </Button>
              </>
            )}


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="text-muted-foreground">
                  <MoreHorizontal size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {currentUserId === authorId ? (
                  <>
                    <DropdownMenuItem onClick={() => handleUpdateVisibility('public')}>
                      <Globe className="mr-2 h-4 w-4" />
                      <span>Public</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateVisibility('prive')}>
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Privé</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus('archive')}>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>Archiver</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeletePost} className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <span>Signaler</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-1 lg:mb-4">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Post Image */}
        {image && (
          <div className="mb-1 lg:mb-4 rounded-xl overflow-hidden">
            <div className="w-full h-64 lg:h-80 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center justify-between py-1 lg:py-3 border-y lg:border-border mb-1 lg:mb-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{currentLikes} j'aime</span>
            <span>{comments} commentaires</span>
            <span>{shares} partages</span>
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 h-8 text-xs lg:text-sm rounded-full transition-all ${isLiked
              ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
              : "bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground"}`}
            onClick={handleLikeClick}
            disabled={!currentUserId}
          >
            <Heart size={16} className={`mr-1.5 ${isLiked ? "fill-current" : ""}`} />
            <span>J'aime</span>
          </Button>
          <CustomBottomSheet open={showCommentsDialog} onOpenChange={setShowCommentsDialog}>
            <CustomBottomSheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-8 text-xs lg:text-sm rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 transition-all shadow-sm transition-all"
                onClick={fetchComments}
              >
                <MessageCircle size={16} className="mr-1.5" />
                <span>Commenter</span>
              </Button>
            </CustomBottomSheetTrigger>
            <CustomBottomSheetContent noBodyStyles className="h-[85vh] max-h-[85vh]">
              <CustomBottomSheetHeader className="px-6 pb-2">
                <CustomBottomSheetTitle>Commentaires</CustomBottomSheetTitle>
                <CustomBottomSheetDescription>
                  Voir et ajouter des commentaires pour ce post.
                </CustomBottomSheetDescription>
              </CustomBottomSheetHeader>

              {/* Scrollable Comments List */}
              <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0">
                {loadingComments ? (
                  <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : commentsData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground/20 mb-3" />
                    <p className="text-muted-foreground font-medium">Aucun commentaire</p>
                    <p className="text-xs text-muted-foreground">Soyez le premier à réagir !</p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {commentsData.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 group">
                        <Avatar className="w-8 h-8 border border-border shrink-0 mt-1">
                          <AvatarImage src={comment.auteur?.avatar_url || "/placeholder.svg"} alt={comment.auteur?.full_name || "User"} />
                          <AvatarFallback>{comment.auteur?.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted/30 p-3 rounded-2xl rounded-tl-none hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm">{comment.auteur?.full_name || "Utilisateur inconnu"}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                            </p>
                          </div>
                          <p className="text-sm text-foreground/90 leading-relaxed">{comment.contenu}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fixed Input Footer */}
              {currentUserId && (
                <div className="p-4 border-t border-border bg-background mt-auto shrink-0 pb-6 lg:pb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 shrink-0 hidden sm:block">
                      <AvatarImage src={authorAvatar || undefined} alt={author} />
                      <AvatarFallback>{author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Ajouter un commentaire..."
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        className="min-h-[44px] pr-12 rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (newCommentContent.trim() && !addingComment) handleAddComment();
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                        onClick={handleAddComment}
                        disabled={!newCommentContent.trim() || addingComment}
                      >
                        {addingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CustomBottomSheetContent>
          </CustomBottomSheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs lg:text-sm rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 transition-all shadow-sm">
                <Share2 size={16} className="mr-1.5" />
                <span>Partager</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleShare} disabled={!currentUserId}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Republier</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>Copier le lien</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
