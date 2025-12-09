'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReservationForm } from "@/components/professeurs/reservation-form";

export function ReservationDialog({ professeurId, professeurName }: { professeurId: string, professeurName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-lg py-6 rounded-xl font-bold">
          Réserver un cours
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Réserver un cours avec {professeurName}</DialogTitle>
          <DialogDescription>
            Veuillez sélectionner une date et une heure pour votre cours.
          </DialogDescription>
        </DialogHeader>
        <ReservationForm professeurId={professeurId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
