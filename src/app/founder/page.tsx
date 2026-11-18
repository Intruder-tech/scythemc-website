import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Coins, Gamepad2, Gem, HeartPulse, Rocket, Store, Swords } from "lucide-react";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import SkinCharacter from "@/components/skin-character";
import BrandIcon, { type Brand } from "@/components/brand-icon";
import { FOUNDER, SERVER_HOST } from "@/lib/site";

export const metadata: Metadata = {
  title: "Founder • Scythe MC",
  description: "Meet the founder of Scythe MC, a proper economy Minecraft server with events and more.",
  alternates: { canonical: "/founder" },
};

const ROADMAP = [
  {
    icon: Gamepad2,
    title: "Custom game modes",
    desc: "Original modes built in-house by the Scythe team, made for our community.",
    face: "bg-azure text-frost shadow-[0_4px_0_var(--color-royal)]",
  },
  {
    icon: HeartPulse,
    title: "Higher Lifesteal",
    desc: "A bigger, tougher Lifesteal with higher stakes for every fight.",
    face: "bg-ember text-frost shadow-[0_4px_0_#9c2c06]",
  },
  {
    icon: Swords,
    title: "Hitsteal",
    desc: "A brand-new Hitsteal mode where every hit you land counts.",
    face: "bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)]",
  },
  {
    icon: Rocket,
    title: "And much more",
    desc: "New seasons, bigger events and surprises. Follow the founder to hear first.",
    face: "bg-cyan text-ink-950 shadow-[0_4px_0_var(--color-azure)]",
  },
];

// Deterministic spark positions around the founder (same on server and client).
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  left: `${8 + ((i * 37) % 84)}%`,
  delay: `${(i * 0.53) % 4}s`,
  duration: `${3.2 + ((i * 7) % 5) * 0.4}s`,
  color: i % 3 === 0 ? "var(--color-cyan)" : "var(--color-gold)",
}));

const SOCIALS: { brand: Brand; label: string; handle: string; url: string; face: string }[] = [
  {
    brand: "instagram",
    label: "Instagram",
    handle: FOUNDER.instagram.handle,
    url: FOUNDER.instagram.url,
    face: "bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)]",
  },
  {
    brand: "youtube",
    label: "YouTube",
    handle: FOUNDER.youtube.handle,
    url: FOUNDER.youtube.url,
    face: "bg-ember text-frost shadow-[0_4px_0_#9c2c06]",
  },
  {
    brand: "discord",
    label: "Discord",
    handle: FOUNDER.discord.handle,
    url: FOUNDER.discord.url,
    face: "bg-azure text-frost shadow-[0_4px_0_var(--color-royal)]",
  },
];

const PILLARS = [
  {
    icon: Coins,
    title: "A proper economy",
    desc: "Earn coins, trade on the auction house, run shops and build spawner farms. Prices are set by players, not by admins.",
    face: "bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)]",
  },
  {
    icon: CalendarDays,
    title: "Events every week",
    desc: "Tournaments, the Scythe Cup and community events with in-game loot and real INR cash prizes.",
    face: "bg-azure text-frost shadow-[0_4px_0_var(--color-royal)]",
  },
  {
    icon: Gem,
    title: "And more",
    desc: "Ranks, crate keys, fair-play anti-cheat, and Java & Bedrock support on one network.",
    face: "bg-cyan text-ink-950 shadow-[0_4px_0_var(--color-azure)]",
  },
];

