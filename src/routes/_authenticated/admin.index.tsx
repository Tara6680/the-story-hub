import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deletePost, listAllPosts, setPostStatus, getSubscriberCount } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Posts — The Pressroom" }] }),
  component: AdminPostsPage,
});

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AdminPostsPage() {
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: () => listAllPosts(),
  });

  const { data: subscriberCount = 0 } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: () => getSubscriberCount(),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "subscribers"] });
  };

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: "draft" | "published" }) =>
      setPostStatus({ data: input }),
    onSuccess: refresh,
    onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update status."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost({ data: { id } }),
    onSuccess: () => {
      toast.success("Post deleted.");
      refresh();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't delete."),
  });

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary">The Pressroom</p>
          <h1 className="font-display mt-1 text-3xl uppercase tracking-tight">Your posts</h1>
        </div>
        <Link
          to="/admin/new"
          className="rounded-md bg-primary px-4 py-2 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        >
          + New post
        </Link>
      </div>

      <div className="mb-6 rounded-md border border-line/70 bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2.5 bg-accent-2" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Newsletter subscribers: <span className="text-foreground font-bold">{subscriberCount}</span>
          </span>
        </div>
      </div>

      {isLoading ? (
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet. Write the first one.</p>
      ) : (
        <ul className="divide-y divide-line/70 border-y border-line/70">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-wrap items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={"inline-block size-2 " + (post.status === "published" ? "bg-accent-2" : "bg-muted-foreground")}
                    aria-hidden
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {post.status} · {post.topic} · {formatDate(post.published_at ?? post.updated_at)}
                    {post.featured ? " · featured" : ""}
                  </span>
                </div>
                <p className="font-display mt-1 truncate text-lg uppercase tracking-tight">
                  {post.title}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
                <Link
                  to="/admin/$slug/edit"
                  params={{ slug: post.slug }}
                  className="rounded border border-line px-3 py-1.5 transition-colors hover:border-primary hover:text-primary"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    statusMutation.mutate({
                      id: post.id,
                      status: post.status === "published" ? "draft" : "published",
                    })
                  }
                  className="rounded border border-line px-3 py-1.5 transition-colors hover:border-accent-2 hover:text-accent-2"
                >
                  {post.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Delete \"" + post.title + "\"? This can't be undone.")) {
                      deleteMutation.mutate(post.id);
                    }
                  }}
                  className="rounded border border-line px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
