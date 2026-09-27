import { createFileRoute } from "@tanstack/react-router";

import { PostEditor } from "@/components/post-editor";

export const Route = createFileRoute("/_authenticated/admin/new")({
  head: () => ({ meta: [{ title: "New post — The Pressroom" }] }),
  component: NewPostPage,
});

function NewPostPage() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-primary">The Pressroom</p>
      <h1 className="font-display mb-8 mt-1 text-3xl uppercase tracking-tight">New post</h1>
      <PostEditor post={null} />
    </div>
  );
}
