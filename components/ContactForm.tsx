"use client";

import { useState, type FormEvent } from "react";

type Labels = {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  sent: string;
  failed: string;
};

/** Never pretends to have sent something: on any failure it shows a direct contact. */
export function ContactForm({
  labels,
  fallback,
}: {
  labels: Labels;
  fallback?: { href: string; text: string };
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const field =
    "w-full border-b border-rule bg-transparent pt-2 pb-3 text-base outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <label className="block">
        <span className="meta-label">{labels.name}</span>
        <input name="name" required autoComplete="name" maxLength={120} className={field} />
      </label>
      <label className="block">
        <span className="meta-label">{labels.email}</span>
        <input name="email" type="email" required autoComplete="email" maxLength={200} className={field} />
      </label>
      <label className="block">
        <span className="meta-label">{labels.message}</span>
        <textarea name="message" required rows={5} maxLength={5000} className={`${field} resize-y`} />
      </label>
      {/* Honeypot: humans never see it. */}
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="flex flex-wrap items-center gap-6" aria-live="polite">
        <button
          type="submit"
          disabled={state === "sending"}
          className="meta-label link-arrow bg-ink px-5 py-3.5 !text-paper transition-opacity disabled:opacity-60"
        >
          {state === "sending" ? labels.sending : labels.send}
          <span className="arrow">→</span>
        </button>
        {state === "sent" && <p className="text-sm">{labels.sent}</p>}
        {state === "error" && (
          <p className="text-sm">
            {labels.failed}{" "}
            {fallback && (
              <a href={fallback.href} className="underline underline-offset-4">
                {fallback.text}
              </a>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
