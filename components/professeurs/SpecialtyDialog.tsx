"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Award } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpecialtyDialogProps {
    specialties: string[];
    selectedSpecialty: string | undefined;
    onSelect: (specialty: string | undefined) => void;
    trigger: React.ReactNode;
}

export function SpecialtyDialog({
    specialties,
    selectedSpecialty,
    onSelect,
    trigger,
}: SpecialtyDialogProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelect = (specialty: string | undefined) => {
        onSelect(specialty);
        setOpen(false);
    };

    const filteredSpecialties = specialties.filter(spec =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="w-[90%] max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Toutes les spécialités</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Rechercher une spécialité..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Reset button */}
                    <Button
                        variant={!selectedSpecialty ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleSelect(undefined)}
                    >
                        Toutes les spécialités
                    </Button>

                    {/* Specialties list */}
                    <ScrollArea className="h-[400px] pr-4">
                        <div className="grid grid-cols-2 gap-2">
                            {filteredSpecialties.map(spec => (
                                <Button
                                    key={spec}
                                    variant={selectedSpecialty === spec ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => handleSelect(spec)}
                                >
                                    <Award className="mr-2 h-4 w-4" />
                                    <span className="truncate">{spec}</span>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
