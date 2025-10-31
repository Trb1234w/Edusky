'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, Loader2, Link as LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { getCommentsByPostId } from "@/lib/data/comments";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toggleLike, addComment, sharePostAction } from "@/app/actions";
import { followUserAction } from "@/app/users/actions";
import { findOrCreateConversationAction } from "@/app/messages/actions";
import { useRouter } from "next/navigation";

interface PostCardProps {
  id: string;
  authorId: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
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
  const { toast } = useToast();

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
    setIsLiked(!isLiked);
    setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
    const { error } = await toggleLike(id, currentUserId);
    if (error) {
      console.error("Erreur lors de l'action de like:", error);
      setIsLiked(isLiked);
      setCurrentLikes(currentLikes);
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
      toast({ title: "Erreur de messagerie", description: error.message, variant: "destructive" });
    } else {
      console.log(`handleMessageUser: Redirecting to /messages?conversation=${conversationId}`);
      router.push(`/messages?conversation=${conversationId}`);
    }
    setIsCreatingConversation(false);
  };

  return (
    <Card className="rounded-none shadow-sm hover:shadow-md transition-shadow lg:rounded-xl lg:border-border lg:hover:shadow-lg">
      <CardContent className="p-2 lg:p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-1 lg:mb-4">
          <div className="flex items-center gap-2 lg:gap-3">
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
          </div>
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
            <Button size="sm" variant="ghost" className="text-muted-foreground">
              <MoreHorizontal size={20} />
            </Button>
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
            className={`flex-1 rounded-none lg:rounded-md ${isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground"}`}
            onClick={handleLikeClick}
            disabled={!currentUserId}
          >
            <Heart size={20} className={isLiked ? "fill-current" : ""} />
            <span className="ml-2">J'aime</span>
          </Button>
          <Dialog open={showCommentsDialog} onOpenChange={setShowCommentsDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 rounded-none lg:rounded-md text-muted-foreground"
                onClick={fetchComments}
              >
                <MessageCircle size={20} />
                <span className="ml-2">Commenter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Commentaires</DialogTitle>
                <DialogDescription>
                  Voir et ajouter des commentaires pour ce post.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 max-h-[400px] overflow-y-auto">
                {loadingComments ? (
                  <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : commentsData.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucun commentaire pour le moment.</p>
                ) : (
                  <div className="space-y-4">
                    {commentsData.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.auteur?.avatar_url || "/placeholder.svg"} alt={comment.auteur?.full_name || "User"} />
                          <AvatarFallback>{comment.auteur?.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{comment.auteur?.full_name || "Utilisateur inconnu"}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                          </p>
                          <p className="text-sm mt-1">{comment.contenu}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {currentUserId && (
                <div className="flex items-start gap-2 pt-4 border-t border-border">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={authorAvatar || undefined} alt={author} />
                    <AvatarFallback>{author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Ajouter un commentaire..."
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      className="min-h-[60px] resize-none mb-2"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newCommentContent.trim() || addingComment}
                    >
                      {addingComment ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Commenter
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 rounded-none lg:rounded-md text-muted-foreground">
                <Share2 size={20} />
                <span className="ml-2">Partager</span>
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
