export function AuthorStrip() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6">
      <div className="glass flex items-center gap-4 rounded-[14px] p-5">
        <div
          aria-hidden
          className="grid size-16 shrink-0 place-items-center rounded-[10px] border border-line bg-ink-soft"
        >
          <span className="font-display text-xl text-primary">TM</span>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent-2">
            The author
          </p>
          <p className="font-display mt-1 text-lg uppercase tracking-tight text-foreground">
            Tara Martin
          </p>
          <p className="mt-1 text-sm text-pretty text-muted-foreground">
            Trans writer. Writes about power, protest, and the politics of being visible.
          </p>
        </div>
      </div>
    </section>
  );
}
