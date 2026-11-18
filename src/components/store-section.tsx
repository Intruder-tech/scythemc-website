"use client";

import { useState } from "react";
import {
  Check,
  Coins,
  Crown,
  Egg,
  KeyRound,
  Medal,
  Package,
  Pickaxe,
  Shield,
  ShieldHalf,
  Skull,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DISCORD_URL, TICKET_URL } from "@/lib/site";

/* Tier styles — every value is a logo color. */
const TIERS = {
  azure: {
    band: "bg-azure text-frost",
    tick: "text-azure",
    card: "border-ink-700 bg-ink-900",
    button: "azure" as const,
  },
  gold: {
    band: "bg-gold text-ink-950",
    tick: "text-gold",
    card: "border-ink-700 bg-ink-900",
    button: "gold" as const,
  },
  scythe: {
    band: "bg-cyan text-ink-950",
    tick: "text-cyan",
    card: "border-cyan bg-royal",
    button: "cyan" as const,
  },
  custom: {
    band: "bg-ember text-frost",
    tick: "text-gold",
    card: "border-gold bg-ink-800",
    button: "gold" as const,
  },
};

/** ₹1,749 style grouping. */
const inr = (n: number) => n.toLocaleString("en-IN");

type Tier = keyof typeof TIERS;

const ranks: {
  name: string;
  price: number;
  tier: Tier;
  icon: typeof Shield;
  tag?: string;
  /** Price period label; omitted = "/ month". */
  period?: string;
  stats: [string, string][];
  perks: string[];
}[] = [
  {
    name: "VIP",
    price: 199,
    tier: "azure",
    icon: Shield,
    stats: [["Homes", "3"], ["Shard boosters", "4×"], ["Crate", "1× Nova"], ["Perks", "Kit rewards"]],
    perks: ["4× Shard Booster", "1× Nova Crate", "Perks and kit rewards", "Access to 3 homes"],
  },
  {
    name: "VIP+",
    price: 399,
    tier: "azure",
    icon: ShieldHalf,
    stats: [["Homes", "3"], ["Shard boosters", "4×"], ["Crate", "2× Nova"], ["Perks", "Kit rewards"]],
    perks: ["4× Shard Booster", "2× Nova Crate", "Perks and kit rewards", "Access to 3 homes"],
  },
  {
    name: "MVP",
    price: 499,
    tier: "gold",
    icon: Trophy,
    stats: [["Homes", "4"], ["Shard boosters", "4×"], ["Crate key", "1× Omega"], ["Perks", "Kit rewards"]],
    perks: ["4× Shard Booster", "1× Omega Crate key", "Perks and kit rewards", "Access to 4 homes"],
  },
  {
    name: "MVP+",
    price: 999,
    tier: "gold",
    icon: Medal,
    tag: "Most popular",
    stats: [["Homes", "4"], ["Shard boosters", "4×"], ["Crate keys", "2× Omega"], ["Perks", "Special kits"]],
    perks: ["4× Shard Booster", "2× Omega Crate key", "Special perks and kits", "Access to 4 homes"],
  },
  {
    name: "The Scythe",
    price: 1299,
    tier: "scythe",
    icon: Crown,
    tag: "Ultimate",
    stats: [["Homes", "5"], ["Shard boosters", "4×"], ["Crate key", "1× Titan X"], ["Perks", "Special kits"]],
    perks: ["4× Shard Booster", "1× Titan X Crate key", "Special perks and kits", "Access to 5 homes"],
  },
  {
    name: "Custom Rank",
    price: 1749,
    tier: "custom",
    icon: Sparkles,
    tag: "Your name",
    stats: [["Homes", "5"], ["Shard boosters", "4×"], ["Crate key", "1× Predator X"], ["Rank name", "You choose"]],
    perks: ["4× Shard Booster", "1× Predator X Crate key", "Rank with any custom name", "Access to 5 homes"],
  },
];

