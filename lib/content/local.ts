import fs from "node:fs";
import path from "node:path";
import type { Modeling, Profile, Project, Site } from "./types";

const root = process.cwd();
const read = <T>(rel: string): T =>
  JSON.parse(fs.readFileSync(path.join(root, "content", rel), "utf8")) as T;

/** File sizes are read off disk at build time, never typed in. */
const sizeOf = (publicSrc: string): number | undefined => {
  try {
    return fs.statSync(path.join(root, "public", publicSrc)).size;
  } catch {
    return undefined;
  }
};

export function getProfile(): Profile {
  const profile = read<Profile>("profile.json");
  if (profile.portfolioPdf) {
    profile.portfolioPdf.size = sizeOf(profile.portfolioPdf.src);
  }
  return profile;
}

export function getSite(): Site {
  return read<Site>("site.json");
}

export function getProjects(): Project[] {
  const dir = path.join(root, "content", "projects");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => read<Project>(path.join("projects", f)))
    .filter((p) => !p.draft)
    .map((p) => ({
      ...p,
      files: p.files?.map((file) => ({ ...file, size: sizeOf(file.src) })),
    }))
    .sort((a, b) => a.index - b.index);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getModeling(): Modeling {
  return read<Modeling>("model.json");
}
