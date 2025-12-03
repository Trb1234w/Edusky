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
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const videoFile = newFiles.find(file => file.type.startsWith('video/'));

    if (videoFile) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          toast.error("La vidéo ne doit pas dépasser 1 minute.");
        } else {
          setFiles(prevFiles => [...prevFiles, videoFile]);
          setPreviewUrls(prevUrls => [...prevUrls, URL.createObjectURL(videoFile)]);
        }
      };
      video.src = URL.createObjectURL(videoFile);
    }

    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prevFiles => [...prevFiles, ...imageFiles]);
    setPreviewUrls(prevUrls => [...prevUrls, ...imageFiles.map(file => URL.createObjectURL(file))]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handlePost = async () => {
    if (!content.trim() && files.length === 0) return;

    startTransition(async () => {
      const supabase = createClient();
      const imageUrls: string[] = [];
      let videoUrl: string | undefined = undefined;

      // Étape 1: Uploader les fichiers
      for (const file of files) {
        const filePath = `posts/${profile.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('posts-media')
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Erreur d'upload: ${uploadError.message}`);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('posts-media')
          .getPublicUrl(filePath);
        
        if (file.type.startsWith('image/')) {
          imageUrls.push(publicUrl);
        } else if (file.type.startsWith('video/')) {
          videoUrl = publicUrl;
        }
      }

      const media = {
        images: imageUrls,
        video: videoUrl,
      };

      // Étape 2: Appeler la Server Action
      const result = await createPostAction(content, profile.id, media);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Publication créée !");
        setContent("");
        setFiles([]);
        setPreviewUrls([]);
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

            <div className="grid grid-cols-2 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  {files[index].type.startsWith('image/') ? (
                    <Image src={url} alt={`Aperçu ${index}`} width={250} height={150} className="rounded-lg object-cover w-full" />
                  ) : (
                    <video src={url} controls className="rounded-lg object-cover w-full" />
                  )}
                  <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-gray-900/50 text-white rounded-full p-1 hover:bg-gray-900/80 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center">
            <div className="flex gap-2 items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/mp4,video/quicktime" className="hidden" id="file-upload" multiple />
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <ImageIcon className="text-green-500" />
                    </label>
                </Button>
            </div>
            <Button 
              onClick={handlePost} 
              disabled={(!content.trim() && files.length === 0) || isPending}
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
