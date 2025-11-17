'use client'

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface UserListProps {
  users: UserProfile[];
  emptyMessage: string;
}

export function UserList({ users, emptyMessage }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {users.map((user) => (
        <Link key={user.id} href={`/profile/${user.username}`} className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || user.username} />
            <AvatarFallback>{user.full_name?.[0] || user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{user.full_name || user.username}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
