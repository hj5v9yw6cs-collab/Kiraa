import type { Metadata } from "next";
import { ContactCta } from "@/components/Footer";
import { Picture } from "@/components/Media";
import { Lines, Reveal } from "@/components/Reveal";
import { ArrowLink, Section } from "@/components/Section";
import { Tx } from "@/components/Tx";
import { getProfile, getSite } from "@/lib/content";
import { labels, t, type Locale, navLabel } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: navLabel(getSite().nav, "about", lang), alternates: { canonical: `/${lang}/about` } };
}

export default async function About({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const profile = getProfile();
  const ui = labels(lang);
  const portrait = profile.heroPhoto;

  return (
    <>
      <section className="shell grid-12 gap-y-10 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="col-span-4 md:col-span-8">
          <p className="meta-label mb-6">{ui.about}</p>
          <Lines className="t-xl !text-[clamp(1.9rem,4.6vw,4.5rem)]" lines={[t(profile.tagline, lang)]} />
        </div>
        <div className="col-span-4 md:col-span-4 md:col-start-9">
          <Picture
            img={portrait}
            lang={lang}
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
            caption={`${t(profile.name, lang)} — ${t(profile.city, lang)}`}
          />
        </div>
      </section>

      <section className="rule">
        <div className="shell grid-12 py-16 md:py-24">
          <div className="col-span-4 space-y-6 md:col-span-6 md:col-start-4">
            {profile.about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="t-md">
                  <Tx>{t(p, lang)}</Tx>
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="rule">
        <div className="shell py-6 md:py-10">
          <Picture
            img={profile.about.portrait}
            lang={lang}
            sizes="100vw"
            caption={t(profile.about.portrait.caption, lang)}
          />
        </div>
      </section>

      <Section label={ui.short}>
        <dl className="border-b border-rule">
          {profile.facts.map((f, i) => (
            <div key={i} className="rule flex justify-between gap-6 py-3.5">
              <dt className="meta-label shrink-0 pt-0.5">{t(f.label, lang)}</dt>
              <dd className="text-right text-sm">
                <Tx>{t(f.value, lang)}</Tx>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label={ui.skills}>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {profile.skills.map((group, i) => (
            <Reveal key={i} delay={(i % 3) * 0.06}>
              <h3 className="t-md mb-4 border-b border-rule pb-3">{t(group.title, lang)}</h3>
              <ul className="space-y-1.5">
                {group.items.map((item, j) => (
                  <li key={j} className="text-sm text-ink-soft">
                    <Tx>{t(item, lang)}</Tx>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="rule">
        <div className="shell flex flex-wrap gap-8 py-10">
          <ArrowLink href={`/${lang}/work`}>{ui.allProjects}</ArrowLink>
          <ArrowLink href={`/${lang}/contact`}>{ui.writeMe}</ArrowLink>
        </div>
      </section>

      <ContactCta lang={lang} />
    </>
  );
}
