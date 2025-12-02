"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SpecialtyButton } from "./SpecialtyButton";
import { SpecialtyDialog } from "./SpecialtyDialog";
import { ListFilter } from "lucide-react";

interface HorizontalSpecialtyNavProps {
    specialties: string[];
    selectedSpecialty: string | undefined;
    onSelect: (specialty: string | undefined) => void;
}

export function HorizontalSpecialtyNav({ specialties, selectedSpecialty, onSelect }: HorizontalSpecialtyNavProps) {
    return (
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2 px-0 py-2 min-w-max">
                {/* Dialog for all specialties - always show */}
                <SpecialtyDialog
                    specialties={specialties}
                    selectedSpecialty={selectedSpecialty}
                    onSelect={onSelect}
                    trigger={
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full whitespace-nowrap border-dashed"
                        >
                            <ListFilter className="mr-1.5 h-4 w-4" />
                            Toutes ({specialties.length})
                        </Button>
                    }
                />

                <Button
                    variant={!selectedSpecialty ? "default" : "outline"}
                    size="sm"
                    className="rounded-full whitespace-nowrap transition-all"
                    onClick={() => onSelect(undefined)}
                >
                    Toutes
                </Button>

                {specialties.map(spec => (
                    <SpecialtyButton
                        key={spec}
                        specialty={spec}
                        isSelected={selectedSpecialty === spec}
                        onClick={() => onSelect(spec)}
                    />
                ))}
            </div>
        </div>
    );
}
