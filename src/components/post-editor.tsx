import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { savePost, type AdminPost } from "@/lib/admin.functions";

const TOPICS = ["Politics", "Queer Life", "Culture", "Personal", "Media"];

export function PostEditor({ post }: { post: AdminPost | null }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState<null | "draft" | "published">(null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [topic, setTopic] = useState(post?.topic ?? "Politics");
  const [readMinutes, setReadMinutes] = useState(post?.read_minutes ?? 6);
  const [featured, setFeatured] = useState(post?.featured ?? false);

  async function save(status: "draft" | "published") {
    if (!title.trim()) {
      toast.error("Give the piece a title first.");
      return;
    }
    setSaving(status);
    try {
      const nextSlug = await savePost({
        data: {
          id: post?.id,
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: excerpt.trim(),
          content,
          topic,
          read_minutes: readMinutes,
          status,
          featured,
        },
      });
      toast.success(status === "published" ? "Published." : "Draft saved.");
      navigate({ to: "/admin/$slug/edit", params: { slug: nextSlug } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setSaving(null);
    }
  }

  const inputCls =
    "w-full rounded-md border border-line bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary";
  const labelCls = "mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-6">
      <div>
        <label className={labelCls} htmlFor="title">Title</label>
        <input
          id="title"
          className={`${inputCls} font-display text-xl uppercase tracking-tight`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="The headline says it all"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="slug">Slug (optional)</label>
          <input
            id="slug"
            className={`${inputCls} font-mono text-xs`}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-title"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="topic">Topic</label>
          <select
            id="topic"
            className={inputCls}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          className={inputCls}
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="One or two sentences shown on the homepage."
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="content">Body</label>
        <textarea
          id="content"
          className={`${inputCls} min-h-[320px] font-mono text-[13px] leading-relaxed`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write it like you mean it. Blank lines separate paragraphs."
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground" htmlFor="read">
            Read time (min)
          </label>
          <input
            id="read"
            type="number"
            min={1}
            max={120}
            className="w-20 rounded-md border border-line bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            value={readMinutes}
            onChange={(e) => setReadMinutes(Number(e.target.value) || 1)}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="size-4 accent-primary"
          />
          Feature on homepage
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-line/70 pt-6">
        <button
          type="button"
          disabled={saving !== null}
          onClick={() => save("published")}
          className="rounded-md bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving === "published" ? "Publishing…" : post?.status === "published" ? "Update & keep live" : "Publish"}
        </button>
        <button
          type="button"
          disabled={saving !== null}
          onClick={() => save("draft")}
          className="rounded-md border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {saving === "draft" ? "Saving…" : "Save as draft"}
        </button>
      </div>
    </div>
  );
}
