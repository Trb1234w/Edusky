'use client'

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { updateProfileAction } from "@/app/dashboard/actions";

type EditProfileDialogProps = {
    profile: {
        id: string;
        full_name: string | null;
        username: string | null;
        avatar_url: string | null;
        bio: string | null;
        telephone: string | null;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditProfileDialog({ profile, open, onOpenChange }: EditProfileDialogProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        telephone: profile.telephone || '',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        startTransition(async () => {
            const formDataToSend = new FormData();

            // On s'assure que les chaînes ne sont pas nulles avant l'envoi
            formDataToSend.append('full_name', formData.full_name || '');
            formDataToSend.append('telephone', formData.telephone || '');

            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile);
            }

            console.log("Submitting profile update...");
            const result = await updateProfileAction(formDataToSend);

            if (result.error) {
                console.error("Profile update error:", result.error);
                toast({
                    title: "Erreur",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Succès",
                    description: "Votre profil a été mis à jour avec succès",
                });
                onOpenChange(false);
                // Refresh to show updated data
                window.location.reload();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier le profil</DialogTitle>
                    <DialogDescription>
                        Mettez à jour vos informations personnelles
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={avatarPreview || undefined} />
                            <AvatarFallback className="text-2xl">{formData.full_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <Label htmlFor="avatar" className="cursor-pointer">
                                <Button type="button" variant="outline" size="sm" asChild>
                                    <span>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Changer la photo
                                    </span>
                                </Button>
                            </Label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Nom complet</Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Votre nom complet"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telephone">Téléphone</Label>
                            <Input
                                id="telephone"
                                value={formData.telephone}
                                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                placeholder="+224 XXX XXX XXX"
                            />
                        </div>
                    </div>



                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
