import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
    title: string
    subtitle?: string
    badge?: string
    align?: 'left' | 'center'
    className?: string
}

/**
 * SectionHeader - En-tête de section réutilisable
 * 
 * Assure une typographie cohérente à travers toutes les sections
 */
export function SectionHeader({
    title,
    subtitle,
    badge,
    align = 'left',
    className,
}: SectionHeaderProps) {
    return (
        <div className={cn(
            'mb-12 md:mb-16',
            align === 'center' && 'text-center',
            className
        )}>
            {badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {badge}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {title}
                </span>
            </h2>
            {subtitle && (
                <p className={cn(
                    'text-lg md:text-xl text-muted-foreground leading-relaxed',
                    align === 'center' && 'max-w-2xl mx-auto'
                )}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}
