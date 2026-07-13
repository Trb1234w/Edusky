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
                        {/* Action Row (Desktop only) */}
                        <div className="hidden md:flex items-center gap-4">
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
                            </div>
                        </div>

                        {/* Mobile: Name & Actions */}
                        <div className="md:hidden flex flex-col w-full gap-3">
                            <h1 className="text-base font-semibold">{profile.full_name}</h1>
                            <div className="flex flex-col gap-2 w-full">
                                <Button onClick={() => setIsEditDialogOpen(true)} className="w-full" size="sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier le profil
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Déconnexion
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
                        </div>

                        {/* Desktop: Name */}
                        <div className="hidden md:block">
                            <p className="font-semibold text-xl">{profile.full_name}</p>
                        </div>
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
