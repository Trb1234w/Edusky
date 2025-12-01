import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

interface SpecialtyButtonProps {
    specialty: string;
    isSelected: boolean;
    onClick: () => void;
}

export function SpecialtyButton({ specialty, isSelected, onClick }: SpecialtyButtonProps) {
    return (
        <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
                "rounded-full whitespace-nowrap transition-all",
                isSelected ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
            )}
            onClick={onClick}
        >
            <Award className="mr-1.5 h-4 w-4" />
            {specialty}
        </Button>
    );
}
