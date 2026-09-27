import { createFileRoute, notFound } from "@tanstack/react-router";

import { PostEditor } from "@/components/post-editor";
import { getPostForEdit } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/$slug/edit")({
  loader: async ({ params }) => {
    const post = await getPostForEdit({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: () => ({ meta: [{ title: "Edit post — The Pressroom" }] }),
  component: EditPostPage,
});

function EditPostPage() {
  const post = Route.useLoaderData();
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-primary">The Pressroom</p>
      <h1 className="font-display mb-8 mt-1 text-3xl uppercase tracking-tight">Edit post</h1>
      <PostEditor post={post} />
    </div>
  );
}
