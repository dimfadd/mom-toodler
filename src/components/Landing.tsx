"use client";

import Link from "next/link";
import { AppDemo } from "./AppDemo";
import { Header } from "./Header";
import { useLanguage } from "./LanguageProvider";
import { Cite, Rich, fill } from "./Rich";
import { references } from "@/content/references";
import { rupiah, site } from "@/content/site";

const container = "mx-auto max-w-6xl px-4 sm:px-6";

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] font-semibold text-accent">{children}</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 font-display text-[2rem] leading-[1.1] font-semibold tracking-tight text-balance text-ink sm:text-[2.6rem]">
      {children}
    </h2>
  );
}

function ChatPreview() {
  const { t } = useLanguage();
  return (
    <figure className="w-full max-w-lg">
      {/* The one elevated element on the page: it stands in for the product itself. */}
      <div className="rounded-2xl border border-line bg-surface p-4 shadow-[0_18px_40px_-24px_rgba(31,42,36,0.45)] sm:p-5">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <p className="font-display text-lg font-semibold text-ink">{site.name}</p>
          <p className="text-sm text-muted">{t.chat.who}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-green px-4 py-3 text-[15px] leading-relaxed text-on-green">
            {t.chat.user}
          </p>
        </div>
        <div className="mt-3 max-w-[92%] rounded-2xl rounded-bl-md border border-line bg-bg px-4 py-3 text-[15px] leading-relaxed text-ink">
          <p>{t.chat.reply}</p>
          <p className="mt-3 flex items-start gap-2 border-t border-line pt-3 text-sm text-muted">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              {t.chat.status} {t.chat.source}
              <Cite n={3} />
            </span>
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted">{t.chat.caption}</figcaption>
    </figure>
  );
}

