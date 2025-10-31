import { useState, useTransition, useRef } from "react";
import { createPostAction } from "@/app/actions";
import { createClient } from "@/lib/supabase/client"; // Import du client Supabase
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Loader2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface CreatePostProps {
  profile: {
    id: string;
    avatar_url?: string | null;
    full_name?: string | null;
    prenom?: string | null;
    nom?: string | null;
  };
}

export function CreatePost({ profile }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handlePost = async () => {
    if (!content.trim() && !file) return;

    startTransition(async () => {
      let imageUrl: string | undefined = undefined;

      // Étape 1: Uploader l'image si elle existe
      if (file) {
        const supabase = createClient();
        const filePath = `posts/${profile.id}/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts-media') // ASSUMPTION: Le bucket 'posts-media' existe et est public.
          .upload(filePath, file);

        if (uploadError) {
          toast.error("Erreur lors de l'upload de l'image: " + uploadError.message);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('posts-media')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // Étape 2: Appeler la Server Action avec l'URL de l'image (si elle existe)
      const result = await createPostAction(content, profile.id, imageUrl);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Votre publication a été créée avec succès.");
        // Reset state
        setContent("");
        removeImage();
        setIsOpen(false);
      }
    });
  };

  const userInitial = (profile.prenom?.charAt(0) || '') + (profile.nom?.charAt(0) || '') || 'U';

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <button 
            onClick={() => setIsOpen(true)} 
            className="flex-1 text-left bg-muted hover:bg-muted/80 transition-colors rounded-full px-4 py-3 text-muted-foreground"
          >
            Commencer un post...
          </button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer une publication</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{profile.full_name || 'Utilisateur'}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full w-fit">
                  <Globe size={12} />
                  <span>Public</span>
                </div>
              </div>
            </div>

            <Textarea 
              placeholder={`Quoi de neuf, ${profile.prenom || ''} ?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] text-base border-none focus-visible:ring-0 p-0 shadow-none"
              autoFocus
            />

            {previewUrl && (
              <div className="relative">
                <Image src={previewUrl} alt="Aperçu" width={500} height={300} className="rounded-lg object-cover w-full" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-gray-900/50 text-white rounded-full p-1.5 hover:bg-gray-900/80 transition-colors">
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center">
            <div className="flex gap-2 items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" />
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <ImageIcon className="text-green-500" />
                    </label>
                </Button>
            </div>
            <Button 
              onClick={handlePost} 
              disabled={(!content.trim() && !file) || isPending}
              className="w-full sm:w-auto"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              {isPending ? 'Publication...' : 'Publier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
