import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell pt-16 pb-28 md:pt-24">
      <p className="meta mb-6">404</p>
      <h1 className="t-xl mb-10">Такой страницы нет</h1>
      <p className="t-body t-body-soft mb-8">There&apos;s no such page.</p>
      <Link href="/ru" className="meta-label link-arrow hover:!text-ink">
        На главную / Home <span className="arrow">→</span>
      </Link>
    </section>
  );
}
