import Link from "next/link";
import type { Profile } from "@/lib/content";
import { formatSize, labels, t, type Locale } from "@/lib/i18n";
import { Lines } from "./Reveal";
import { ToTop } from "./ToTop";
import { Tx } from "./Tx";

/** The big "Write to me →" that closes every page except /contact. */
export function ContactCta({ lang }: { lang: Locale }) {
  const ui = labels(lang);
  const words = ui.writeMe.split(" ");
  const lastWord = words.pop();
  return (
    <section className="rule">
      <div className="shell pt-20 pb-4 md:pt-32">
        <Link href={`/${lang}/contact`} className="group inline-block">
          <Lines
            as="p"
            className="t-display !text-[clamp(2.2rem,8.2vw,8.5rem)]"
            lines={[
              <>
                {words.join(" ")}{" "}
                <span className="whitespace-nowrap">
                  {lastWord}
                  <span
                  aria-hidden
                  className="ml-2 inline-block align-baseline text-[0.42em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3"
                >
                  →
                </span>
                </span>
              </>,
            ]}
          />
        </Link>
      </div>
    </section>
  );
}

export function ContactRow({ lang, profile }: { lang: Locale; profile: Profile }) {
  const ui = labels(lang);
  const { telegram, email } = profile.contacts;
  const cells: { label: string; node: React.ReactNode }[] = [];
  if (telegram)
    cells.push({
      label: ui.telegram,
      node: (
        <a href={`https://t.me/${telegram}`} target="_blank" rel="noreferrer" className="u-line">
          @{telegram}
        </a>
      ),
    });
  if (email)
    cells.push({
      label: ui.email,
      node: (
        <a href={`mailto:${email}`} className="u-line">
          {email}
        </a>
      ),
    });
  cells.push({ label: ui.city, node: <Tx>{t(profile.city, lang)}</Tx> });
  if (profile.portfolioPdf)
    cells.push({
      label: ui.portfolio,
      node: (
        <a href={profile.portfolioPdf.src} download className="u-line">
          {ui.downloadPdf}
          <span className="meta ml-2 align-middle">{formatSize(profile.portfolioPdf.size)}</span>
        </a>
      ),
    });

  return (
    <div className="grid-12 gap-y-8 py-12 md:py-16">
      {cells.map((cell, i) => (
        <div key={i} className="col-span-4 md:col-span-3">
          <p className="meta-label mb-2.5">{cell.label}</p>
          <div className="t-md">{cell.node}</div>
        </div>
      ))}
    </div>
  );
}

export function SiteFooter({
  lang,
  profile,
  sections,
}: {
  lang: Locale;
  profile: Profile;
  sections: number;
}) {
  const ui = labels(lang);
  return (
    <footer className="shell">
      <ContactRow lang={lang} profile={profile} />
      <div className="rule flex flex-wrap items-center justify-between gap-4 py-6">
        <p className="meta-label">
          © {new Date().getFullYear()} {t(profile.name, lang)}
        </p>
        <p className="meta-label hidden md:block">{ui.keys(sections)}</p>
        <ToTop label={ui.toTop} />
      </div>
    </footer>
  );
}
