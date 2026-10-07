import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { locales } from "@/lib/i18n";

export const alt = "Kira Gorst — graphic designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered at build time, where public/ is on disk — a serverless function can't read it.
export const dynamic = "force-static";
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function OpengraphImage() {
  const photo = fs.readFileSync(path.join(process.cwd(), "public/media/about/portrait.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#e6e6e3" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            width: 720,
          }}
        >
          <div style={{ fontSize: 20, letterSpacing: 3, color: "#55555a" }}>
            GRAPHIC DESIGNER &amp; MODEL
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 120, lineHeight: 0.92, letterSpacing: -5, color: "#0f0f10" }}>
            <span>KIRA</span>
            <span>GORST</span>
          </div>
          <div style={{ fontSize: 26, color: "#0f0f10" }}>Identity · Zines · Infographics · Drawing</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={480} height={630} style={{ objectFit: "cover" }} alt="" />
      </div>
    ),
    size,
  );
}
