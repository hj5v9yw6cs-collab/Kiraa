import type { Metadata } from "next";
import { CompactList } from "@/components/CompactList";
import { ContactCta } from "@/components/Footer";
import { JustifiedRow } from "@/components/Media";
import { StandardProject, Tags } from "@/components/Projects";
import { Lines, Reveal } from "@/components/Reveal";
import { ArrowLink, Section } from "@/components/Section";
import { Tx } from "@/components/Tx";
import { getProjects, getSite } from "@/lib/content";
import { labels, pad, t, type Locale } from "@/lib/i18n";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(getSite().nav[1].label, lang), alternates: { canonical: `/${lang}/work` } };
}

export default async function Work({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const projects = getProjects();
  const ui = labels(lang);
  const hero = projects.find((p) => p.scale === "hero");
  const standard = projects.filter((p) => p.scale === "standard");
  const compact = projects.filter((p) => p.scale === "compact");
  const years = projects.map((p) => p.year).filter(Boolean) as string[];

  return (
    <>
      <section className="shell flex flex-wrap items-end justify-between gap-6 pt-10 pb-12 md:pt-16 md:pb-20">
        <Lines className="t-display" lines={[t(getSite().nav[1].label, lang)]} />
        <p className="meta">
          {ui.projectsCount(projects.length)}
          {years.length > 0 && ` · ${[...new Set(years)].sort().join("–")}`}
        </p>
      </section>

      {hero && (
        <section className="rule">
          <div className="shell py-12 md:py-16">
            <div className="mb-5 flex justify-between">
              <span className="meta">{pad(hero.index)}</span>
              <span className="meta">{t(hero.category, lang)}</span>
            </div>
            <JustifiedRow items={hero.media.filter((m) => m.lead)} lang={lang} priority captions={false} />
            <div className="grid-12 mt-8 gap-y-6">
              <div className="col-span-4 md:col-span-7">
                <Link href={`/${lang}/work/${hero.slug}`}>
                  <h2 className="t-xl mb-6">{t(hero.title, lang)}</h2>
                </Link>
                <Tags project={hero} lang={lang} />
              </div>
              <Reveal className="col-span-4 md:col-span-4 md:col-start-9">
                <p className="t-body t-body-soft mb-6">
                  <Tx>{t(hero.summary, lang)}</Tx>
                </p>
                <ArrowLink href={`/${lang}/work/${hero.slug}`}>{ui.readCase}</ArrowLink>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {standard.map((p, i) => (
        <StandardProject key={p.slug} project={p} lang={lang} flip={i % 2 === 0} showYear />
      ))}

      {compact.length > 0 && (
        <Section label={ui.also}>
          <CompactList
            rows={compact.map((p) => ({
              href: `/${lang}/work/${p.slug}`,
              num: pad(p.index),
              title: t(p.title, lang),
              category: t(p.category, lang),
              year: p.year,
              cover: p.cover.kind === "image" ? p.cover : undefined,
            }))}
          />
        </Section>
      )}

      <ContactCta lang={lang} />
    </>
  );
}
