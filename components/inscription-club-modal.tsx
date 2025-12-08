'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { createClubInscription } from '@/app/clubs/actions'

const formSchema = z.object({
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  telephone: z.string().min(8, { message: "Le numéro de téléphone semble incorrect." }),
  whatsapp: z.string().min(8, { message: "Le numéro WhatsApp semble incorrect." }),
  age: z.coerce.number().min(5, { message: "Vous devez avoir au moins 5 ans." }).max(120),
  niveau_experience: z.enum(['debutant', 'intermediaire', 'avance', 'expert'], {
    required_error: "Veuillez sélectionner votre niveau d'expérience.",
  }),
  motivation_adhesion: z.string().min(20, { message: "Veuillez décrire votre motivation (minimum 20 caractères)." }),
  accepte_reglement: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter le règlement intérieur pour rejoindre le club.",
  }),
  profession: z.string().optional(),
  comment_connu: z.string().optional(),
  parraine_par: z.string().optional(),
  accepte_communication: z.boolean().optional(),
  message: z.string().optional(),
})

interface InscriptionClubModalProps {
  clubId: string
  clubName: string
  buttonClass?: string
  buttonText?: string
}

export function InscriptionClubModal({ clubId, clubName, buttonClass, buttonText }: InscriptionClubModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      whatsapp: "",
      age: "" as any,
      niveau_experience: undefined,
      motivation_adhesion: "",
      accepte_reglement: false,
      profession: "",
      comment_connu: "",
      parraine_par: "",
      accepte_communication: true,
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const result = await createClubInscription({
      ...values,
      club_id: clubId,
    })
    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Inscription réussie !",
        description: "Nous vous recontacterons très prochainement.",
      })
      setIsOpen(false)
      form.reset()
    } else {
      toast({
        title: "Erreur",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className={buttonClass || "w-full text-lg rounded-xl"}>
          {buttonText || "Rejoindre ce club"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rejoindre le club</DialogTitle>
          <DialogDescription>
            {clubName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Informations personnelles */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input placeholder="+224 6..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp *</FormLabel>
                    <FormControl>
                      <Input placeholder="+224 6..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Âge *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="niveau_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau d'expérience *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="debutant">Débutant</SelectItem>
                        <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                        <SelectItem value="avance">Avancé</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivation_adhesion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivation *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Pourquoi souhaitez-vous rejoindre ce club ?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accepte_reglement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      J'accepte le règlement intérieur du club *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Champs optionnels */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">Informations complémentaires (optionnel)</p>

              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre profession" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment_connu"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Comment avez-vous connu ce club ?</FormLabel>
                    <FormControl>
                      <Input placeholder="Réseaux sociaux, bouche à oreille..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parraine_par"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Parrainé par</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du membre parrain" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accepte_communication"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        J'accepte de recevoir des communications du club
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Avez-vous une question ou un message à laisser au club ?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer la demande
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
