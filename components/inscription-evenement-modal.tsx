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
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { createEvenementInscription } from '@/app/evenements/actions'

const formSchema = z.object({
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  telephone: z.string().min(8, { message: "Le numéro de téléphone semble incorrect." }),
  whatsapp: z.string().min(8, { message: "Le numéro WhatsApp semble incorrect." }),
  age: z.coerce.number().min(5, { message: "Vous devez avoir au moins 5 ans." }).max(120),
  motivation_participation: z.string().optional(),
  attentes_evenement: z.string().optional(),
  comment_connu: z.string().optional(),
  besoins_specifiques: z.string().optional(),
  accompagnants: z.coerce.number().min(0).max(10).optional(),
  message: z.string().optional(),
})

interface InscriptionEvenementModalProps {
  evenementId: string
  evenementTitle: string
  buttonClass?: string
  buttonText?: string
}

export function InscriptionEvenementModal({ evenementId, evenementTitle, buttonClass, buttonText }: InscriptionEvenementModalProps) {
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
      motivation_participation: "",
      attentes_evenement: "",
      comment_connu: "",
      besoins_specifiques: "",
      accompagnants: 0,
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const result = await createEvenementInscription({
      ...values,
      evenement_id: evenementId,
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
        <Button size="lg" className={buttonClass || "w-full font-bold text-lg py-6 rounded-xl"}>
          {buttonText || "S'inscrire"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>S'inscrire à l'événement</DialogTitle>
          <DialogDescription>
            {evenementTitle}
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

            {/* Champs optionnels */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">Informations complémentaires (optionnel)</p>



              <FormField
                control={form.control}
                name="motivation_participation"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Motivation / Attentes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Qu'attendez-vous de cet événement ?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="besoins_specifiques"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Besoins spécifiques</FormLabel>
                    <FormControl>
                      <Input placeholder="Accessibilité, allergies..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accompagnants"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Accompagnants</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
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
                    <FormLabel>Comment avez-vous connu cet événement ?</FormLabel>
                    <FormControl>
                      <Input placeholder="Réseaux sociaux, bouche à oreille..." {...field} />
                    </FormControl>
                    <FormMessage />
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
                        placeholder="Avez-vous une question ?"
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
              Confirmer l'inscription
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
