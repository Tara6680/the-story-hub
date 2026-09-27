import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span aria-hidden className="inline-block size-2.5 bg-primary" />
          <span className="font-display text-lg leading-none tracking-tight text-foreground">
            DECORUM DENIED
          </span>
        </Link>
        <nav className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:gap-4">
          <Link to="/" className="transition-colors hover:text-primary">
            Write-ups
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            About
          </Link>
          <Link to="/" hash="newsletter" className="text-primary">
            Subscribe
          </Link>
          <Link to="/auth" className="text-foreground/40 transition-colors hover:text-primary">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
