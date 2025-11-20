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
import { createFormationInscription } from '@/app/formations/actions'

// Schéma de validation avec Zod, basé sur la table
const formSchema = z.object({
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  telephone: z.string().min(8, { message: "Le numéro de téléphone semble incorrect." }),
  message: z.string().optional(),
})

interface InscriptionModalProps {
  formationId: string
  formationTitle: string
  buttonClass?: string
  buttonText?: string
}

export function InscriptionModal({ formationId, formationTitle, buttonClass, buttonText }: InscriptionModalProps) {
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
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    const result = await createFormationInscription({
      ...values,
      formation_id: formationId,
    })
    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Inscription réussie !",
        description: "Votre demande a bien été prise en compte.",
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>S'inscrire à la formation</DialogTitle>
          <DialogDescription>
            {formationTitle}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
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
                    <FormLabel>Nom</FormLabel>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="+224 6..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Avez-vous une question ou un message à nous laisser ?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