/* Crates: each accent is a logo color, with its own darker bevel. */
const CRATES: {
  name: string;
  price: number;
  face: string;
  tag?: string;
  featured?: boolean;
  contents: string[];
}[] = [
  {
    name: "Nova Crate",
    price: 149,
    face: "bg-azure text-frost shadow-[0_4px_0_var(--color-royal)]",
    contents: ["Exclusive rewards", "Netherite Kit"],
  },
  {
    name: "Omega Crate",
    price: 399,
    face: "bg-cyan text-ink-950 shadow-[0_4px_0_var(--color-azure)]",
    contents: ["2× Netherite Kits", "Special Shulker kits", "Maxed enchanted stuff"],
  },
  {
    name: "Titan X Crate",
    price: 899,
    face: "bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)]",
    contents: ["2× Omega Crate barrels", "Unique kits", "Maxed armours and stuff"],
  },
  {
    name: "Predator X Crate",
    price: 1399,
    face: "bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)]",
    tag: "Top tier",
    featured: true,
    contents: ["3× Omega Crate barrels", "Armour and Redstone kits", "Maxed stuff and weapons"],
  },
  {
    name: "Redstone Crate",
    price: 79,
    face: "bg-ember text-frost shadow-[0_4px_0_#9c2c06]",
    contents: ["Full Redstone kit", "Kit to make any farm"],
  },
  {
    name: "Elytra Crate",
    price: 99,
    face: "bg-frost text-ink-950 shadow-[0_4px_0_var(--color-mist)]",
    tag: "Rare item",
    contents: ["1× Elytra", "Rare item"],
  },
];

const spawners = [
  {
    group: "Mob spawners",
    icon: Skull,
    items: [
      { name: "Skeleton Spawner", price: 10, perks: ["Bone meal farms", "Endless arrows & bows", "XP grinder ready"] },
      { name: "Creeper Spawner", price: 15, perks: ["Gunpowder farms", "Rockets for elytra", "TNT stockpiles"] },
      { name: "Iron Golem Spawner", price: 20, tag: "Top pick", perks: ["Iron farm engine", "Endless ingots", "Run the economy"] },
    ],
  },
  {
    group: "Spawn eggs",
    icon: Egg,
    items: [
      { name: "Villager Spawn Egg", price: 50, perks: ["Trading halls", "Roll Mending librarians", "Crop & iron farms"] },
      { name: "Zombie Spawn Egg", price: 50, perks: ["Cure for 1-emerald trades", "Zombie XP grinders", "Pairs with villagers"] },
    ],
  },
];

const crates = [
  { name: "Spawner Key", inr: 19, coins: 39, desc: "High-tier mob spawners, blaze rods and rare farming resources." },
  { name: "Party Key", inr: 39, coins: 59, desc: "Server-wide party rewards, boosters, particle crowns and buffs." },
  { name: "Xavien Key", inr: 79, coins: 99, desc: "Netherite sets with custom Xavien enchants and extended vault passes." },
  { name: "Prime Key", inr: 99, coins: 129, tag: "Most powerful", desc: "Legendary Scythe blades, rank vouchers and cash-prize lottery tokens." },
];

const rewards = [
  { icon: Pickaxe, title: "Powerful tools", desc: "3x3 trench pickaxes, auto-smelt shovels, vorpal blades and custom scythes." },
  { icon: Skull, title: "Valuable spawners", desc: "Blaze, Iron Golem, Warden and Netherite spawners to build an empire." },
  { icon: Coins, title: "INR cash prizes", desc: "Real cash paid by UPI / Paytm to champions and weekly leaderboard holders." },
];

const TABS = ["Ranks", "Crates", "Spawners & eggs", "Crate keys", "Tournaments"] as const;
type Tab = (typeof TABS)[number];

function Tag({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span
      className={`absolute -top-3 right-4 rounded-full border-2 border-ink-950 px-3 py-0.5 font-pixel text-[10px] uppercase ${className}`}
    >
      {children}
    </span>
  );
}

