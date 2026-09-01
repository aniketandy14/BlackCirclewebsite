import Link from "next/link";
import { formatBytes, formatDate, getLatestBuild } from "@/lib/blob";

const YOUTUBE_ID = "YHYQ45dUZjo";

// The download panel reflects whatever is in the Blob store, so the page is
// re-rendered on a short interval rather than frozen at build time.
export const revalidate = 30;

export default async function Home() {
  const build = await getLatestBuild();

  return (
    <>
      <Nav />

      <main>
        <Hero build={build} />
        <Gameplay />
        <Product />
        <Experience />
        <Differentiation />
        <Prototype build={build} />
        <Business />
        <Roadmap />
        <Founder />
        <DownloadCta build={build} />
      </main>

      <Footer />
    </>
  );
}

/* ---------------------------------------------------------------- primitives */

function Ring({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="var(--color-blood)"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function Section({
  id,
  index,
  label,
  title,
  lead,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blood">
          {index} / {label}
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {lead ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ash">
            {lead}
          </p>
        ) : null}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function Card({
  index,
  title,
  children,
}: {
  index?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-edge bg-surface p-6 transition-colors hover:border-blood/40">
      {index ? (
        <p className="text-xs font-semibold tabular-nums text-blood">{index}</p>
      ) : null}
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-ash">{children}</p>
    </div>
  );
}

type BuildInfoProp = Awaited<ReturnType<typeof getLatestBuild>>;

function DownloadButton({
  build,
  className = "",
}: {
  build: BuildInfoProp;
  className?: string;
}) {
  // No build uploaded yet: show an inert placeholder rather than sending the
  // visitor somewhere else.
  if (!build) {
    return (
      <span
        className={
          "inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-edge px-6 py-3.5 text-sm font-semibold text-dim " +
          className
        }
      >
        Build coming soon
      </span>
    );
  }

  return (
    <a
      href="/api/download"
      className={
        "inline-flex items-center gap-2.5 rounded-lg bg-blood px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 " +
        className
      }
    >
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 1.5v8.5M4.5 7L8 10.5 11.5 7M2 13.5h12" />
      </svg>
      Download build
      <span className="font-normal text-white/70">
        {formatBytes(build.size)}
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ sections */

function Nav() {
  const links = [
    ["Product", "product"],
    ["Prototype", "prototype"],
    ["Business", "business"],
    ["Roadmap", "roadmap"],
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-void/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <Ring className="h-6 w-6" />
          <span className="text-sm font-bold tracking-[0.16em]">
            BLACK CIRCLE
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={"#" + id}
              className="text-sm text-ash transition hover:text-chalk"
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="/api/download"
          className="rounded-lg border border-edge px-4 py-2 text-sm font-medium transition hover:border-blood hover:text-chalk"
        >
          Download
        </a>
      </nav>
    </header>
  );
}

function Hero({ build }: { build: BuildInfoProp }) {
  return (
    <section id="top" className="bg-grade">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pb-28 sm:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blood">
              Open-world crime thriller
            </p>

            <h1 className="mt-5 text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              BLACK
              <br />
              CIRCLE
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ash">
              A story-driven open world built around reactive law enforcement,
              combat, vehicles and layered narrative discovery.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <DownloadButton build={build} />
              <a
                href="#gameplay"
                className="inline-flex items-center gap-2 rounded-lg border border-edge px-6 py-3.5 text-sm font-semibold transition hover:border-blood"
              >
                Watch gameplay
              </a>
            </div>

            {build ? (
              <p className="mt-5 text-xs text-dim">
                {build.filename} &middot; updated {formatDate(build.uploadedAt)}
              </p>
            ) : (
              <p className="mt-5 text-xs text-dim">
                Public playable build, free to try.
              </p>
            )}
          </div>

          <div className="hidden justify-center lg:flex">
            <Ring className="h-72 w-72 opacity-90" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Gameplay() {
  return (
    <section id="gameplay" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blood">
          Gameplay
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          See it running.
        </h2>

        <div className="mt-10 overflow-hidden rounded-xl border border-edge bg-surface">
          <div className="relative w-full pt-[56.25%]">
            <iframe
              src={"https://www.youtube-nocookie.com/embed/" + YOUTUBE_ID}
              title="Black Circle gameplay"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Product() {
  return (
    <Section
      id="product"
      index="01"
      label="The product"
      title="What is Black Circle?"
      lead="A premium open-world crime thriller designed around player agency, pressure and narrative discovery."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card index="01" title="Open world">
          Explore a criminal city through driving, combat, missions and emergent
          situations.
        </Card>
        <Card index="02" title="Reactive wanted system">
          Police response becomes an active gameplay layer that changes how
          players move and take risks.
        </Card>
        <Card index="03" title="Layered story">
          The narrative is structured in layers, rewarding continued play as new
          motives, betrayals and connections are revealed.
        </Card>
      </div>

      <div className="mt-12 border-l-2 border-blood pl-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blood">
          Product vision
        </p>
        <p className="mt-3 max-w-3xl text-xl font-semibold leading-snug sm:text-2xl">
          Deliver a mid-budget open-world experience that feels expansive while
          keeping the core identity focused on crime, consequence and story.
        </p>
        <p className="mt-4 text-sm text-dim">
          Positioning: premium PC launch first; console expansion after core
          production.
        </p>
      </div>
    </Section>
  );
}

function Experience() {
  const pillars = [
    [
      "01",
      "Freedom",
      "Explore, drive, fight, improvise and choose how much risk to take.",
    ],
    [
      "02",
      "Pressure",
      "Your actions create consequences through the wanted system and police response.",
    ],
    [
      "03",
      "Curiosity",
      "The story reveals itself in layers; players discover motives and relationships over time.",
    ],
    [
      "04",
      "Payoff",
      "Narrative reveals reframe what the player thought they understood.",
    ],
  ] as const;

  return (
    <Section
      id="experience"
      index="02"
      label="Player experience"
      title="What keeps the player playing?"
      lead="Black Circle is designed around escalating pressure and layered discovery."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(([index, title, body]) => (
          <Card key={index} index={index} title={title}>
            {body}
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-edge bg-surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blood">
          The intended loop
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-semibold">
          {[
            "Explore",
            "take risks",
            "trigger consequences",
            "survive",
            "uncover another layer",
          ].map((step, i, all) => (
            <span key={step} className="flex items-center gap-3">
              {step}
              <span className="text-blood" aria-hidden="true">
                {i === all.length - 1 ? "↺" : "→"}
              </span>
            </span>
          ))}
        </p>
        <p className="mt-5 text-sm text-dim">
          Design principle: emergent gameplay creates stories; layered narrative
          gives those stories meaning.
        </p>
      </div>
    </Section>
  );
}

function Differentiation() {
  const points = [
    [
      "01",
      "Reactive wanted system",
      "Police pressure is part of the core loop. The player is constantly deciding whether to escalate, hide or keep moving.",
    ],
    [
      "02",
      "Layered narrative structure",
      "The story is built in layers. New information changes the meaning of earlier events, encouraging players to continue and reinterpret.",
    ],
    [
      "03",
      "Story and sandbox in one loop",
      "The open world gives freedom while the crime story gives direction, stakes and emotional context.",
    ],
    [
      "04",
      "Original IP built for a focused scale",
      "A distinctive crime IP that can deliver a large-feeling experience without trying to replicate AAA production economics.",
    ],
  ] as const;

  return (
    <Section
      id="differentiation"
      index="03"
      label="Differentiation"
      title="What makes Black Circle worth choosing?"
      lead="The differentiation is not one mechanic — it is the combination of a reactive world with a deliberately layered crime story."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {points.map(([index, title, body]) => (
          <Card key={index} index={index} title={title}>
            {body}
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm text-dim">
        Core belief: the strongest differentiator is the relationship between
        player freedom, systemic consequences and narrative reveals.
      </p>
    </Section>
  );
}

function Prototype({ build }: { build: BuildInfoProp }) {
  const features = [
    "Third-person character controller",
    "Combat and weapon wheel",
    "Enemy AI",
    "Vehicle entry / exit and driving",
    "Civilian traffic and vehicle AI",
    "Wanted / police response system",
    "Open-world map and mission content",
  ];

  return (
    <Section
      id="prototype"
      index="04"
      label="Proof of execution"
      title="The product already exists in playable form."
      lead="The prototype demonstrates the core systems and gives the project a tangible starting point."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border border-edge bg-surface p-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ash">
            Implemented in the current build
          </h3>
          <ul className="mt-5 space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blood"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-edge bg-surface p-8">
          <Ring className="h-12 w-12" />
          <h3 className="mt-5 text-lg font-semibold">Play it yourself</h3>
          <p className="mt-2 text-sm leading-relaxed text-ash">
            Black Circle has moved beyond concept into a working, publicly
            playable prototype.
          </p>

          <div className="mt-6">
            <DownloadButton build={build} className="w-full justify-center" />
          </div>
        </div>
      </div>
    </Section>
  );
}

function Business() {
  return (
    <Section
      id="business"
      index="05"
      label="Business & monetization"
      title="A premium product with optional long-tail content"
      lead="Monetization is designed to keep the core game simple and value-led."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card index="01" title="Primary model">
          Premium one-time purchase for the full game.
        </Card>
        <Card index="02" title="Post-launch">
          Optional story expansions and DLC if the audience supports them.
        </Card>
        <Card index="03" title="No pay-to-win">
          The commercial model does not depend on gameplay advantages being sold
          to players.
        </Card>
      </div>

      <div className="mt-12 border-l-2 border-blood pl-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blood">
          Why this fits the product
        </p>
        <p className="mt-3 max-w-3xl text-xl font-semibold leading-snug sm:text-2xl">
          Players pay for the world, story, systems and replay value rather than
          consumable advantages.
        </p>
        <p className="mt-4 text-sm text-dim">
          Revenue logic: premium launch first; expand the IP only when audience
          demand is proven.
        </p>
      </div>
    </Section>
  );
}

function Roadmap() {
  const phases = [
    [
      "Now",
      "Prototype validation",
      "Public build, player feedback, pitch and industry connections.",
    ],
    [
      "Next",
      "Pre-production",
      "Finalize scope, narrative structure, art direction and production plan.",
    ],
    [
      "Production",
      "Core build",
      "World expansion, missions, characters, vehicles, AI, audio and optimization.",
    ],
    [
      "Polish",
      "Release prep",
      "QA, performance, platform certification, marketing beats and launch readiness.",
    ],
  ] as const;

  return (
    <Section
      id="roadmap"
      index="06"
      label="Development roadmap"
      title="From playable prototype to full production"
      lead="The next phase is about turning a working foundation into a focused production pipeline."
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map(([stage, title, body], index) => (
          <li
            key={title}
            className={
              "rounded-xl border bg-surface p-6 " +
              (index === 0 ? "border-blood/50" : "border-edge")
            }
          >
            <p
              className={
                "text-xs font-semibold uppercase tracking-[0.18em] " +
                (index === 0 ? "text-blood" : "text-dim")
              }
            >
              {stage}
            </p>
            <h3 className="mt-3 text-base font-semibold">{title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ash">{body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-dim">
        <span className="font-semibold text-blood">Current focus:</span> validate
        the product, build the right network and prepare for the next production
        stage.
      </p>
    </Section>
  );
}

function Founder() {
  const strengths = [
    "Programming and gameplay systems",
    "Unity development",
    "Prototype direction",
    "Product vision and iteration",
  ];

  return (
    <Section
      id="founder"
      index="07"
      label="Founder"
      title="Built solo, from concept to playable prototype."
      lead="Black Circle is designed, programmed and directed by one developer."
    >
      <div className="rounded-xl border border-edge bg-surface p-8 sm:p-10">
        <div className="flex items-start gap-5">
          <Ring className="h-12 w-12 shrink-0" />
          <div>
            <h3 className="text-xl font-bold tracking-tight">Aniket Shintre</h3>
            <p className="mt-1 text-sm text-blood">
              Founder / Developer &mdash; solo
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {strengths.map((strength) => (
            <div key={strength} className="flex items-start gap-3 text-sm">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blood"
                aria-hidden="true"
              />
              {strength}
            </div>
          ))}
        </div>

        <p className="mt-8 border-t border-edge pt-6 text-sm leading-relaxed text-ash">
          Every system in the current build &mdash; the character controller,
          combat, enemy AI, driving, traffic and the wanted system &mdash; was
          built by one person. The project is a working demonstration that the
          concept holds up in practice, not only on paper.
        </p>
      </div>
    </Section>
  );
}

function DownloadCta({ build }: { build: BuildInfoProp }) {
  return (
    <section className="border-t border-edge bg-grade">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
        <Ring className="mx-auto h-14 w-14" />

        <h2 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
          From prototype to product.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ash">
          A playable foundation, a defined audience, a layered crime story and a
          clear path to a larger production.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <DownloadButton build={build} />
          <a
            href="#gameplay"
            className="inline-flex items-center gap-2 rounded-lg border border-edge px-6 py-3.5 text-sm font-semibold transition hover:border-blood"
          >
            Watch gameplay
          </a>
        </div>

        {build ? (
          <p className="mt-5 text-xs text-dim">
            {build.filename} &middot; {formatBytes(build.size)} &middot; updated{" "}
            {formatDate(build.uploadedAt)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-dim sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Ring className="h-5 w-5" />
          <span>Black Circle &mdash; Aniket Shintre</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={"https://www.youtube.com/watch?v=" + YOUTUBE_ID}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-ash"
          >
            Gameplay
          </a>
          <Link href="/admin" className="transition hover:text-ash">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
