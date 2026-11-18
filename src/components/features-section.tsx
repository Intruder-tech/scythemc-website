import { Shield, Trophy, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    accent: "bg-azure text-frost shadow-[0_4px_0_var(--color-royal)]",
    title: "Zero-tolerance anti-cheat",
    desc: "Custom anti-cheat filters out combat hacks, macros and movement exploits so every fight is fair.",
  },
  {
    icon: Trophy,
    accent: "bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)]",
    title: "INR cash & spawner tournaments",
    desc: "Enter with in-game coins and compete for real rupee prizes, high-yield spawners and champion scythes.",
  },
  {
    icon: Zap,
    accent: "bg-cyan text-ink-950 shadow-[0_4px_0_var(--color-azure)]",
    title: "Fast rank delivery",
    desc: "Ranks, prefixes, cosmetics and kit permissions land in-game as soon as your ticket is verified.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="border-b-2 border-ink-800 bg-ink-900 py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="font-pixel text-xs text-gold">BUILT FOR CHAMPIONS</p>
          <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
            Why play on Scythe MC?
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-xl border-2 border-ink-700 bg-ink-950 p-7 shadow-[0_6px_0_var(--color-ink-950)] transition-transform hover:-translate-y-1"
            >
              <div
                className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink-950 ${f.accent}`}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-2xl tracking-wide">{f.title}</h3>
              <p className="leading-relaxed text-mist">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
