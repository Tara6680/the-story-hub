import { Link, Outlet, redirect, useNavigate, createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const admin = await isAdmin();
    if (!admin) throw redirect({ to: "/" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <span aria-hidden className="inline-block size-2.5 bg-primary" />
            <span className="font-display text-lg leading-none tracking-tight">
              THE PRESSROOM
            </span>
          </Link>
          <nav className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:gap-4">
            <Link to="/admin" className="transition-colors hover:text-primary">
              Posts
            </Link>
            <Link to="/admin/profile" className="transition-colors hover:text-primary">
              Profile
            </Link>
            <Link to="/" className="transition-colors hover:text-primary">
              View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="text-primary transition-colors hover:text-accent-2"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
