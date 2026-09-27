import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthorStrip } from "@/components/author-strip";
import { RouteError } from "@/components/route-fallbacks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedPosts } from "@/lib/posts.functions";
import { fmtDate } from "@/lib/format";

const postsQueryOptions = queryOptions({
  queryKey: ["posts", "published"],
  queryFn: () => getPublishedPosts(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQueryOptions),
  head: () => ({
    meta: [
      { title: "Decorum Denied — Essays on Politics & Queer Life" },
      {
        name: "description",
        content:
          "Long-form essays on power, protest, and living openly, by Tara Martin. No polish, no apology.",
      },
      { property: "og:title", content: "Decorum Denied — Essays on Politics & Queer Life" },
      {
        property: "og:description",
        content: "Long-form essays on power, protest, and living openly. No polish, no apology.",
      },
    ],
  }),
  component: Home,
  errorComponent: RouteError,
});

function Home() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions);
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const recent = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />

      <section className="diag relative overflow-hidden">
        <div aria-hidden className="diag-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-3xl px-4 pt-10 pb-12 sm:px-6 sm:pt-16 sm:pb-16">
          <p className="font-mono animate-fade text-[11px] uppercase tracking-[0.2em] text-accent-2">
            A personal blog · politics &amp; queer life
          </p>
          <h1 className="font-display animate-rise mt-4 text-[clamp(3.4rem,20vw,6.5rem)] uppercase leading-[0.82] tracking-tight">
            <span className="block">Decorum</span>
            <span className="-mx-1 block text-primary">Denied</span>
          </h1>
          <p className="animate-rise mt-5 max-w-[42ch] text-sm text-pretty text-muted-foreground [animation-delay:120ms] sm:text-base">
            Long-form essays on power, protest, and living openly. Written by Tara Martin. No
            polish, no apology.
          </p>
        </div>
      </section>

      {featured ? (
        <section className="relative z-10 -mt-6 px-4 sm:px-6">
          <div className="glass-accent mx-auto max-w-3xl animate-slide rounded-[14px] p-4 [animation-delay:160ms] sm:p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
              <span className="text-primary">Featured</span>
              <span className="text-muted-foreground/60">/</span>
              <span className="text-muted-foreground">{featured.topic}</span>
            </div>
            <Link
              to="/posts/$slug"
              params={{ slug: featured.slug }}
              className="mt-3 block font-display text-2xl uppercase leading-[0.95] tracking-tight text-balance text-foreground transition-colors hover:text-primary sm:text-3xl"
            >
              {featured.title}
            </Link>
            <p className="mt-3 text-sm text-pretty text-muted-foreground">{featured.excerpt}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">
                {fmtDate(featured.published_at)} · {featured.read_minutes} min
              </span>
              <Link
                to="/posts/$slug"
                params={{ slug: featured.slug }}
                className="font-mono text-[11px] uppercase tracking-wider text-primary transition-colors hover:text-accent-2"
              >
                Read →
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 sm:px-6">
          <div className="glass mx-auto max-w-3xl rounded-[14px] p-5">
            <p className="text-sm text-muted-foreground">
              Nothing has been printed yet. The presses are warm, though.
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mt-10 mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl uppercase tracking-tight text-foreground">Recent</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
            {String(recent.length).padStart(2, "0")} entries
          </span>
        </div>

        {recent.length > 0 ? (
          <div className="divide-y divide-border">
            {recent.map((post) => (
              <Link
                key={post.id}
                to="/posts/$slug"
                params={{ slug: post.slug }}
                className="group block py-4"
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className="text-accent-2">{post.topic}</span>
                  <span>·</span>
                  <span>{fmtDate(post.published_at)}</span>
                </div>
                <h3 className="font-display mt-1 text-lg uppercase leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  {post.title}
                </h3>
                <p className="line-clamp-2 mt-1 text-sm text-pretty text-muted-foreground">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-12">
        <AuthorStrip />
      </section>

      <SiteFooter />
    </div>
  );
}
