'use client'

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Edit, LogOut, Loader2 } from "lucide-react";
import { EditProfileDialog } from "./edit-profile-dialog";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DashboardHeaderProps = {
    profile: {
        id: string;
        full_name: string | null;
        username: string | null;
        avatar_url: string | null;
        bio: string | null;
        telephone: string | null;
    };
    postsCount: number;
    followersCount: number;
    followingCount: number;
};

export function DashboardHeader({ profile, postsCount, followersCount, followingCount }: DashboardHeaderProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.push('/');
            router.refresh();
            toast.success("Déconnexion réussie");
        } catch (error: any) {
            toast.error("Erreur de déconnexion", {
                description: error.message
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

    const StatItem = ({ count, label }: { count: number; label: string }) => (
        <div className="text-left">
            <span className="font-bold text-base md:text-lg">{count}</span>
            <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
        </div>
    );

    return (
        <>
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
                                <Button onClick={() => setIsEditDialogOpen(true)} variant="secondary">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier le profil
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Déconnexion
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Vous allez être déconnecté de votre session EduSky.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleLogout}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                {isLoggingOut ? <Loader2 className="animate-spin" /> : "Se déconnecter"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <div className="flex items-center justify-center">
                                    <NotificationsDropdown />
                                </div>
                            </div>
                        </div>

                        {/* Mobile: Username & Logout */}
                        <div className="md:hidden flex items-center justify-between w-full">
                            <h1 className="text-base font-semibold">@{profile.username}</h1>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive p-0 h-auto">
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="w-[90%] rounded-xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Déconnexion</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Voulez-vous vraiment vous déconnecter ?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex-row gap-2">
                                        <AlertDialogCancel className="flex-1 mt-0">Non</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleLogout}
                                            className="flex-1 bg-destructive"
                                        >
                                            {isLoggingOut ? <Loader2 className="animate-spin" /> : "Oui"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        {/* Stats - Horizontal on mobile, same on desktop */}
                        <div className="flex items-center gap-4 md:gap-6">
                            <StatItem count={postsCount} label="publications" />
                            <StatItem count={followersCount} label="abonnés" />
                            <StatItem count={followingCount} label="abonnements" />
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
                    <Button onClick={() => setIsEditDialogOpen(true)} className="flex-1" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier le profil
                    </Button>
                    <div className="flex items-center justify-center w-9 h-9">
                        <NotificationsDropdown />
                    </div>
                </div>
            </div>

            <EditProfileDialog
                profile={profile}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />
        </>
    );
}
