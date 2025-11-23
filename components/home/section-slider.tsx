'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionSliderProps {
    title: string;
    href?: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    className?: string;
}

export function SectionSlider({ title, href, icon: Icon, children, className }: SectionSliderProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <section className={cn("py-6 md:py-10", className)}>
            <div className="container px-4 md:px-8 mb-4 md:mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
                    <h2 className="text-lg md:text-2xl font-bold text-foreground tracking-tight">{title}</h2>
                </div>
                {href && (
                    <Link
                        href={href}
                        className="group flex items-center text-xs md:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Voir tout
                        <ChevronRight className="ml-1 w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-6 px-4 md:px-8 pb-4 -mx-4 md:mx-0 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {React.Children.map(children, (child) => (
                    <div className="snap-start shrink-0 first:pl-0 last:pr-4 md:last:pr-8">
                        {child}
                    </div>
                ))}
            </div>
        </section>
    );
}
