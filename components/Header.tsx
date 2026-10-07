"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Item = { href: string; label: string; num: string };

export function Header({
  lang,
  name,
  items,
  menuLabel,
  closeLabel,
}: {
  lang: Locale;
  name: string;
  items: Item[];
  menuLabel: string;
  closeLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const otherLang = lang === "ru" ? "en" : "ru";
  const swapped = pathname.replace(/^\/(ru|en)(?=\/|$)/, `/${otherLang}`);

  useEffect(() => setOpen(false), [pathname]);

  // Keys 1–n jump between sections, L swaps the language.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= items.length) router.push(items[n - 1].href);
      else if (e.key.toLowerCase() === "l" || e.key.toLowerCase() === "д") router.push(swapped);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, router, swapped]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="relative z-30">
      <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link href={`/${lang}`} className="meta-label !text-ink">
          {name}
        </Link>

        <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ul className="flex gap-7">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`meta-label group relative inline-flex gap-1.5 py-1 transition-colors hover:!text-ink ${
                    isActive(item.href) ? "!text-ink" : ""
                  }`}
                >
                  <span className={isActive(item.href) ? "text-accent" : ""}>{item.num}</span>
                  <span>{item.label}</span>
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ink transition-transform duration-500 ${
                      isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <Link href={swapped} hrefLang={otherLang} className="meta-label hover:!text-ink">
            {otherLang.toUpperCase()}
          </Link>
          <button
            type="button"
            className="meta-label !text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? closeLabel : menuLabel}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-30 bg-paper md:hidden"
      >
        <nav aria-label="Mobile" className="shell pt-8">
          <ul className="border-t border-rule">
            {items.map((item) => (
              <li key={item.href} className="border-b border-rule">
                <Link href={item.href} className="flex items-baseline gap-4 py-5">
                  <span className="meta">{item.num}</span>
                  <span className="t-lg">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
