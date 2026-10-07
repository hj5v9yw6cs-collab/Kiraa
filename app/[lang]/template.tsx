import type { ReactNode } from "react";

/** Route enter transition: every navigation fades the page in. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>;
}
