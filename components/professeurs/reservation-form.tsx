'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createReservation } from "@/app/professeurs/[id]/actions";
import {DateTimePicker} from "@/components/ui/datetime-picker";
import { useState } from "react";

const reservationFormSchema = z.object({
  date_heure_debut: z.date({
    required_error: "Une date et une heure de début sont requises.",
  }),
  date_heure_fin: z.date({
    required_error: "Une date et une heure de fin sont requises.",
  }),
  message_utilisateur: z.string().optional(),
});

export function ReservationForm({ professeurId, setOpen }: { professeurId: string, setOpen: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof reservationFormSchema>>({
    resolver: zodResolver(reservationFormSchema),
  });

  async function onSubmit(values: z.infer<typeof reservationFormSchema>) {
    const result = await createReservation(professeurId, values);

    if (result.success) {
      toast.success("Votre demande de réservation a été envoyée. Nous vous contacterons bientôt pour confirmer.");
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date_heure_debut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date et heure de début</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  setDate={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_heure_fin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date et heure de fin</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  setDate={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message_utilisateur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Dites au professeur ce que vous souhaitez apprendre"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Envoyer la demande</Button>
      </form>
    </Form>
  );
}
