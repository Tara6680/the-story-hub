import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Decorum Denied" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignInPage,
});

const inputCls =
  "w-full rounded-[10px] border border-input bg-ink-soft px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setError(
        error.message === "Invalid login credentials"
          ? "Wrong email or password."
          : "Sign-in failed. Try again in a moment.",
      );
      return;
    }
    await navigate({ to: "/admin" });
  }

  return (
    <div className="diag relative flex min-h-screen flex-col items-center justify-center px-4 text-foreground antialiased">
      <div aria-hidden className="diag-lines pointer-events-none absolute inset-0 opacity-60" />
      <div className="glass relative z-10 w-full max-w-sm rounded-[14px] p-6">
        <Link to="/" className="flex items-center gap-2">
          <span aria-hidden className="inline-block size-2.5 bg-primary" />
          <span className="font-display text-base leading-none tracking-tight">
            DECORUM DENIED
          </span>
        </Link>

        <h1 className="font-display mt-6 text-3xl uppercase leading-[0.9] tracking-tight">
          Backstage
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The editing desk. Only the writer gets in.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full rounded-[10px] bg-primary py-3 font-display text-base uppercase tracking-tight text-primary-foreground transition-colors hover:bg-accent-2 disabled:opacity-50"
          >
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          ← <Link to="/" className="hover:text-primary">Back to the site</Link>
        </p>
      </div>
    </div>
  );
}
