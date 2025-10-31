"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileFeedHeaderProps {
  // No specific props needed for now, but can be extended
}

export function MobileFeedHeader({}) {
  const router = useRouter()

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-2">
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9">
          <AvatarImage src="/african-male-professor.png" alt="User" /> {/* Placeholder for current user avatar */}
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Rechercher sur EduSky"
            className="pl-10 h-9 rounded-full border-border/50 focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <MessageSquare size={20} />
        </Button>
      </div>
    </div>
  )
}
