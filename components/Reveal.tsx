"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/** Adds `is-in` once the element enters the viewport. One observer per element. */
function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          if (once) io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return ref;
}

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  style?: CSSProperties;
};

export function Reveal({ children, as: Tag = "div", className = "", delay = 0, style }: Props) {
  const ref = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Image wrapper that settles in from a slight scale. */
export function MediaIn({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`media-in overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/** Heading whose lines slide up from behind a mask, staggered. */
export function Lines({
  lines,
  as: Tag = "h1",
  className = "",
  delay = 0,
  step = 0.08,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  step?: number;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <LineMask key={i} delay={delay + i * step}>
          {line}
        </LineMask>
      ))}
    </Tag>
  );
}

function LineMask({ children, delay }: { children: ReactNode; delay: number }) {
  const ref = useInView<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className="line-mask"
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      <span>{children}</span>
    </span>
  );
}