function BuyButton({ price, variant }: { price: number; variant: "gold" | "azure" | "cyan" | "outline" }) {
  return (
    <Button asChild variant={variant} size="sm" className="mt-auto w-full">
      <a href={TICKET_URL} target="_blank" rel="noopener noreferrer">Buy · ₹{inr(price)}</a>
    </Button>
  );
}

function CratesTab() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {CRATES.map((c) => (
        <article
          key={c.name}
          className={`relative flex flex-col gap-4 rounded-xl border-2 p-6 shadow-[0_6px_0_var(--color-ink-950)] ${
            c.featured ? "border-cyan bg-royal" : "border-ink-700 bg-ink-900"
          }`}
        >
          {c.tag && <Tag className={c.featured ? "bg-gold text-ink-950" : "bg-cyan text-ink-950"}>{c.tag}</Tag>}
          <div className="flex items-center justify-between gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink-950 ${c.face}`}>
              <Package className="h-6 w-6" />
            </div>
            <p className="font-display text-3xl leading-none">
              <span className="text-gold">₹</span>
              {inr(c.price)}
            </p>
          </div>
          <h3 className="font-display text-2xl tracking-wide">{c.name}</h3>
          <ul className="flex flex-col gap-2">
            {c.contents.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
          <BuyButton price={c.price} variant={c.featured ? "gold" : "outline"} />
        </article>
      ))}
    </div>
  );
}

