import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { AuthorStrip } from "@/components/author-strip";
import { RouteError, RouteNotFound } from "@/components/route-fallbacks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPostBySlug } from "@/lib/posts.functions";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/posts/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — Decorum Denied" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `${loaderData.title} — Decorum Denied` },
        { name: "description", content: loaderData.excerpt || loaderData.title },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt || loaderData.title },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PostPage,
  errorComponent: RouteError,
  notFoundComponent: PostNotFound,
});

function PostNotFound() {
  return <RouteNotFound title="Nothing printed here" hint="That essay doesn't exist (yet)." />;
}

function PostPage() {
  const post = Route.useLoaderData();
  const paragraphs = post.content.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />

      <article className="mx-auto max-w-2xl px-4 pt-10 pb-8 sm:px-6">
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-wider text-accent-2 transition-colors hover:text-primary"
        >
          ← All write-ups
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="text-accent-2">{post.topic}</span>
          <span>·</span>
          <span>{fmtDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.read_minutes} min</span>
        </div>

        <h1 className="font-display mt-3 text-4xl uppercase leading-[0.95] tracking-tight text-balance text-foreground sm:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          By {post.author_name}
        </p>

        <div className="prose-poster mt-8">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="mt-12">
        <AuthorStrip />
      </section>

      <SiteFooter />
    </div>
  );
}
