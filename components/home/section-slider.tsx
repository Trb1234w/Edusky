'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionSliderProps {
    title: string;
    href?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function SectionSlider({ title, href, icon, children, className }: SectionSliderProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <section className={cn("", className)}>
            <div className="container px-4 md:px-8 mb-2 md:mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                        {title}
                    </h2>
                </div>
                {href && (
                    <Link
                        href={href}
                        className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        All
                        <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>

            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 px-4 md:px-8 pb-4 -mx-4 md:mx-0 scrollbar-hide"
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
