import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SocialHeaderProps {
  className?: string;
}

export function SocialHeader({ className }: SocialHeaderProps) {
  return (
    <header
      className={cn(
        "hidden md:block w-full bg-background border-b",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500" />
          <h1 className="text-xl font-semibold text-foreground">
            Edusky
          </h1>
        </div>
        <div className="md:hidden flex items-center">
           <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Rechercher</span>
          </Button>
        </div>
      </div>
    </header>
  );
}