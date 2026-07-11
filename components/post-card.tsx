'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, Loader2, Link as LinkIcon, Send, X } from "lucide-react";
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
import { toggleLike, addComment, sharePostAction, reportContent } from "@/app/actions";
import { deletePostAction, updatePostStatusAction, updatePostVisibilityAction } from "@/app/dashboard/actions";
import { Trash2, Eye, EyeOff, Archive, Globe, Lock } from "lucide-react";
import { followUserAction } from "@/app/users/actions";
import { useRouter } from "next/navigation";

interface PostCardProps {
  id: string;
  authorId: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  authorUsername: string;
  content: string;
  media: {
    images?: string[];
    video?: string;
  } | null;
  timestamp: string;
  likes?: number;
  comments?: number;
  shares?: number;
  liked: boolean;
  currentUserId: string;
  followingIds: string[];
  onLikeChange?: (newLiked: boolean, newLikesCount: number) => void;
}

interface Comment {
  id: string;
  contenu: string;
  created_at: string;
  auteur: {
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  } | null;
}

import { Dialog, DialogContent, DialogClose, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { ChevronLeft, ChevronRight } from "lucide-react";

function MediaGallery({ media }: { media: PostCardProps['media'] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!media || (!media.images?.length && !media.video)) {
    return null;
  }

  const images = media.images || [];
  const video = media.video;

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const totalMedia = images.length + (video ? 1 : 0);

  if (totalMedia === 0) return null;

  return (
    <>
      <div className="mb-2 lg:mb-4 rounded-lg overflow-hidden">
        {video && (
          <video src={video} controls className="w-full rounded-lg bg-black" />
        )}
        {images.length > 0 && (
          <div className={`grid ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 mt-1`}>
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`relative ${images.length === 3 && index === 0 ? 'row-span-2' : ''} ${images.length >= 4 ? 'h-40' : 'h-64'}`}
                onClick={() => openLightbox(index)}
              >
                <Image src={image} alt={`Post media ${index + 1}`} layout="fill" className="object-cover cursor-pointer" />
                {images.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="p-0 bg-transparent border-none max-w-4xl w-full h-[90vh]">
          <VisuallyHidden.Root>
            <DialogTitle>Aperçu de l'image du post</DialogTitle>
          </VisuallyHidden.Root>
          <Image src={images[selectedImageIndex]} alt="Post media" layout="fill" className="object-contain" />

          {images.length > 1 && (
            <>
              <Button onClick={goToPrevious} variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white">
                <ChevronLeft size={24} />
              </Button>
              <Button onClick={goToNext} variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white">
                <ChevronRight size={24} />
              </Button>
            </>
          )}
          <DialogClose className="absolute top-2 right-2 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white">
            <X size={24} />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
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
    media,
    timestamp,
    likes = 0,
    comments = 0,
    shares = 0,
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
  const [newCommentContent, setNewCommentContent] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("spam");
  const [isReporting, setIsReporting] = useState(false);
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

    if (props.onLikeChange) {
      props.onLikeChange(!previousIsLiked, previousIsLiked ? previousLikes - 1 : previousLikes + 1);
    }

    const { error } = await toggleLike(id, currentUserId);

    if (error) {
      console.error("Erreur lors de l'action de like:", error);
      setIsLiked(previousIsLiked);
      setCurrentLikes(previousLikes);
      if (props.onLikeChange) {
        props.onLikeChange(previousIsLiked, previousLikes);
      }
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

  const handleReport = async () => {
    if (!currentUserId) return;
    setIsReporting(true);
    const { error } = await reportContent('post', id, reportReason, currentUserId);
    if (error) {
      toast({ title: "Erreur", description: error, variant: "destructive" });
    } else {
      toast({ title: "Signalé", description: "Le contenu a été signalé à l'équipe de modération." });
      setShowReportDialog(false);
    }
    setIsReporting(false);
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
                  <DropdownMenuItem onSelect={() => setShowReportDialog(true)}>
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

        {/* Post Media */}
        <MediaGallery media={media} />

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
            className={`flex-1 h-8 text-xs rounded-full transition-all ${isLiked
              ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
              : "text-muted-foreground hover:bg-muted/20"}`}
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
                className="flex-1 h-8 text-xs rounded-full text-muted-foreground hover:bg-muted/20 transition-all"
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
                        <div className="flex-1 bg-muted/30 p-3 rounded-2xl rounded-tl-none hover:bg-muted/50 transition-colors min-w-0">
                          <div className="flex flex-col mb-1">
                            <Link href={`/profile/${comment.auteur?.username || '#'}`} className="font-semibold text-sm hover:underline truncate block w-full">
                              {comment.auteur?.full_name || "Utilisateur inconnu"}
                            </Link>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
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
          <CustomBottomSheet>
            <CustomBottomSheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs rounded-full text-muted-foreground hover:bg-muted/20 transition-all">
                <Share2 size={16} className="mr-1.5" />
                <span>Partager</span>
              </Button>
            </CustomBottomSheetTrigger>
            <CustomBottomSheetContent className="h-auto max-h-[50vh]">
              <CustomBottomSheetHeader>
                <CustomBottomSheetTitle>Partager</CustomBottomSheetTitle>
                <CustomBottomSheetDescription>
                  Partager ce post avec votre réseau
                </CustomBottomSheetDescription>
              </CustomBottomSheetHeader>
              <div className="p-4 space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-base font-medium"
                  onClick={() => {
                    handleShare();
                    // Close sheet logic if needed, but CustomBottomSheet might handle it or we need a ref/state
                  }}
                  disabled={!currentUserId}
                >
                  <Share2 className="mr-3 h-5 w-5" />
                  Republier sur EduSky
                </Button>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  {/* Native Share / More */}
                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/post/${id}`;
                      const shareText = `Découvrez ce post de ${author} sur EduSky`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'EduSky',
                          text: shareText,
                          url: shareUrl
                        }).catch(console.error);
                      } else {
                        // Fallback to clipboard if native share fails silently or just as a "More" option behavior
                        navigator.clipboard.writeText(shareUrl);
                        toast({ title: "Lien copié", description: "Le lien a été copié dans le presse-papiers." });
                      }
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                      <MoreHorizontal className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-center">Plus</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Découvrez ce post de ${author} sur EduSky: ${window.location.origin}/post/${id}`)}`, '_blank')}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/20 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    </div>
                    <span className="text-xs text-center">WhatsApp</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/post/${id}`)}`, '_blank')}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2]/20 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.059v.913h3.945l-1.01 3.667h-2.935v7.98H9.101z" /></svg>
                    </div>
                    <span className="text-xs text-center">Facebook</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(`Post de ${author} sur EduSky`)}&body=${encodeURIComponent(`Découvrez ce post : ${window.location.origin}/post/${id}`)}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center hover:bg-orange-500/20 transition-colors">
                      <Send className="w-5 h-5 ml-0.5" />
                    </div>
                    <span className="text-xs text-center">Email</span>
                  </button>
                </div>
              </div>
            </CustomBottomSheetContent>
          </CustomBottomSheet>
        </div>
      </CardContent>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaler ce contenu</DialogTitle>
            <DialogDescription>
              Aidez-nous à comprendre le problème.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup value={reportReason} onValueChange={setReportReason}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="spam" id="r-spam" />
                <Label htmlFor="r-spam">Spam ou contenu indésirable</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="inappropriate" id="r-inappropriate" />
                <Label htmlFor="r-inappropriate">Contenu inapproprié ou offensant</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="harassment" id="r-harassment" />
                <Label htmlFor="r-harassment">Harcèlement ou intimidation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="misinformation" id="r-misinformation" />
                <Label htmlFor="r-misinformation">Fausse information</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>Annuler</Button>
            <Button onClick={handleReport} disabled={isReporting}>
              {isReporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
