import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: import("@supabase/supabase-js").SupabaseClient, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Not authorized");
}

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  topic: string;
  read_minutes: number;
  status: string;
  featured: boolean;
  published_at: string | null;
  updated_at: string;
};

export const isAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return Boolean(data);
  });

export const getSubscriberCount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { count, error } = await context.supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true });
    if (error) throw new Error("Couldn't load subscriber count.");
    return count ?? 0;
  });

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error("Unable to load posts.");
    return (data ?? []) as AdminPost[];
  });

export const getPostForEdit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(200) }).parse(data),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: post, error } = await context.supabase
      .from("posts")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error("Unable to load this post.");
    return (post as AdminPost | null) ?? null;
  });

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-+|-+$/g, "");
}

const savePostInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  slug: z.string().max(120).optional(),
  excerpt: z.string().max(500).default(""),
  content: z.string().max(200_000).default(""),
  topic: z.string().min(1).max(40).default("Politics"),
  read_minutes: z.number().int().min(1).max(120).default(6),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => savePostInput.parse(data))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);

    let existing: AdminPost | null = null;
    if (data.id) {
      const { data: found, error } = await context.supabase
        .from("posts")
        .select("*")
        .eq("id", data.id)
        .maybeSingle();
      if (error) throw new Error("Unable to load this post.");
      existing = (found as AdminPost | null) ?? null;
      if (!existing) throw new Error("That post no longer exists.");
    }

    const baseSlug = slugify(data.slug?.trim() || data.title) || "post";
    const wasPublished = existing?.status === "published";
    const willPublish = data.status === "published";
    const published_at =
      willPublish && !wasPublished
        ? new Date().toISOString()
        : existing?.published_at
          ? existing.published_at
          : null;

    const row = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      topic: data.topic,
      read_minutes: data.read_minutes,
      status: data.status,
      featured: data.featured,
      published_at,
    };

    if (data.id && existing) {
      const currentSlugMatches = baseSlug === slugify(existing.slug) || data.slug?.trim();
      const nextSlug = currentSlugMatches ? baseSlug : slugify(existing.slug);
      const { data: updated, error } = await context.supabase
        .from("posts")
        .update({ ...row, slug: nextSlug })
        .eq("id", data.id)
        .select()
        .single();
      if (error) {
        if (error.code === "23505") {
          const retry = await context.supabase
            .from("posts")
            .update({ ...row, slug: nextSlug + "-" + Math.random().toString(36).slice(2, 6) })
            .eq("id", data.id)
            .select()
            .single();
          if (retry.error) throw new Error("Couldn't save — try a different title.");
          return (retry.data as AdminPost).slug;
        }
        throw new Error("Couldn't save the post. Try again.");
      }
      return (updated as AdminPost).slug;
    }

    const { data: inserted, error } = await context.supabase
      .from("posts")
      .insert({ ...row, slug: baseSlug })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") {
        const retry = await context.supabase
          .from("posts")
          .insert({ ...row, slug: baseSlug + "-" + Math.random().toString(36).slice(2, 6) })
          .select()
          .single();
        if (retry.error) throw new Error("Couldn't save — try a different title.");
        return (retry.data as AdminPost).slug;
      }
      throw new Error("Couldn't save the post. Try again.");
    }
    return (inserted as AdminPost).slug;
  });

export const setPostStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: string }) =>
    z.object({ id: z.string().uuid(), status: z.enum(["draft", "published"]) }).parse(data),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("posts")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Couldn't update the status. Try again.");
    return { ok: true as const };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error("Couldn't delete the post. Try again.");
    return { ok: true as const };
  });

export type Profile = {
  display_name: string;
  bio: string;
  avatar_url: string | null;
};

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Profile> => {
    const { data } = await context.supabase
      .from("profiles")
      .select("display_name, bio, avatar_url")
      .eq("id", context.userId)
      .maybeSingle();
    return (
      (data as Profile | null) ?? { display_name: "Tara Martin", bio: "", avatar_url: null }
    );
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { display_name: string; bio: string }) =>
    z
      .object({
        display_name: z.string().min(1).max(80),
        bio: z.string().max(600),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("profiles").upsert({
      id: context.userId,
      display_name: data.display_name,
      bio: data.bio,
    });
    if (error) throw new Error("Couldn't save your profile. Try again.");
    return { ok: true as const };
  });