function Ranks() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ranks.map((r) => {
        const t = TIERS[r.tier];
        return (
          <article
            key={r.name}
            className={`relative flex flex-col overflow-visible rounded-xl border-2 shadow-[0_6px_0_var(--color-ink-950)] ${t.card}`}
          >
            {r.tag && <Tag className={r.tier === "scythe" ? "bg-gold text-ink-950" : "bg-cyan text-ink-950"}>{r.tag}</Tag>}
            <header className={`flex items-center gap-2 rounded-t-[10px] border-b-2 border-ink-950 px-5 py-3 ${t.band}`}>
              <r.icon className="h-5 w-5" />
              <h3 className="font-display text-xl uppercase tracking-wide">{r.name}</h3>
            </header>
            <div className="flex flex-1 flex-col gap-5 p-5">
              <p className="flex items-baseline gap-1">
                <span className="font-display text-2xl text-gold">₹</span>
                <span className="font-display text-5xl leading-none">{inr(r.price)}</span>
                {(r.period ?? "/ month") && <span className="ml-1 text-sm text-mist">{r.period ?? "/ month"}</span>}
              </p>
              <dl className="grid grid-cols-2 gap-2">
                {r.stats.map(([k, v]) => (
                  <div key={k} className="rounded-md border-2 border-ink-950/60 bg-ink-950/50 px-2.5 py-1.5">
                    <dt className="text-[11px] text-mist">{k}</dt>
                    <dd className="text-sm font-extrabold">{v}</dd>
                  </div>
                ))}
              </dl>
              <ul className="flex flex-col gap-2">
                {r.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm leading-snug">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.tick}`} strokeWidth={3} />
                    {p}
                  </li>
                ))}
              </ul>
              <BuyButton price={r.price} variant={t.button} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Spawners() {
  return (
    <div className="flex flex-col gap-12">
      {spawners.map((g) => (
        <div key={g.group}>
          <h3 className="mb-5 flex items-center gap-2 font-display text-2xl uppercase tracking-wide">
            <g.icon className="h-6 w-6 text-azure" />
            {g.group}
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((s) => {
              const featured = "tag" in s && s.tag;
              return (
                <article
                  key={s.name}
                  className={`relative flex flex-col gap-4 rounded-xl border-2 p-6 shadow-[0_6px_0_var(--color-ink-950)] ${
                    featured ? "border-gold bg-ink-800" : "border-ink-700 bg-ink-900"
                  }`}
                >
                  {featured && <Tag className="bg-gold text-ink-950">{s.tag}</Tag>}
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-display text-2xl tracking-wide">{s.name}</h4>
                    <p className="font-display text-3xl leading-none">
                      <span className="text-gold">₹</span>
                      {s.price}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {s.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" strokeWidth={3} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <BuyButton price={s.price} variant={featured ? "gold" : "outline"} />
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Crates() {
  return (
    <div>
      <p className="mb-8 max-w-2xl text-mist">
        Buy crate keys with rupees or redeem them with the coins you earn in-game.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {crates.map((c) => (
          <article
            key={c.name}
            className={`relative flex flex-col gap-4 rounded-xl border-2 p-6 shadow-[0_6px_0_var(--color-ink-950)] ${
              c.tag ? "border-cyan bg-royal" : "border-ink-700 bg-ink-900"
            }`}
          >
            {c.tag && <Tag className="bg-gold text-ink-950">{c.tag}</Tag>}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink-950 bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)]">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl tracking-wide">{c.name}</h3>
            <p className="text-sm leading-relaxed text-mist">{c.desc}</p>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <Button asChild variant="gold" size="sm">
                <a href={TICKET_URL} target="_blank" rel="noopener noreferrer">₹{c.inr}</a>
              </Button>
              <Button asChild variant="outline" size="sm" className="normal-case">
                <a href={TICKET_URL} target="_blank" rel="noopener noreferrer">
                  <Coins className="h-4 w-4 text-gold" />
                  {c.coins}
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Tournaments() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-xl border-2 border-ink-950 bg-gold p-6 text-ink-950 shadow-[0_6px_0_var(--color-ember)] md:flex-row md:items-center md:p-8">
        <div>
          <p className="font-pixel text-xs">NEXT MAJOR EVENT</p>
          <h3 className="mt-1 font-display text-3xl uppercase tracking-wide md:text-4xl">
            Scythe Cup · Sunday 8:00 PM IST
          </h3>
          <p className="mt-2 font-bold">
            Entry 150 in-game coins · Prize pool ₹5,000 + 3× Ascended Kits
          </p>
        </div>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg border-2 border-ink-950 bg-ink-950 px-6 font-display uppercase tracking-wide text-gold transition-transform active:translate-y-1"
        >
          <Swords className="h-5 w-5" />
          Register on Discord
        </a>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {rewards.map((r) => (
          <article
            key={r.title}
            className="rounded-xl border-2 border-ink-700 bg-ink-900 p-6 shadow-[0_6px_0_var(--color-ink-950)]"
          >
            <r.icon className="mb-4 h-7 w-7 text-cyan" />
            <h4 className="mb-2 font-display text-2xl tracking-wide">{r.title}</h4>
            <p className="text-sm leading-relaxed text-mist">{r.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function StoreSection() {
  const [tab, setTab] = useState<Tab>("Ranks");

  return (
    <section id="store" className="border-b-2 border-ink-800 py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-pixel text-xs text-gold">OFFICIAL SERVER STORE</p>
            <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
              Equip your arsenal
            </h2>
            <p className="mt-4 text-mist">
              UPI, GPay, Paytm and PhonePe accepted. Use code <strong className="text-gold">SCYTHE20</strong> for
              20% off during Season 1.
            </p>
          </div>
        </div>

        <div role="tablist" aria-label="Store categories" className="mb-12 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`h-11 rounded-lg border-2 px-5 font-display uppercase tracking-wide transition-colors ${
                tab === t
                  ? "border-ink-950 bg-azure text-frost shadow-[0_3px_0_var(--color-royal)]"
                  : "border-ink-700 bg-ink-900 text-mist hover:border-azure hover:text-frost"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div role="tabpanel">
          {tab === "Ranks" && <Ranks />}
          {tab === "Crates" && <CratesTab />}
          {tab === "Spawners & eggs" && <Spawners />}
          {tab === "Crate keys" && <Crates />}
          {tab === "Tournaments" && <Tournaments />}
        </div>
      </div>
    </section>
  );
}