export default function FounderPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero: waving character + intro */}
        <section className="border-b-2 border-ink-800">
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1fr_1.1fr]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px]">
              {/* pedestal */}
              <div className="absolute inset-x-[6%] bottom-0 top-[18%] rounded-[48%] border-2 border-ink-800 bg-ink-900" />
              <div className="absolute inset-x-[18%] bottom-[8%] top-[34%] rounded-[48%] border-2 border-ink-700 bg-ink-800" />
              {/* slow-turning aura + rising sparks */}
              <div className="founder-aura pointer-events-none absolute inset-x-[10%] bottom-[2%] top-[22%] rounded-full opacity-60" />
              {SPARKS.map((sp, i) => (
                <span
                  key={i}
                  className="founder-spark pointer-events-none absolute bottom-[10%] h-1.5 w-1.5"
                  style={{ left: sp.left, background: sp.color, animationDelay: sp.delay, animationDuration: sp.duration }}
                />
              ))}
              <div className="absolute inset-0">
                <SkinCharacter
                  name={FOUNDER.name}
                  cape
                  capeLogo="/logo.webp"
                  lines={["HEY, WELCOME TO SCYTHE MC!", "GRAB A RANK, JOIN THE FUN!", "NEW GAME MODES INCOMING!", "SEE YOU IN-GAME!"]}
                />
              </div>
            </div>

            <div className="flex flex-col items-start gap-6">
              <span className="rounded-full border-2 border-ink-950 bg-gold px-3 py-1 font-pixel text-[11px] text-ink-950 shadow-[0_3px_0_var(--color-ember)]">
                ★ FOUNDER &amp; OWNER
              </span>
              <h1 className="logo-type font-display text-6xl uppercase leading-none tracking-wide text-frost sm:text-7xl">
                {FOUNDER.name}
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-mist">
                The founder of <strong className="text-frost">Scythe MC</strong>, a proper economy server that hosts
                events and more. Say hi on any of the channels below.
              </p>
              <div className="flex flex-wrap gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.brand}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} ${s.handle}`}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink-950 transition-transform active:translate-y-1 active:shadow-none ${s.face}`}
                  >
                    <BrandIcon brand={s.brand} className="h-6 w-6" />
                  </a>
                ))}
              </div>
              <p className="font-pixel text-[11px] text-dim">MOVE YOUR CURSOR · CLICK HIM · DRAG TO SEE HIS CAPE</p>
            </div>
          </div>
        </section>

        {/* About the server */}
        <section className="border-b-2 border-ink-800 bg-ink-900 py-20">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <p className="font-pixel text-xs text-gold">THE SERVER</p>
            <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
              What is Scythe MC?
            </h2>
            <p className="mt-4 max-w-2xl text-mist">
              Scythe MC is a proper economy server. Everything you own, you earned or traded for, and the calendar
              is packed with events that keep the server alive.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {PILLARS.map((p) => (
                <article
                  key={p.title}
                  className="rounded-xl border-2 border-ink-700 bg-ink-950 p-7 shadow-[0_6px_0_var(--color-ink-950)]"
                >
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink-950 ${p.face}`}
                  >
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-display text-2xl tracking-wide">{p.title}</h3>
                  <p className="leading-relaxed text-mist">{p.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="border-b-2 border-ink-800 py-20">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="font-pixel text-xs text-gold">THE STORY</p>
              <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
                Why Scythe exists
              </h2>
            </div>
            <div className="flex flex-col gap-5 text-lg leading-relaxed text-mist">
              <p>
                Scythe MC started with a simple idea: a Minecraft server where the economy is real, the events are
                worth showing up for, and every player gets a fair fight.
              </p>
              <p>
                Everything you own on Scythe, you earned or traded for. Ranks, crates and spawners help you get going,
                but the auction house, player shops and weekly events are what keep the world alive.
              </p>
              <p>
                The goal hasn&apos;t changed since day one: keep building, keep listening to the community, and make
                Scythe the server people tell their friends about.
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="border-b-2 border-ink-800 bg-ink-900 py-20">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <p className="font-pixel text-xs text-gold">WHAT&apos;S NEXT</p>
            <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
              Coming to Scythe
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ROADMAP.map((r) => (
                <article
                  key={r.title}
                  className="relative rounded-xl border-2 border-ink-700 bg-ink-950 p-6 shadow-[0_6px_0_var(--color-ink-950)]"
                >
                  <span className="absolute right-4 top-4 rounded-full border-2 border-ink-700 px-2 py-0.5 font-pixel text-[9px] text-cyan">
                    INCOMING
                  </span>
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink-950 ${r.face}`}>
                    <r.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-display text-2xl tracking-wide">{r.title}</h3>
                  <p className="leading-relaxed text-mist">{r.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Socials */}
        <section className="border-b-2 border-ink-800 py-20">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <p className="font-pixel text-xs text-gold">STAY CONNECTED</p>
            <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
              Follow the founder
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.brand}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 rounded-xl border-2 border-ink-700 bg-ink-900 p-6 shadow-[0_6px_0_var(--color-ink-950)] transition-[transform,border-color] hover:-translate-y-1 hover:border-azure"
                >
                  <span
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-ink-950 ${s.face}`}
                  >
                    <BrandIcon brand={s.brand} className="h-8 w-8" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl tracking-wide">{s.label}</span>
                    <span className="block truncate text-mist group-hover:text-cyan">{s.handle}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Back to the game */}
        <section className="py-16">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
            <div>
              <h2 className="logo-type-gold font-display text-4xl uppercase tracking-wide">Ready to play?</h2>
              <p className="mt-2 font-pixel text-sm text-mist">{SERVER_HOST.toUpperCase()}</p>
            </div>
            <Link
              href="/#store"
              className="inline-flex h-14 items-center gap-2 rounded-lg border-2 border-ink-950 bg-gold px-8 font-display text-lg uppercase tracking-wide text-ink-950 shadow-[0_4px_0_var(--color-ember)] transition-transform hover:bg-sun active:translate-y-1 active:shadow-none"
            >
              <Store className="h-5 w-5" />
              Visit store
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
