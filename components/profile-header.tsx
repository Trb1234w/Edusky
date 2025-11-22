'use client'

import { useState, useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, UserCheck, UserPlus, Loader2 } from "lucide-react";
import { followUserAction } from '@/app/users/actions';
import { useToast } from './ui/use-toast';

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
  currentUserId?: string;
}

export function ProfileHeader({ profile, currentUserId }: ProfileHeaderProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

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
    <div className="text-center md:text-left">
      <span className="font-bold text-lg">{count}</span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );

  return (
    <div className="px-4 mb-2 md:mb-8">
      <div className="flex flex-col md:flex-row items-center md:gap-8">
        {/* Profile Picture and Mobile Info (for small screens) */}
        <div className="flex w-full items-center gap-2 md:w-auto md:flex-shrink-0 md:justify-start">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-2 md:border-4 border-background flex-shrink-0">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'Avatar'} />
              <AvatarFallback className="text-4xl">{profile.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="md:hidden flex flex-col">
            <p className="font-semibold text-lg">{profile.full_name}</p>
            <h1 className="text-base text-muted-foreground">@{profile.username}</h1>
          </div>
        </div>

        {/* Profile Info & Actions (Main block, adjusted for mobile) */}
        <div className="flex-grow flex flex-col gap-1 w-full md:w-auto md:items-start"> {/* Decreased gap for mobile */}
            {/* Top Row: Username & Actions (for desktop) */}
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
                    <Button variant="secondary">Message</Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9"><MoreHorizontal className="h-5 w-5" /></Button>
                </div>
            </div>
            
            {/* Mobile: Bio visible below avatar/name block */}
            <div className="md:hidden flex flex-col gap-2 mt-2 text-center">
              {profile.bio && <p className="text-sm text-foreground/90">{profile.bio}</p>}
            </div>

            {/* Stats - Always visible, adjust margin for mobile */}
            <div className="flex items-center justify-center md:justify-start gap-2 w-full mt-2 md:mt-0">
                <StatItem count={profile.postsCount || 0} label="publications" />
                <StatItem count={followersCount} label="abonnés" />
                <StatItem count={profile.followingCount} label="abonnements" />
            </div>

            {/* Mobile Actions - visible only on mobile, placed below stats */}
            <div className="flex md:hidden items-center justify-center gap-2 mt-2 w-full">
                <Button onClick={handleFollowClick} disabled={isPending} className="flex-1">
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
                <Button variant="secondary" className="flex-1">Message</Button>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
            </div>

            {/* Desktop Name & Bio - only visible on desktop */}
            <div className="hidden md:block">
              <p className="font-semibold">{profile.full_name}</p>
              {profile.bio && <p className="text-foreground/90">{profile.bio}</p>}
            </div>

        </div>
      </div>
    </div>
  );
}