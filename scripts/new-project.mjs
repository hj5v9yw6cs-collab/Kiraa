#!/usr/bin/env node
// npm run new:project -- my-project-slug
// Writes content/projects/<slug>.json with every field as a [placeholder]
// and creates public/media/<slug>/.
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: npm run new:project -- my-project-slug   (latin, digits, dashes)");
  process.exit(1);
}

const root = process.cwd();
const file = path.join(root, "content", "projects", `${slug}.json`);
if (fs.existsSync(file)) {
  console.error(`${file} already exists`);
  process.exit(1);
}

const dir = path.join(root, "content", "projects");
const index =
  Math.max(0, ...fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).index ?? 0)) + 1;

const ph = (ru, en) => ({ ru: `[${ru}]`, en: `[${en}]` });
const project = {
  slug,
  index,
  draft: true,
  scale: "compact",
  title: ph("Название", "Title"),
  category: ph("Дисциплина / формат", "Discipline / format"),
  summary: ph("Одна-две фразы для карточки", "One or two lines for the card"),
  tags: [ph("тег", "tag")],
  meta: [
    { label: { ru: "Клиент", en: "Client" }, value: ph("клиент", "client") },
    { label: { ru: "Год", en: "Year" }, value: ph("год", "year") },
  ],
  cover: {
    kind: "image",
    src: `/media/${slug}/cover.jpg`,
    width: 1600,
    height: 1200,
    alt: ph("Что на обложке", "What the cover shows"),
  },
  media: [
    {
      kind: "image",
      lead: true,
      src: `/media/${slug}/cover.jpg`,
      width: 1600,
      height: 1200,
      alt: ph("Что на картинке", "What the image shows"),
      caption: ph("Подпись", "Caption"),
    },
  ],
  blocks: [
    { type: "text", label: { ru: "Задача", en: "Brief" }, body: [ph("Текст", "Text")] },
    { type: "list", label: { ru: "Что сделано", en: "Deliverables" }, items: [ph("пункт", "item")] },
  ],
};

fs.mkdirSync(path.join(root, "public", "media", slug), { recursive: true });
fs.writeFileSync(file, JSON.stringify(project, null, 2) + "\n");
console.log(`Created ${path.relative(root, file)} and public/media/${slug}/`);
console.log('Fill the [placeholders], drop images in, then delete "draft": true.');
