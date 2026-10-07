import type { L } from "./content/types";

export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

/** Resolve a content pair. A missing `ru` falls back to `en`. */
export function t(value: L | undefined, lang: Locale): string {
  if (!value) return "";
  return lang === "ru" ? (value.ru ?? value.en) : value.en;
}

export const navLabel = (nav: { key: string; label: L }[], key: string, lang: Locale) =>
  t(nav.find((n) => n.key === key)?.label, lang);

export const other = (lang: Locale): Locale => (lang === "ru" ? "en" : "ru");

const ui = {
  ru: {
    allProjects: "Все проекты",
    readCase: "Смотреть кейс",
    moreAbout: "Подробнее обо мне",
    also: "Ещё",
    backToWork: "Все проекты",
    nextProject: "Следующий проект",
    files: "Файлы",
    open: "Открыть",
    download: "Скачать",
    writeMe: "Напишите мне",
    telegram: "Telegram",
    instagram: "Instagram",
    phone: "Телефон",
    email: "Email",
    city: "Город",
    portfolio: "Портфолио",
    downloadPdf: "Скачать PDF",
    keys: (n: number) => `Клавиши 1–${n} — разделы, L — язык`,
    toTop: "Наверх",
    projectsCount: (n: number) =>
      `${n} ${plural(n, ["проект", "проекта", "проектов"])}`,
    skills: "Навыки",
    short: "Коротко",
    about: "Обо мне",
    name: "Имя",
    message: "Сообщение",
    send: "Отправить",
    sending: "Отправляю…",
    sent: "Сообщение ушло. Отвечу в ближайшее время.",
    failed: "Не получилось отправить. Напишите напрямую:",
    skip: "К содержанию",
    menu: "Меню",
    close: "Закрыть",
    notFound: "Такой страницы нет",
    home: "На главную",
    sketchThenColour: "Тон → цвет",
  },
  en: {
    allProjects: "All projects",
    readCase: "View case",
    moreAbout: "More about me",
    also: "Also",
    backToWork: "All projects",
    nextProject: "Next project",
    files: "Files",
    open: "Open",
    download: "Download",
    writeMe: "Write to me",
    telegram: "Telegram",
    instagram: "Instagram",
    phone: "Phone",
    email: "Email",
    city: "City",
    portfolio: "Portfolio",
    downloadPdf: "Download PDF",
    keys: (n: number) => `Keys 1–${n} — sections, L — language`,
    toTop: "Top",
    projectsCount: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
    skills: "Skills",
    short: "In short",
    about: "About",
    name: "Name",
    message: "Message",
    send: "Send",
    sending: "Sending…",
    sent: "Message sent. I'll get back to you soon.",
    failed: "Couldn't send it. Write to me directly:",
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    notFound: "There's no such page",
    home: "Home",
    sketchThenColour: "Tone → colour",
  },
};

export type UI = (typeof ui)["ru"];
export const labels = (lang: Locale): UI => ui[lang];

function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

/** +79954719697 → +7 995 471-96-97 */
export function formatPhone(e164: string) {
  const m = e164.match(/^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}` : e164;
}

export const pad = (n: number) => String(n).padStart(2, "0");

export function formatSize(bytes?: number) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
