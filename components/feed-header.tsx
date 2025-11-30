'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchClick = () => {
    router.push('/search')
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="w-full bg-card border-b border-border p-4 mb-6 rounded-lg">
      <div className="flex items-center gap-4">
        {/* Avatar Utilisateur */}
        <Link href="/dashboard">
          <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            <AvatarImage src={avatarUrl || undefined} alt={userName} />
            <AvatarFallback>{userName ? userName[0].toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
        </Link>

        {/* Barre de recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onClick={handleSearchClick}
            placeholder="Rechercher sur EduSky..."
            className="pl-10 w-full cursor-pointer hover:border-primary/50 transition-colors"
          />
        </div>

        {/* Icônes d'action */}
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </Button>
          </Link>
          <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
