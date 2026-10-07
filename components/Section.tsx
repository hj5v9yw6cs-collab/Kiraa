import Link from "next/link";
import type { ReactNode } from "react";

/** Numbered section label in the left column, content on the right — the site's one layout. */
export function Section({
  num,
  label,
  children,
  className = "",
  id,
  contentClass = "",
}: {
  num?: string;
  label: string;
  children: ReactNode;
  className?: string;
  id?: string;
  contentClass?: string;
}) {
  return (
    <section id={id} className={`rule ${className}`}>
      <div className="shell grid-12 gap-y-8 py-16 md:py-24">
        <h2 className="col-span-4 md:col-span-3">
          <span className="meta-label">
            {num && <span className="mr-3 opacity-70">{num}</span>}
            <span className="!text-ink">{label}</span>
          </span>
        </h2>
        <div className={`col-span-4 md:col-span-9 ${contentClass}`}>{children}</div>
      </div>
    </section>
  );
}

export function ArrowLink({
  href,
  children,
  back,
  className = "",
}: {
  href: string;
  children: ReactNode;
  back?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`meta-label link-arrow hover:!text-ink ${className}`}>
      {back && <span className="arrow">←</span>}
      {children}
      {!back && <span className="arrow">→</span>}
    </Link>
  );
}
