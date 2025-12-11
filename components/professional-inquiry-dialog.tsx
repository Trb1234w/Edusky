'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createInquiry } from '@/app/actions/inquiries' // We will create this next
import { toast } from 'sonner'

interface ProfessionalInquiryDialogProps {
  triggerButton: React.ReactNode
  dialogTitle: string
  dialogDescription: string
  inquiryType: 'devenir_expert' | 'formation_entreprise' | 'sponsor_evenement' | 'sponsor_club'
}

export function ProfessionalInquiryDialog({
  triggerButton,
  dialogTitle,
  dialogDescription,
  inquiryType,
}: ProfessionalInquiryDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await createInquiry(formData, inquiryType)
      if (result.success) {
        toast.success('Demande envoyée !', {
          description: 'Merci ! Nous avons bien reçu votre demande et nous vous recontacterons bientôt.',
        })
        setOpen(false) // Close dialog on success
      } else {
        toast.error('Erreur', {
          description: result.error || "Une erreur s'est produite lors de l'envoi de votre demande.",
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom_contact">Nom complet</Label>
                <Input id="nom_contact" name="nom_contact" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone (Optionnel)</Label>
                <Input id="telephone" name="telephone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom_entreprise">Entreprise (Optionnel)</Label>
                <Input id="nom_entreprise" name="nom_entreprise" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Votre message</Label>
              <Textarea id="message" name="message" required rows={5} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
