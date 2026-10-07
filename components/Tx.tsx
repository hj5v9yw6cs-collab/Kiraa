import { Fragment } from "react";

/**
 * Renders a content string. Anything [in square brackets] becomes a visible
 * dashed placeholder, so an unfinished field can never read as finished copy.
 */
export function Tx({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g);
  if (parts.length === 1) return <>{children}</>;
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span key={i} className="ph" title="Placeholder — fill in content/*.json">
            {part.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export const isPlaceholder = (s: string) => /\[[^\]]+\]/.test(s);
