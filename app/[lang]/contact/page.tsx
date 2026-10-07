import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { contactLinks } from "@/components/Footer";
import { Lines } from "@/components/Reveal";
import { getProfile, getSite } from "@/lib/content";
import { labels, t, type Locale, navLabel } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return { title: navLabel(getSite().nav, "contact", lang), alternates: { canonical: `/${lang}/contact` } };
}

export default async function Contact({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const profile = getProfile();
  const site = getSite();
  const ui = labels(lang);
  const words = ui.writeMe.split(" ");
  const { telegram, email } = profile.contacts;

  const rows = contactLinks(lang, profile);

  return (
    <>
      <section className="shell flex flex-wrap items-end justify-between gap-6 pt-10 pb-14 md:pt-16 md:pb-20">
        <Lines className="t-display" lines={words} />
        {profile.status.open && (
          <p className="meta inline-flex items-center gap-2">
            <span className="status-dot" aria-hidden />
            {t(profile.status.label, lang)}
          </p>
        )}
      </section>

      <section className="rule">
        <div className="shell grid-12 gap-y-14 py-14 md:py-20">
          <div className="col-span-4 md:col-span-4">
            <p className="t-md mb-10">{t(site.contactIntro, lang)}</p>
            <dl className="border-b border-rule">
              {rows.map((r) => (
                <div key={r.label} className="rule py-4">
                  <dt className="meta-label mb-1.5">{r.label}</dt>
                  <dd>{r.node}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="col-span-4 md:col-span-7 md:col-start-6">
            <ContactForm
              labels={{
                name: ui.name,
                email: ui.email,
                message: ui.message,
                send: ui.send,
                sending: ui.sending,
                sent: ui.sent,
                failed: ui.failed,
              }}
              fallback={
                telegram
                  ? { href: `https://t.me/${telegram}`, text: `Telegram @${telegram}` }
                  : email
                    ? { href: `mailto:${email}`, text: email }
                    : undefined
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
