import Link from "next/link";
import type { Project } from "@/lib/content";
import { labels, pad, t, type Locale } from "@/lib/i18n";
import { JustifiedRow, Picture } from "./Media";
import { Reveal } from "./Reveal";
import { ArrowLink } from "./Section";
import { Tx } from "./Tx";

const caseHref = (lang: Locale, p: Project) => `/${lang}/work/${p.slug}`;

export function Tags({ project, lang }: { project: Project; lang: Locale }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {project.tags.map((tag, i) => (
        <li key={i} className="meta">
          {t(tag, lang)}
        </li>
      ))}
    </ul>
  );
}

function Eyebrow({ project, lang }: { project: Project; lang: Locale }) {
  return (
    <p className="meta mb-4">
      {pad(project.index)} — {t(project.category, lang)}
    </p>
  );
}

/** Typographic panel for a project with no photography. */
function NoCover({ project, lang }: { project: Project; lang: Locale }) {
  return (
    <div className="flex aspect-[4/3] items-end bg-night p-6 text-night-soft">
      <p className="t-lg">{t(project.title, lang)}</p>
    </div>
  );
}

/** The one hero project: on the blurred grey field, lead images in one row. */
export function HeroProject({ project, lang }: { project: Project; lang: Locale }) {
  const ui = labels(lang);
  const lead = project.media.filter((m) => m.lead);
  return (
    <section className="blur-field on-night">
      <div className="shell py-16 md:py-24">
        <div className="grid-12 mb-10 gap-y-6 md:mb-14">
          <div className="col-span-4 md:col-span-7">
            <Eyebrow project={project} lang={lang} />
            <Link href={caseHref(lang, project)} className="block">
              <h3 className="t-xl">{t(project.title, lang)}</h3>
            </Link>
          </div>
          <Reveal className="col-span-4 self-end md:col-span-4 md:col-start-9">
            <p className="t-body t-body-soft">
              <Tx>{t(project.summary, lang)}</Tx>
            </p>
          </Reveal>
        </div>
        {lead.length > 0 && <JustifiedRow items={lead} lang={lang} />}
        <div className="rule mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 pt-6">
          <ArrowLink href={caseHref(lang, project)} className="!text-white">
            {ui.readCase}
          </ArrowLink>
          <Tags project={project} lang={lang} />
        </div>
      </div>
    </section>
  );
}

/** A project told in numbers: the home page's figures band. */
export function FiguresProject({ project, lang }: { project: Project; lang: Locale }) {
  const ui = labels(lang);
  return (
    <section className="rule">
      <div className="shell py-16 md:py-24">
        <div className="grid-12 gap-y-6">
          <div className="col-span-4 md:col-span-7">
            <Eyebrow project={project} lang={lang} />
            <Link href={caseHref(lang, project)}>
              <h3 className="t-xl">{t(project.title, lang)}</h3>
            </Link>
          </div>
          <Reveal className="col-span-4 self-end md:col-span-4 md:col-start-9">
            <p className="t-body t-body-soft">
              <Tx>{t(project.summary, lang)}</Tx>
            </p>
          </Reveal>
        </div>
        {project.figures && <Figures figures={project.figures} lang={lang} />}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <ArrowLink href={caseHref(lang, project)}>{ui.readCase}</ArrowLink>
          <Tags project={project} lang={lang} />
        </div>
      </div>
    </section>
  );
}

export function Figures({ figures, lang }: { figures: NonNullable<Project["figures"]>; lang: Locale }) {
  return (
    <dl className="rule my-10 grid grid-cols-2 gap-x-4 gap-y-10 pt-8 md:my-14 md:grid-cols-4">
      {figures.map((f, i) => (
        <Reveal key={i} delay={i * 0.07}>
          <dt className="t-xl mb-3 !normal-case">{f.value}</dt>
          <dd className="meta max-w-[16ch] normal-case tracking-normal">{t(f.label, lang)}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

/** Alternating left/right column. */
export function StandardProject({
  project,
  lang,
  flip,
  showYear,
}: {
  project: Project;
  lang: Locale;
  flip?: boolean;
  showYear?: boolean;
}) {
  const ui = labels(lang);
  return (
    <section className="rule">
      <div className="shell py-16 md:py-24">
        {showYear && (
          <div className="mb-5 flex justify-between">
            <span className="meta">{pad(project.index)}</span>
            {project.year && <span className="meta">{project.year}</span>}
          </div>
        )}
        <div className="grid-12 items-center gap-y-8">
          <Link
            href={caseHref(lang, project)}
            className={`col-span-4 md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}
            tabIndex={-1}
            aria-hidden
          >
            {project.cover.kind === "image" ? (
              <Picture img={project.cover} lang={lang} sizes="(max-width: 768px) 100vw, 58vw" />
            ) : (
              <NoCover project={project} lang={lang} />
            )}
          </Link>
          <div
            className={`col-span-4 md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}
          >
            <Eyebrow project={project} lang={lang} />
            <Link href={caseHref(lang, project)}>
              <h3 className="t-lg mb-5">{t(project.title, lang)}</h3>
            </Link>
            <p className="t-body t-body-soft mb-6">
              <Tx>{t(project.summary, lang)}</Tx>
            </p>
            <div className="mb-8">
              <Tags project={project} lang={lang} />
            </div>
            <ArrowLink href={caseHref(lang, project)}>{ui.readCase}</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
