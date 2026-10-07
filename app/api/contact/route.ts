import { NextResponse } from "next/server";

// 5 messages a minute per IP. In-memory: good enough for a personal site.
const hits = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW = 60_000;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO) {
    return NextResponse.json({ error: "Contact form is not configured" }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) {
    return NextResponse.json({ error: "Too many messages" }, { status: 429 });
  }
  hits.set(ip, [...recent, now]);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot filled → pretend nothing happened, send nothing.
  if (clean(body.company, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 422 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: CONTACT_TO,
      reply_to: email,
      subject: `Сайт: сообщение от ${name}`,
      text: `${name} <${email}>\n\n${message}`,
      html: `<p><b>${escape(name)}</b> &lt;${escape(email)}&gt;</p><p style="white-space:pre-wrap">${escape(message)}</p>`,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
