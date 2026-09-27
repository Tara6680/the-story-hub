import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthorStrip } from "@/components/author-strip";
import { RouteError } from "@/components/route-fallbacks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Decorum Denied" },
      {
        name: "description",
        content:
          "Who writes Decorum Denied, what it covers, and why decorum never made the cut. By Tara Martin.",
      },
      { property: "og:title", content: "About — Decorum Denied" },
      {
        property: "og:description",
        content: "Who writes Decorum Denied, what it covers, and why decorum never made the cut.",
      },
    ],
  }),
  component: AboutPage,
  errorComponent: RouteError,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />

      <section className="diag relative overflow-hidden">
        <div aria-hidden className="diag-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-2xl px-4 pt-12 pb-12 sm:px-6 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-2">
            The colophon
          </p>
          <h1 className="font-display mt-4 text-[clamp(2.6rem,12vw,4.5rem)] uppercase leading-[0.85] tracking-tight">
            <span className="block">Why</span>
            <span className="block text-primary">Decorum?</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="prose-poster mt-8">
          <p>
            Because "decorum" is the word they reach for when they want you quiet. It is the tone
            argument dressed up as manners, the suggestion that your rights are negotiable as long
            as you negotiate pleasantly.
          </p>
          <p>
            Decorum Denied is a personal blog about power, politics, and queer life. It is written
            the way it is lived: directly, without a disclaimer at the top and without an apology
            at the bottom. The primary beats are political analysis and LGBT issues — law, rhetoric,
            respectability, survival — but nothing here is off-limits if it deserves a page.
          </p>
          <p>
            Expect long-form essays, not takes. Expect receipts. Expect the register of a protest
            poster and the patience of a court brief.
          </p>
        </div>

        <div className="glass mt-10 rounded-[14px] p-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent-2">
            The author
          </p>
          <p className="font-display mt-1 text-lg uppercase tracking-tight text-foreground">
            Tara Martin
          </p>
          <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
            Trans writer. Writes about power, protest, and the politics of being visible. Believes
            the archive is a body, the ballot is a weapon, and politeness has always had a hand
            behind it.
          </p>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-wider text-primary transition-colors hover:text-accent-2"
          >
            ← Back to the front page
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <AuthorStrip />
      </section>

      <SiteFooter />
    </div>
  );
}
