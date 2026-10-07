import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/Footer";
import { Gallery, JustifiedRow } from "@/components/Media";
import { Figures } from "@/components/Projects";
import { Lines, Reveal } from "@/components/Reveal";
import { ArrowLink } from "@/components/Section";
import { Tx } from "@/components/Tx";
import { getProject, getProjects, type Block, type Project } from "@/lib/content";
import { formatSize, labels, locales, pad, t, type Locale } from "@/lib/i18n";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((lang) => getProjects().map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: t(p.title, lang),
    description: t(p.summary, lang),
    alternates: { canonical: `/${lang}/work/${slug}` },
    openGraph: p.cover.kind === "image" ? { images: [{ url: p.cover.src }] } : undefined,
  };
}

export default async function Case({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const ui = labels(lang);
  const all = getProjects();
  const next = all[(all.indexOf(all.find((p) => p.slug === slug)!) + 1) % all.length];
  const lead = project.media.filter((m) => m.lead);
  const rest = project.media.filter((m) => !m.lead);
  const title = t(project.title, lang);

  return (
    <article>
      <header className="shell pt-8 pb-12 md:pt-14 md:pb-16">
        <ArrowLink href={`/${lang}/work`} back className="mb-10">
          {ui.backToWork}
        </ArrowLink>
        <p className="meta mt-10 mb-5">
          {pad(project.index)} / {t(project.category, lang)}
        </p>
        <Lines className={title.length > 14 ? "t-xl" : "t-display"} lines={[title]} />

        <div className="grid-12 mt-12 gap-y-10 md:mt-16">
          <Reveal className="col-span-4 md:col-span-7">
            <p className="t-md md:text-[clamp(1.25rem,2.1vw,2rem)] md:leading-[1.2]">
              <Tx>{t(project.lede ?? project.summary, lang)}</Tx>
            </p>
          </Reveal>
          <dl className="col-span-4 border-b border-rule md:col-span-4 md:col-start-9">
            {project.meta.map((row, i) => (
              <div key={i} className="rule flex justify-between gap-6 py-3">
                <dt className="meta-label shrink-0 pt-0.5">{t(row.label, lang)}</dt>
                <dd className="text-right text-sm">
                  <Tx>{t(row.value, lang)}</Tx>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {lead.length > 0 && (
        <div className="shell pb-6">
          <JustifiedRow items={lead} lang={lang} priority />
        </div>
      )}

      {project.figures && (
        <div className="shell">
          <Figures figures={project.figures} lang={lang} />
        </div>
      )}

      {project.blocks?.map((block, i) => <CaseBlock key={i} block={block} lang={lang} />)}

      {rest.length > 0 && (
        <section className="rule">
          <div className="shell py-16 md:py-24">
            <Gallery items={rest} lang={lang} />
          </div>
        </section>
      )}

      {project.files && project.files.length > 0 && <Files project={project} lang={lang} />}

      {next && next.slug !== project.slug && (
        <section className="rule">
          <Link href={`/${lang}/work/${next.slug}`} className="group shell block py-14 md:py-20">
            <p className="meta-label mb-4">{ui.nextProject}</p>
            <p className="flex items-baseline gap-4">
              <span className="meta">{pad(next.index)}</span>
              <span className="t-xl transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                {t(next.title, lang)}
              </span>
            </p>
          </Link>
        </section>
      )}

      <ContactCta lang={lang} />
    </article>
  );
}

function BlockRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rule">
      <div className="shell grid-12 gap-y-6 py-12 md:py-16">
        <h2 className="meta-label col-span-4 md:col-span-4">{label}</h2>
        <div className="col-span-4 md:col-span-8">{children}</div>
      </div>
    </section>
  );
}

function CaseBlock({ block, lang }: { block: Block; lang: Locale }) {
  const label = t(block.label, lang);
  switch (block.type) {
    case "text":
      return (
        <BlockRow label={label}>
          {block.body.map((p, i) => (
            <Reveal key={i} delay={i * 0.06} className="mb-5 last:mb-0">
              <p className="t-md">
                <Tx>{t(p, lang)}</Tx>
              </p>
            </Reveal>
          ))}
        </BlockRow>
      );
    case "list":
      return (
        <BlockRow label={label}>
          <ol className="border-b border-rule">
            {block.items.map((item, i) => (
              <li key={i} className="rule flex gap-5 py-3.5">
                <span className="meta pt-0.5">{pad(i + 1)}</span>
                <span className="t-body">
                  <Tx>{t(item, lang)}</Tx>
                </span>
              </li>
            ))}
          </ol>
        </BlockRow>
      );
    case "steps":
      return (
        <BlockRow label={label}>
          <ol>
            {block.items.map((step, i) => (
              <li key={i} className="grid gap-x-8 gap-y-3 border-b border-rule py-6 first:pt-0 md:grid-cols-2">
                <p className="flex items-baseline gap-4">
                  <span className="meta">{pad(i + 1)}</span>
                  <span className="t-md">{t(step.title, lang)}</span>
                </p>
                <p className="t-body t-body-soft">
                  <Tx>{t(step.body, lang)}</Tx>
                </p>
              </li>
            ))}
          </ol>
        </BlockRow>
      );
    case "quote":
      return (
        <section className="blur-field">
          <div className="shell grid-12 py-20 md:py-32">
            <p className="meta-label col-span-4 mb-8 md:col-span-12">{label}</p>
            <Reveal as="blockquote" className="col-span-4 md:col-span-10">
              <p className="t-lg !normal-case">«{t(block.text, lang)}»</p>
              {block.source && <footer className="meta mt-6">{t(block.source, lang)}</footer>}
            </Reveal>
          </div>
        </section>
      );
  }
}

function Files({ project, lang }: { project: Project; lang: Locale }) {
  const ui = labels(lang);
  return (
    <BlockRow label={ui.files}>
      <ul className="border-b border-rule">
        {project.files!.map((f, i) => (
          <li key={f.src} className="rule flex items-center gap-4 py-4">
            <div className="flex-1">
              <p className="text-sm">{t(f.label, lang)}</p>
              <p className="meta">
                {f.format}
                {f.size ? ` · ${formatSize(f.size)}` : ""}
              </p>
            </div>
            {f.inline !== false && (
              <a href={f.src} target="_blank" rel="noreferrer" className="meta-label hover:!text-ink">
                {ui.open} ↗
              </a>
            )}
            <a href={f.src} download className="meta-label hover:!text-ink">
              {ui.download}
            </a>
            <span className="meta">{pad(i + 1)}</span>
          </li>
        ))}
      </ul>
    </BlockRow>
  );
}
