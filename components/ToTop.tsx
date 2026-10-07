"use client";

import { scrollToTop } from "./SmoothScroll";

export function ToTop({ label }: { label: string }) {
  return (
    <button type="button" onClick={scrollToTop} className="meta-label hover:!text-ink">
      {label} ↑
    </button>
  );
}
