import { createClient } from "@supabase/supabase-js";

export function createPublicSupabaseClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  
  console.log("SUPABASE_URL:", url ? "found" : "MISSING");
  console.log("SUPABASE_PUBLISHABLE_KEY:", key ? "found" : "MISSING");
  
  if (!url || !key) {
    console.log("Available env keys:", Object.keys(process.env).filter(k => k.includes("SUPABASE")).join(", "));
  }
  
  return createClient(url || "", key || "", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: undefined,
    },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key && key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        if (key) headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
