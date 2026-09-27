import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createPublicSupabaseClient } from "./supabase-public.server";

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) =>
    z.object({ email: z.string().email().max(320) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = createPublicSupabaseClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email: data.email.toLowerCase() }, { onConflict: "email" });
    if (error) return { ok: false as const, error: "Couldn't save that right now. Try again." };
    return { ok: true as const };
  });
