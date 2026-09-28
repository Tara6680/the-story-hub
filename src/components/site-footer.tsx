import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter.functions";

const inputCls =
  "w-full rounded-[10px] border border-input bg-ink-soft px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

export function SiteFooter() {
  const subscribe = useServerFn(subscribeToNewsletter);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("busy");
    const result = await subscribe({ data: { email: email.trim() } });
    if (result.ok) {
      setState("done");
      setEmail("");
    } else {
      setState("error");
    }
  }

  return (
    <footer id="newsletter" className="mt-14 border-t border-line/70 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-[46ch]">
          <h3 className="font-display text-2xl uppercase leading-[0.9] tracking-tight text-foreground">
            Get the next issue
            <br />
            in your inbox.
          </h3>
          <p className="mt-2 text-sm text-pretty text-muted-foreground">
            No spam, no algorithms, no decorum.
          </p>
          {state === "done" ? (
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-accent-2">
              Noted. You're on the list.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={inputCls}
              />
              <button
                type="submit"
                disabled={state === "busy"}
                className="w-full rounded-[10px] bg-primary py-3 font-display text-base uppercase tracking-tight text-primary-foreground transition-colors hover:bg-accent-2 disabled:opacity-50 sm:w-auto sm:px-8"
              >
                {state === "busy" ? "Signing…" : "Subscribe"}
              </button>
              {state === "error" ? (
                <p className="font-mono text-xs text-destructive">
                  Couldn't save that. Try again.
                </p>
              ) : null}
            </form>
          )}
        </div>
        <div className="mt-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          <span>© 2026 Decorum Denied</span>
          <span>Printed with ink</span>
        </div>
      </div>
    </footer>
  );
}
