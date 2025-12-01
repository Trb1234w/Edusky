'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MessageSquare, Plus, Search, ArrowRight } from 'lucide-react'

interface FeedHeaderProps {
  avatarUrl: string | null;
  userName: string;
}

export function FeedHeader({ avatarUrl, userName }: FeedHeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/search')
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="w-full bg-card border-b border-border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Avatar Utilisateur */}
        <Link href="/dashboard">
          <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            <AvatarImage src={avatarUrl || undefined} alt={userName} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
              {userName ? userName[0].toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Barre de recherche avec bouton */}
        <div className="relative flex-1 group">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${isFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Rechercher des postes, personnes, formations..."
            className={`pl-10 pr-12 w-full transition-all duration-200 ${isFocused
              ? 'border-primary shadow-sm ring-1 ring-primary/20'
              : 'hover:border-primary/50'
              }`}
          />
          <Button
            onClick={handleSearch}
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Icônes d'action */}
        <div className="flex items-center gap-2">
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="hover:bg-accent transition-colors">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
          <Button
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
