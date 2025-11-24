'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlossyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'accent'
    size?: 'sm' | 'md' | 'lg'
    children: ReactNode
    glow?: boolean
}

/**
 * GlossyButton - Bouton moderne avec effet glossy et animations
 * 
 * @param variant - Style du bouton (primary, secondary, outline, accent)
 * @param size - Taille du bouton (sm, md, lg)
 * @param glow - Active l'effet de glow au hover
 * @param children - Contenu du bouton
 */
export function GlossyButton({
    variant = 'primary',
    size = 'md',
    glow = true,
    children,
    className,
    ...props
}: GlossyButtonProps) {

    // Styles de base pour tous les boutons
    const baseStyles = cn(
        // Layout & Typography
        'relative inline-flex items-center justify-center font-semibold',
        'rounded-xl overflow-hidden',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Animations
        'hover:scale-105 active:scale-95',
        'transform-gpu', // Optimisation GPU
    )

    // Tailles
    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    // Variantes de couleur avec effets glossy
    const variantStyles = {
        primary: cn(
            'bg-gradient-to-br from-primary via-primary to-secondary',
            'text-primary-foreground',
            'shadow-lg shadow-primary/30',
            glow && 'hover:shadow-2xl hover:shadow-primary/50',
            // Effet glossy avec overlay
            'before:absolute before:inset-0',
            'before:bg-gradient-to-br before:from-white/20 before:to-transparent',
            'before:opacity-0 hover:before:opacity-100',
            'before:transition-opacity before:duration-300',
        ),
        secondary: cn(
            'bg-gradient-to-br from-secondary via-secondary to-accent',
            'text-secondary-foreground',
            'shadow-lg shadow-secondary/30',
            glow && 'hover:shadow-2xl hover:shadow-secondary/50',
            'before:absolute before:inset-0',
            'before:bg-gradient-to-br before:from-white/20 before:to-transparent',
            'before:opacity-0 hover:before:opacity-100',
            'before:transition-opacity before:duration-300',
        ),
        accent: cn(
            'bg-gradient-to-br from-accent via-accent to-primary',
            'text-accent-foreground',
            'shadow-lg shadow-accent/30',
            glow && 'hover:shadow-2xl hover:shadow-accent/50',
            'before:absolute before:inset-0',
            'before:bg-gradient-to-br before:from-white/20 before:to-transparent',
            'before:opacity-0 hover:before:opacity-100',
            'before:transition-opacity before:duration-300',
        ),
        outline: cn(
            'bg-transparent border-2',
            'border-primary/30 hover:border-primary',
            'text-foreground hover:text-primary',
            'backdrop-blur-sm',
            glow && 'hover:shadow-lg hover:shadow-primary/20',
        ),
    }

    return (
        <button
            className={cn(
                baseStyles,
                sizeStyles[size],
                variantStyles[variant],
                className
            )}
            {...props}
        >
            {/* Contenu du bouton (au-dessus de l'overlay) */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Effet de ripple au clic (optionnel) */}
            <span className="absolute inset-0 overflow-hidden">
                <span className="absolute inset-0 bg-white/10 scale-0 rounded-full transition-transform duration-500 group-active:scale-100" />
            </span>
        </button>
    )
}
