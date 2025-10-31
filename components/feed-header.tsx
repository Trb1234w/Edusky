'use client'

import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MessageSquare, Plus, Search } from 'lucide-react'

interface FeedHeaderProps {
  avatarUrl: string | null;
  userName: string;
}

export function FeedHeader({ avatarUrl, userName }: FeedHeaderProps) {
  return (
    <div className="w-full bg-card border-b border-border p-4 mb-6 rounded-lg">
      <div className="flex items-center gap-4">
        {/* Avatar Utilisateur */}
        <Link href="/dashboard">
          <Avatar className="cursor-pointer">
            <AvatarImage src={avatarUrl || undefined} alt={userName} />
            <AvatarFallback>{userName ? userName[0].toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
        </Link>

        {/* Barre de recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher sur EduSky..."
            className="pl-10 w-full"
          />
        </div>

        {/* Icônes d'action */}
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </Button>
          </Link>
          <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
