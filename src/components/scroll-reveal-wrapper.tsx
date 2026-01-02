'use client';
import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function ScrollRevealWrapper({ children, className, id }: ScrollRevealWrapperProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.remove('opacity-0', 'translate-y-10');
          element.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );
    
    element.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
