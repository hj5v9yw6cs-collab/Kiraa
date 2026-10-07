/**
 * Every user-facing string is a pair. `ru` may be left out: the site falls
 * back to `en`, so a missing translation never renders as a blank.
 * Anything written [in square brackets] renders as a visible placeholder.
 */
export type L = { ru?: string; en: string };

export type Img = {
  src: string;
  width: number;
  height: number;
  alt: L;
};

export type MediaItem = Img & {
  kind: "image";
  caption?: L;
  /** Opens the case (and the hero card) in the three-up row. */
  lead?: boolean;
  /** Columns out of 12 in the case gallery. Default 12. */
  span?: 4 | 5 | 6 | 7 | 8 | 12;
  /** Column to start at, for offset layouts. */
  start?: number;
};

export type Figure = { value: string; label: L };

export type ProjectFile = {
  label: L;
  src: string;
  format: string;
  preview?: string;
  /** false: download only, never open in a tab. */
  inline?: boolean;
  /** Filled in from disk at build time. */
  size?: number;
};

export type Block =
  | { type: "text"; label: L; body: L[] }
  | { type: "list"; label: L; items: L[] }
  | { type: "steps"; label: L; items: { title: L; body: L }[] }
  | { type: "quote"; label: L; text: L; source?: L };

export type Project = {
  slug: string;
  index: number;
  draft?: boolean;
  /** hero: full-bleed slab · standard: alternating column · compact: a row in "Also". */
  scale: "hero" | "standard" | "compact";
  title: L;
  category: L;
  year?: string;
  summary: L;
  lede?: L;
  tags: L[];
  meta: { label: L; value: L }[];
  /** kind "none" renders a typographic panel instead of a picture. */
  cover: ({ kind: "image" } & Img) | { kind: "none" };
  media: MediaItem[];
  figures?: Figure[];
  blocks?: Block[];
  files?: ProjectFile[];
};

export type Profile = {
  name: L;
  role: L;
  city: L;
  status: { open: boolean; label: L };
  tagline: L;
  heroPhoto: Img;
  about: {
    paragraphs: L[];
    quote: L;
    portrait: Img & { caption: L };
    strip: Img[];
  };
  facts: { label: L; value: L }[];
  skills: { title: L; items: L[] }[];
  contacts: {
    telegram?: string;
    email?: string;
    instagram?: string;
    /** E.164, e.g. +79991234567 */
    phone?: string;
  };
  portfolioPdf?: { src: string; label: L; size?: number };
};

export type Modeling = {
  intro: L;
  facts: { label: L; value: L }[];
  photos: MediaItem[];
};

export type NavItem = { key: "about" | "work" | "model" | "contact"; href: string; label: L };

export type Site = {
  title: L;
  description: L;
  nav: NavItem[];
  contactIntro: L;
};