function Hero() {
  const { t } = useLanguage();
  return (
    <section className={`${container} grid items-center gap-10 pt-10 pb-16 sm:pt-16 md:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14`}>
      <div>
        <p className="text-[15px] font-semibold text-accent">{t.hero.eyebrow}</p>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[1.02] font-semibold tracking-tight text-balance text-ink sm:text-6xl">
          {t.hero.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          <Rich text={t.hero.body} />
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-lg bg-green px-6 text-base font-semibold text-on-green hover:opacity-90">
            {t.hero.primary}
          </Link>
          <a href="#demo" className="inline-flex h-12 items-center justify-center rounded-lg border border-line px-6 text-base font-semibold text-ink hover:bg-surface">
            {t.hero.secondary}
          </a>
        </div>
        <p className="mt-4 text-sm text-muted">{t.hero.note}</p>
      </div>
      <ChatPreview />
    </section>
  );
}

function Why() {
  const { t } = useLanguage();
  return (
    <section id="kenapa" className="border-y border-line bg-surface">
      <div className={`${container} grid gap-8 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14`}>
        <div>
          <Kicker>{t.why.kicker}</Kicker>
          {/* The 1000-day window is the reason the product exists, so it gets the page's largest type. */}
          <p className="mt-3 font-display text-[5.5rem] leading-none font-semibold tracking-tight text-green sm:text-[8rem]" aria-hidden="true">
            1000
          </p>
          <H2>{t.why.title}</H2>
        </div>
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink lg:pt-10">
          <p><Rich text={t.why.p1} /></p>
          <p className="text-muted">{t.why.p2}</p>
          <p className="border-l-2 border-accent pl-4 text-muted">{t.why.p3}</p>
        </div>
      </div>
    </section>
  );
}

function Moments() {
  const { t } = useLanguage();
  const [first, ...rest] = t.moments.items;
  return (
    <section id="momen" className={`${container} py-16 md:py-24`}>
      <Kicker>{t.moments.kicker}</Kicker>
      <H2>{t.moments.title}</H2>
      <div className="mt-10 grid gap-4 md:grid-cols-2 md:grid-rows-3">
        {/* The first moment is the headline case (pregnancy), so it takes the tall column. */}
        <article className="flex flex-col justify-between rounded-2xl bg-green p-6 text-on-green sm:p-8 md:row-span-3">
          <div>
            <p className="text-[15px] font-semibold opacity-85">{first.when}</p>
            <h3 className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-4xl">{first.problem}</h3>
          </div>
          <p className="mt-8 text-lg leading-relaxed opacity-95">{first.answer}</p>
        </article>
        {rest.map((item) => (
          <article key={item.problem} className="rounded-2xl border border-line p-6">
            <p className="text-[15px] font-semibold text-accent">{item.when}</p>
            <h3 className="mt-2 font-display text-2xl leading-snug font-semibold text-ink">{item.problem}</h3>
            <p className="mt-3 leading-relaxed text-muted">
              <Rich text={item.answer} />
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const { t } = useLanguage();
  return (
    <section id="fitur">
      <div className={`${container} py-16 md:py-24`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Kicker>{t.features.kicker}</Kicker>
            <H2>{t.features.title}</H2>
          </div>
          <div className="md:max-w-xs md:text-right">
            <p className="text-[15px] text-muted">{t.features.note}</p>
            <Link href="/app" className="mt-1 inline-flex min-h-11 items-center font-semibold text-green underline underline-offset-4">
              {t.features.demo}
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-green-soft p-6 sm:p-10">
          <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{t.features.lead.title}</h3>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-ink">
            <Rich text={t.features.lead.body} />
          </p>
        </div>

        <dl className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3">
          {t.features.list.map((item) => (
            <div key={item.title} className="border-b border-line py-6 sm:pr-8">
              <dt className="font-semibold text-ink">{item.title}</dt>
              <dd className="mt-1.5 leading-relaxed text-muted">
                <Rich text={item.body} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Trust() {
  const { t } = useLanguage();
  return (
    <section id="rujukan" className="border-y border-line bg-surface">
      <div className={`${container} grid gap-10 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14`}>
        <div>
          <Kicker>{t.trust.kicker}</Kicker>
          <H2>{t.trust.title}</H2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{t.trust.disclaimer}</p>
        </div>
        <ol className="space-y-6">
          {t.trust.items.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[2.25rem_1fr] gap-3">
              <span className="font-display text-2xl leading-none font-semibold text-accent tabular-nums" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 leading-relaxed text-muted">
                  <Rich text={item.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  const { t } = useLanguage();
  const vars = {
    seats: site.founding.seats,
    yearly: rupiah(site.plus.yearly),
    founding: rupiah(site.founding.price),
    yearlyPerMonth: rupiah(Math.round(site.plus.yearly / 12 / 1000) * 1000),
  };
  const hasPayment = Boolean(site.founding.paymentUrl);

  return (
    <section id="harga" className={`${container} py-16 md:py-24`}>
      <Kicker>{t.pricing.kicker}</Kicker>
      <H2>{fill(t.pricing.title, vars)}</H2>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl bg-green p-6 text-on-green sm:p-10">
          <p className="text-[15px] font-semibold opacity-85">{t.pricing.plan}</p>
          <p className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">{rupiah(site.founding.price)}</p>
          <p className="mt-2 opacity-85">{fill(t.pricing.normal, vars)}</p>
          <ul className="mt-8 space-y-3">
            {t.pricing.perks.map((perk) => (
              <li key={perk} className="flex gap-3">
                <svg className="mt-1 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{fill(perk, vars)}</span>
              </li>
            ))}
          </ul>
          {hasPayment ? (
            <a
              href={site.founding.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex h-12 w-full items-center justify-center rounded-lg bg-on-green px-6 text-base font-semibold text-green hover:opacity-90 sm:w-auto"
            >
              {fill(t.pricing.cta, vars)}
            </a>
          ) : (
            <Link
              href="/app"
              className="mt-10 inline-flex h-12 w-full items-center justify-center rounded-lg bg-on-green px-6 text-base font-semibold text-green hover:opacity-90 sm:w-auto"
            >
              {t.pricing.ctaFree}
            </Link>
          )}
        </div>

        <div className="rounded-2xl border border-line p-6 sm:p-8">
          <h3 className="font-semibold text-ink">{t.pricing.afterTitle}</h3>
          <dl className="mt-4 divide-y divide-line">
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted">{t.pricing.monthly}</dt>
              <dd className="text-right">
                <span className="font-display text-2xl font-semibold text-ink">{rupiah(site.plus.monthly)}</span>
                <span className="block text-sm text-muted">{t.pricing.perMonth}</span>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="text-muted">{t.pricing.yearly}</dt>
              <dd className="text-right">
                <span className="font-display text-2xl font-semibold text-ink">{rupiah(site.plus.yearly)}</span>
                <span className="block text-sm text-muted">{fill(t.pricing.yearlyNote, vars)}</span>
              </dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-line pt-4 text-[15px] leading-relaxed text-muted">{t.pricing.free}</p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useLanguage();
  return (
    <section id="faq" className="border-t border-line">
      <div className={`${container} py-16 md:py-24`}>
        <Kicker>{t.faq.kicker}</Kicker>
        <H2>{t.faq.title}</H2>
        <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[17px] font-semibold text-ink">
                <span>{item.q}</span>
                <span className="font-display text-2xl leading-none text-accent group-open:hidden" aria-hidden="true">+</span>
                <span className="hidden font-display text-2xl leading-none text-accent group-open:inline" aria-hidden="true">−</span>
              </summary>
              <p className="pb-5 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  const citedOnPage = new Set([...JSON.stringify(t).matchAll(/\[\[(\d+)\]\]/g)].map((m) => Number(m[1])).concat([3]));
  return (
    <footer className="border-t border-line bg-surface">
      <div className={`${container} py-12`}>
        <h2 className="font-semibold text-ink">{t.footer.refsTitle}</h2>
        <ol className="mt-4 space-y-3">
          {references.filter((ref) => citedOnPage.has(ref.id)).map((ref) => (
            <li key={ref.id} id={`ref-${ref.id}`} className="grid scroll-mt-24 grid-cols-[1.75rem_1fr] gap-2 text-sm leading-relaxed text-muted target:text-ink">
              <span className="font-semibold text-accent tabular-nums">{ref.id}</span>
              <span>
                {ref.citation}{" "}
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="break-all font-medium text-ink underline underline-offset-2">
                  {ref.url.replace(/^https:\/\//, "")}
                </a>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl">{t.footer.disclaimer}</p>
          <p className="shrink-0">{fill(t.footer.rights, { year: 2026 })}</p>
        </div>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Why />
        <Moments />
        <AppDemo />
        <Features />
        <Trust />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
