import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createPublicSupabaseClient } from "./supabase-public.server";

export type PostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  topic: string;
  read_minutes: number;
  author_name: string;
  published_at: string | null;
  featured: boolean;
};

export type FullPost = PostListItem & {
  content: string;
  status: string;
};

export const getPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, excerpt, topic, read_minutes, author_name, published_at, featured",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error("Unable to load posts right now.");
  return (data ?? []) as PostListItem[];
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(200) }).parse(data),
  )
  .handler(async ({ data }): Promise<FullPost | null> => {
    const supabase = createPublicSupabaseClient();
    const { data: post, error } = await supabase
      .from("posts")
      .select(
        "id, slug, title, excerpt, content, topic, read_minutes, author_name, published_at, featured, status",
      )
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
   if (error) throw new Error(\Unable to load posts right now. Supabase error: ${JSON.stringify(error)}`);`
