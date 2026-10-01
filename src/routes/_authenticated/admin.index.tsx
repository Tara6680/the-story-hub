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

      <div className="mb-6
