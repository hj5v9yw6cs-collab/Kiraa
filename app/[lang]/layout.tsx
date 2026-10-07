import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Onest, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getProfile, getSite } from "@/lib/content";
import { isLocale, labels, locales, pad, siteUrl, t, type Locale } from "@/lib/i18n";
import "../globals.css";

const onest = Onest({ subsets: ["latin", "cyrillic"], variable: "--font-onest", display: "swap" });
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-unbounded",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#e6e6e3" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const site = getSite();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t(site.title, lang), template: `%s — ${t(getProfile().name, lang)}` },
    description: t(site.description, lang),
    alternates: { canonical: `/${lang}`, languages: { ru: "/ru", en: "/en" } },
    openGraph: {
      type: "website",
      locale: lang === "ru" ? "ru_RU" : "en_US",
      title: t(site.title, lang),
      description: t(site.description, lang),
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;
  const site = getSite();
  const profile = getProfile();
  const ui = labels(lang);
  const items = site.nav.map((n, i) => ({
    href: `/${lang}${n.href}`,
    label: t(n.label, lang),
    num: pad(i + 1),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: t(profile.name, lang),
    jobTitle: t(profile.role, lang),
    url: `${siteUrl}/${lang}`,
    sameAs: profile.contacts.telegram ? [`https://t.me/${profile.contacts.telegram}`] : [],
  };

  return (
    <html lang={lang} className={`${onest.variable} ${unbounded.variable} ${jetbrains.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal,.line-mask>span,.media-in img{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="meta-label sr-only z-50 bg-ink px-3 py-2 !text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {ui.skip}
        </a>
        <SmoothScroll />
        <Header
          lang={lang}
          name={t(profile.name, lang)}
          items={items}
          menuLabel={ui.menu}
          closeLabel={ui.close}
        />
        <main id="main">{children}</main>
        <SiteFooter lang={lang} profile={profile} sections={items.length} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
