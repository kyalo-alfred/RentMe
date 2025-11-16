'use client';

import React, { useEffect, useRef, useState } from 'react';

interface InfiniteCarouselProps {
  children: React.ReactNode[];
  itemWidth?: number;
  speed?: number;
  pauseOnHover?: boolean;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  children,
  itemWidth = 300,
  speed = 1,
  pauseOnHover = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [clonedChildren, setClonedChildren] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Create a doubled set of children for infinite scroll effect
    setClonedChildren([...children, ...children]);
  }, [children]);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    
    // Reset scroll position to the middle to start the infinite effect
    container.scrollLeft = content.offsetWidth / 2;

    let animationFrameId: number;
    let isPaused = false;
    
    const scroll = () => {
      if (!isPaused) {
        container.scrollLeft += speed;
        
        // If we've scrolled past the first set, reset to the middle
        if (container.scrollLeft >= content.offsetWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    const handleMouseEnter = () => {
      if (pauseOnHover) isPaused = true;
    };

    const handleMouseLeave = () => {
      if (pauseOnHover) isPaused = false;
    };

    animationFrameId = requestAnimationFrame(scroll);
    
    if (pauseOnHover) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (pauseOnHover) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [speed, pauseOnHover]);

  return (
    <div 
      ref={containerRef}
      className="overflow-hidden w-full"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div 
        ref={contentRef}
        className="flex"
        style={{ 
          width: `${clonedChildren.length * 100}%`,
          minWidth: `${clonedChildren.length * itemWidth}px`
        }}
      >
        {clonedChildren.map((child, index) => (
          <div 
            key={index} 
            className="flex-shrink-0"
            style={{ width: `${100 / clonedChildren.length}%`, minWidth: `${itemWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;