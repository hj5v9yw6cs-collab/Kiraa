import type { Metadata } from "next";
import { ContactCta } from "@/components/Footer";
import { Gallery, JustifiedRow } from "@/components/Media";
import { Lines, Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { Tx } from "@/components/Tx";
import { getModeling, getProfile, getSite } from "@/lib/content";
import { labels, navLabel, t, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: navLabel(getSite().nav, "model", lang), alternates: { canonical: `/${lang}/model` } };
}

export default async function Model({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const model = getModeling();
  const { contacts } = getProfile();
  const ui = labels(lang);
  const lead = model.photos.filter((p) => p.lead);
  const rest = model.photos.filter((p) => !p.lead);

  return (
    <>
      <section className="shell grid-12 gap-y-8 pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="col-span-4 md:col-span-7">
          <Lines className="t-display" lines={[navLabel(getSite().nav, "model", lang)]} />
        </div>
        <Reveal className="col-span-4 self-end md:col-span-4 md:col-start-9">
          <p className="t-md mb-5">{t(model.intro, lang)}</p>
          <p className="meta flex flex-wrap gap-x-5 gap-y-1">
            {contacts.telegram && (
              <a href={`https://t.me/${contacts.telegram}`} target="_blank" rel="noreferrer" className="hover:!text-ink">
                {ui.telegram} ↗
              </a>
            )}
            {contacts.instagram && (
              <a
                href={`https://instagram.com/${contacts.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="hover:!text-ink"
              >
                {ui.instagram} ↗
              </a>
            )}
          </p>
        </Reveal>
      </section>

      {lead.length > 0 && (
        <div className="shell pb-6">
          <JustifiedRow items={lead} lang={lang} priority captions={false} />
        </div>
      )}

      <Section label={ui.short}>
        <dl className="border-b border-rule">
          {model.facts.map((f, i) => (
            <div key={i} className="rule flex justify-between gap-6 py-3.5">
              <dt className="meta-label shrink-0 pt-0.5">{t(f.label, lang)}</dt>
              <dd className="text-right text-sm">
                <Tx>{t(f.value, lang)}</Tx>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {rest.length > 0 && (
        <section className="rule">
          <div className="shell py-12 md:py-16">
            <Gallery items={rest} lang={lang} />
          </div>
        </section>
      )}

      <ContactCta lang={lang} />
    </>
  );
}
