import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { locales, siteUrl } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/work", "/about", "/contact", ...getProjects().map((p) => `/work/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) },
    })),
  );
}
