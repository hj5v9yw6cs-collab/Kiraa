"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Row = {
  href: string;
  num: string;
  title: string;
  category: string;
  year?: string;
  cover?: { src: string; width: number; height: number };
};

/** The "Also" list. On fine pointers, a cover follows the cursor over each row. */
export function CompactList({ rows }: { rows: Row[] }) {
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx + 24}px, ${cy - 120}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const current = active !== null ? rows[active] : null;

  return (
    <>
      <ul className="border-b border-rule" onPointerLeave={() => setActive(null)}>
        {rows.map((row, i) => (
          <li key={row.href} className="border-t border-rule">
            <Link
              href={row.href}
              onPointerEnter={() => setActive(i)}
              className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-[3rem_1fr_auto] md:py-8"
            >
              <span className="meta">{row.num}</span>
              <span className="t-lg transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                {row.title}
              </span>
              <span className="meta col-start-2 md:col-start-3">
                {row.category}
                {row.year ? ` · ${row.year}` : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={preview} aria-hidden className={`hover-preview ${current?.cover ? "is-on" : ""}`}>
        {rows.map((row, i) =>
          row.cover ? (
            <Image
              key={row.href}
              src={row.cover.src}
              alt=""
              width={row.cover.width}
              height={row.cover.height}
              sizes="240px"
              className={`absolute top-0 left-0 h-auto w-[240px] transition-opacity duration-300 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null,
        )}
      </div>
    </>
  );
}
