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

export const sendNewsletter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { subject: string; content: string }) =>
    z.object({
      subject: z.string().min(1).max(200),
      content: z.string().min(1).max(100000),
    }).parse(data),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) throw new Error("Email service not configured. Add RESEND_API_KEY.");

    const { data: subscribers, error } = await context.supabase
      .from("newsletter_subscribers")
      .select("email");

    if (error) throw new Error("Couldn't load subscribers.");
    if (!subscribers || subscribers.length === 0) {
      throw new Error("No subscribers to email yet.");
    }

    const emails = subscribers.map((s: { email: string }) => s.email);
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        const resp = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiKey,
          },
          body: JSON.stringify({
            from: "Decorum Denied <notifications@decorumdenied.com>",
            to: email,
            subject: data.subject,
            html: data.content,
          }),
        });
        if (resp.ok) {
          sent++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    return { sent, failed, total: emails.length };
  });
