import Link from "next/link";
import { CompactList } from "@/components/CompactList";
import { ContactCta } from "@/components/Footer";
import { Picture } from "@/components/Media";
import { FiguresProject, HeroProject, StandardProject } from "@/components/Projects";
import { Lines, Reveal } from "@/components/Reveal";
import { ArrowLink, Section } from "@/components/Section";
import { Tx } from "@/components/Tx";
import { getProfile, getProjects, getSite } from "@/lib/content";
import { labels, pad, t, type Locale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const profile = getProfile();
  const site = getSite();
  const projects = getProjects();
  const ui = labels(lang);

  const hero = projects.find((p) => p.scale === "hero");
  const standard = projects.filter((p) => p.scale === "standard");
  const withFigures = standard.find((p) => p.figures?.length);
  const restStandard = standard.filter((p) => p !== withFigures);
  const compact = projects.filter((p) => p.scale === "compact");
  const [first, ...last] = t(profile.name, lang).split(" ");
  const nav = site.nav.map((n, i) => ({ href: `/${lang}${n.href}`, label: t(n.label, lang), num: pad(i + 1) }));

  return (
    <>
      {/* Hero */}
      <section className="shell grid-12 gap-y-8 pt-6 pb-16 md:pt-10 md:pb-24">
        <div className="col-span-4 flex flex-col md:col-span-6">
          <p className="meta mb-8 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="!text-ink">{t(profile.role, lang)}</span>
            <span>—</span>
            <span>
              <Tx>{t(profile.city, lang)}</Tx>
            </span>
            {profile.status.open && (
              <>
                <span>—</span>
                <span className="inline-flex items-center gap-2 !text-ink">
                  <span className="status-dot" aria-hidden />
                  {t(profile.status.label, lang)}
                </span>
              </>
            )}
          </p>
          <Lines className="t-display" lines={[first, <span key="l" className="md:pl-[0.5em]">{last.join(" ")}</span>]} />
          <div className="mt-auto pt-14">
            <Reveal delay={0.3}>
              <p className="t-md mb-8 max-w-[22ch] md:text-[clamp(1.25rem,2.3vw,2.1rem)] md:leading-[1.15]">
                {t(profile.tagline, lang)}
              </p>
            </Reveal>
            <nav aria-label="Sections" className="rule pt-4">
              <ul className="flex flex-wrap gap-x-7 gap-y-2">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="meta hover:!text-ink">
                      {n.num} {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="col-span-4 -order-1 md:order-none md:col-span-6 md:-mr-[var(--gutter)]">
          <Picture img={profile.heroPhoto} lang={lang} priority sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      </section>

      {/* 01 About */}
      <Section num="01" label={t(site.nav[0].label, lang)}>
        <div className="max-w-[46rem]">
          <Reveal>
            <p className="t-md mb-6">{t(profile.about.paragraphs[0], lang)}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="t-md text-ink-soft">{t(profile.about.paragraphs[2], lang)}</p>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-[minmax(0,1.79fr)_minmax(0,1fr)] gap-3 md:gap-4">
          {profile.about.strip.map((img) => (
            <div key={img.src} className="aspect-[4/5] md:aspect-auto md:h-[min(52vw,640px)]">
              <Picture img={img} lang={lang} fill className="h-full" sizes="(max-width: 768px) 60vw, 45vw" />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <ArrowLink href={`/${lang}/about`}>{ui.moreAbout}</ArrowLink>
        </div>
      </Section>

      {/* Quote on the blurred field */}
      <section className="blur-field">
        <div className="shell grid-12 py-24 md:py-40">
          <Reveal as="blockquote" className="col-span-4 md:col-span-10 md:col-start-2">
            <p className="t-lg text-center !normal-case">«{t(profile.about.quote, lang)}»</p>
          </Reveal>
        </div>
      </section>

      {/* 02 Work */}
      <section id="work" className="rule">
        <div className="shell py-10">
          <h2 className="meta-label">
            <span className="mr-3 opacity-70">02</span>
            <span className="!text-ink">{t(site.nav[1].label, lang)}</span>
          </h2>
        </div>
        {hero && <HeroProject project={hero} lang={lang} />}
        {withFigures && <FiguresProject project={withFigures} lang={lang} />}
        {restStandard.map((p, i) => (
          <StandardProject key={p.slug} project={p} lang={lang} flip={i % 2 === 1} />
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
            <div className="mt-8">
              <ArrowLink href={`/${lang}/work`}>{ui.allProjects}</ArrowLink>
            </div>
          </Section>
        )}
      </section>

      <ContactCta lang={lang} />
    </>
  );
}
