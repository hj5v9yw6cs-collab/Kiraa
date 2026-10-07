import Image from "next/image";
import type { Img, MediaItem } from "@/lib/content";
import { t, type Locale } from "@/lib/i18n";
import { MediaIn } from "./Reveal";

export function Picture({
  img,
  lang,
  sizes,
  priority,
  caption,
  className = "",
  fill,
}: {
  img: Img;
  lang: Locale;
  sizes: string;
  priority?: boolean;
  caption?: string;
  className?: string;
  /** Fill a box the parent sizes (object-cover). */
  fill?: boolean;
}) {
  return (
    <figure className={className}>
      <MediaIn className={fill ? "relative h-full w-full" : "bg-paper-deep"}>
        {fill ? (
          <Image
            src={img.src}
            alt={t(img.alt, lang)}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        ) : (
          <Image
            src={img.src}
            alt={t(img.alt, lang)}
            width={img.width}
            height={img.height}
            sizes={sizes}
            priority={priority}
            className="h-auto w-full"
          />
        )}
      </MediaIn>
      {caption && <figcaption className="meta mt-2.5 normal-case tracking-normal">{caption}</figcaption>}
    </figure>
  );
}

/**
 * A row of images at one shared height, each as wide as its aspect ratio
 * needs — nothing is cropped. On small screens it becomes a swipeable strip.
 */
export function JustifiedRow({
  items,
  lang,
  priority,
  captions = true,
}: {
  items: MediaItem[];
  lang: Locale;
  priority?: boolean;
  captions?: boolean;
}) {
  const total = items.reduce((sum, m) => sum + m.width / m.height, 0);
  return (
    <div className="strip-scroll -mx-[var(--gutter)] flex gap-3 overflow-x-auto px-[var(--gutter)] md:mx-0 md:gap-4 md:overflow-visible md:px-0">
      {items.map((m, i) => {
        const ratio = m.width / m.height;
        return (
          <div
            key={m.src + i}
            className="shrink-0 basis-[78%] md:shrink md:basis-0"
            style={{ flexGrow: ratio }}
          >
            <Picture
              img={m}
              lang={lang}
              priority={priority}
              sizes={`(max-width: 768px) 80vw, ${Math.round((ratio / total) * 100)}vw`}
              caption={captions && m.caption ? t(m.caption, lang) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

const spanClass: Record<number, string> = {
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  12: "md:col-span-12",
};
const startClass: Record<number, string> = {
  2: "md:col-start-2",
  3: "md:col-start-3",
  4: "md:col-start-4",
  5: "md:col-start-5",
  6: "md:col-start-6",
  7: "md:col-start-7",
};

/** The case gallery: a 12-column grid, each item spanning what its JSON asks for. */
export function Gallery({ items, lang }: { items: MediaItem[]; lang: Locale }) {
  return (
    <div className="grid-12 items-start gap-y-6 md:gap-y-10">
      {items.map((m, i) => {
        const span = m.span ?? 12;
        return (
          <Picture
            key={m.src + i}
            img={m}
            lang={lang}
            sizes={`(max-width: 768px) 100vw, ${Math.round((span / 12) * 100)}vw`}
            caption={m.caption ? t(m.caption, lang) : undefined}
            className={`col-span-4 ${spanClass[span]} ${m.start ? startClass[m.start] ?? "" : ""}`}
          />
        );
      })}
    </div>
  );
}
