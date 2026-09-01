export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-24">
      <p
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: "var(--fg-soft)" }}
      >
        Scaffold ready
      </p>

      <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
        Waiting on the deck.
      </h1>

      <p
        className="mt-6 max-w-xl text-lg leading-relaxed"
        style={{ color: "var(--fg-soft)" }}
      >
        Next.js App Router, TypeScript, and Tailwind are wired up and building.
        This page gets replaced with real content once the pitch deck and
        instructions arrive.
      </p>

      <div
        className="mt-12 rounded-xl border p-6"
        style={{ borderColor: "var(--line)", background: "var(--bg-soft)" }}
      >
        <h2 className="text-sm font-semibold">What is already here</h2>
        <ul
          className="mt-3 space-y-1.5 text-sm"
          style={{ color: "var(--fg-soft)" }}
        >
          <li>Next.js 15 with the App Router</li>
          <li>TypeScript in strict mode</li>
          <li>Tailwind CSS v4, light and dark aware</li>
          <li>Zero-config Vercel deploy</li>
        </ul>
      </div>
    </main>
  );
}
