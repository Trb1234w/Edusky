'use client'

import { useState, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus, Loader2 } from "lucide-react";
import { followUserAction } from '@/app/users/actions';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

// Type definition for the profile for clarity
type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  postsCount: number; // Assuming posts count is available
};

interface ProfileHeaderProps {
  profile: Profile;
  currentUserId: string;
}

export function ProfileHeader({ profile, currentUserId }: ProfileHeaderProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [creatingConversation, setCreatingConversation] = useState(false);

  // Local state for optimistic updates
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing);
  const [followersCount, setFollowersCount] = useState(profile.followersCount);

  const handleFollowClick = () => {
    if (!currentUserId) {
      toast({ title: "Action requise", description: "Vous devez être connecté pour suivre un utilisateur.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      const previousState = { isFollowing, followersCount };
      setIsFollowing(!isFollowing);
      setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);

      const { error } = await followUserAction(currentUserId, profile.id);

      if (error) {
        setIsFollowing(previousState.isFollowing);
        setFollowersCount(previousState.followersCount);
        toast({ title: "Erreur", description: error, variant: "destructive" });
      }
    });
  };



  const StatItem = ({ count, label }: { count: number; label: string }) => (
    <div className="text-left">
      <span className="font-bold text-base md:text-lg">{count}</span>
      <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
    </div>
  );

  return (
    <div className="px-4 pt-0 mb-4 md:pt-4 md:mb-12">
      <div className="flex flex-row md:flex-row items-start md:items-center gap-4 md:gap-8">
        {/* Avatar - Always on the left */}
        <Avatar className="w-20 h-20 md:w-32 md:h-32 border-2 md:border-4 border-background flex-shrink-0">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'Avatar'} />
          <AvatarFallback className="text-2xl md:text-4xl">{profile.full_name?.[0]}</AvatarFallback>
        </Avatar>

        {/* Profile Info - Always on the right */}
        <div className="flex-grow flex flex-col gap-2 md:gap-4 w-full md:w-auto md:items-start">
          {/* Username & Actions Row (Desktop only) */}
          <div className="hidden md:flex items-center gap-4">
            <h1 className="text-2xl font-light text-foreground">@{profile.username}</h1>
            <div className="flex items-center gap-2">
              <Button onClick={handleFollowClick} disabled={isPending} className="min-w-[120px]">
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Abonné
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Suivre
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile: Username */}
          <div className="md:hidden">
            <h1 className="text-base font-semibold">@{profile.username}</h1>
          </div>

          {/* Stats - Horizontal on mobile, same on desktop */}
          <div className="flex items-center gap-4 md:gap-6">
            <StatItem count={profile.postsCount || 0} label="publications" />
            <StatItem count={followersCount} label="abonnés" />
            <StatItem count={profile.followingCount} label="abonnements" />
          </div>

          {/* Desktop: Name & Bio */}
          <div className="hidden md:block">
            <p className="font-semibold">{profile.full_name}</p>
            {profile.bio && <p className="text-foreground/90">{profile.bio}</p>}
          </div>
        </div>
      </div>

      {/* Mobile: Name & Bio below */}
      <div className="md:hidden mt-2">
        <p className="font-semibold text-sm">{profile.full_name}</p>
        {profile.bio && <p className="text-sm text-foreground/90 mt-1">{profile.bio}</p>}
      </div>

      {/* Mobile: Actions below */}
      <div className="flex md:hidden items-center gap-2 mt-3">
        <Button onClick={handleFollowClick} disabled={isPending} className="flex-1" size="sm">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isFollowing ? (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Abonné
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Suivre
            </>
          )}
        </Button>
      </div>
    </div>
  );
}