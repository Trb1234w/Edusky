"use client"

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animationClass?: string; // e.g., 'animate-fade-in-up'
  threshold?: number; // 0 to 1, percentage of element visibility to trigger
  delay?: string; // e.g., 'delay-100', 'delay-200' for TailwindCSS delay utilities
  duration?: string; // e.g., 'duration-500', 'duration-1000' for TailwindCSS duration utilities
}

export function AnimateOnScroll({
  children,
  animationClass = 'animate-fade-in-up', // Default to existing fade-in-up
  threshold = 0.1, // 10% visible to trigger
  delay,
  duration,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optionally, unobserve after it becomes visible to only animate once
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all',
        !isVisible && 'opacity-0',
        isVisible && animationClass,
        delay,
        duration
      )}
    >
      {children}
    </div>
  );
}
