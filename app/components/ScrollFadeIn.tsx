"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollFadeInProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export default function ScrollFadeIn({
  children,
  className = "",
  delayMs = 0,
}: ScrollFadeInProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delayMs > 0) {
              setTimeout(() => setVisible(true), delayMs);
            } else {
              setVisible(true);
            }
          } else {
            setVisible(false);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`${
        visible ? "fade-in-visible" : "fade-in-initial"
      } ${className}`}
    >
      {children}
    </div>
  );
}

