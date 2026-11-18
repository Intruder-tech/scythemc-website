import { MessagesSquare } from "lucide-react";
import SkinCharacter from "@/components/skin-character";
import { LOOKS, type Look } from "@/lib/founder-skin-art";
import { DISCORD_URL } from "@/lib/site";

interface StaffMember {
  role: string;
  /** In-game name; shown under the role once known. */
  ign?: string;
  duty: string;
  /** Real skin in /public/skins/staff/; without it a painted character in `look` is used. */
  skinUrl?: string;
  look?: Look;
  badge: string;
  /** Cape cloth colour; every cape carries the SCYTHE MC logo on the back. */
  cape: string;
  lines: string[];
}

/*
 * To add a real skin: drop a 64x64 PNG in public/skins/staff/ and set `skinUrl`.
 * To show a name: set `ign`.
 */
const STAFF: StaffMember[] = [
  {
    role: "Admin",
    duty: "Keeps Scythe fair: handles reports, appeals and rule enforcement.",
    skinUrl: "/skins/staff/admin.png",
    badge: "bg-ember text-frost shadow-[0_3px_0_#9c2c06]",
    cape: "#a8320b",
    lines: ["PLAY FAIR, HAVE FUN!", "REPORT HACKERS ON DISCORD!"],
  },
  {
    role: "Developer",
    duty: "Builds the plugins, custom game modes and fixes behind the server.",
    look: LOOKS.developer,
    badge: "bg-cyan text-ink-950 shadow-[0_3px_0_var(--color-azure)]",
    cape: "#1c2350",
    lines: ["SHIPPING NEW FEATURES!", "FOUND A BUG? TELL ME!"],
  },
  {
    role: "Helper",
    duty: "Your first stop for questions, in-game and on Discord.",
    look: LOOKS.helper,
    badge: "bg-azure text-frost shadow-[0_3px_0_var(--color-royal)]",
    cape: "#0238c7",
    lines: ["NEED HELP? ASK ME!", "WELCOME TO SCYTHE!"],
  },
  {
    role: "Manager",
    duty: "Runs events, tournaments and the staff team.",
    look: LOOKS.manager,
    badge: "bg-gold text-ink-950 shadow-[0_3px_0_var(--color-ember)]",
    cape: "#13288a",
    lines: ["EVENTS EVERY WEEK!", "JOIN THE SCYTHE CUP!"],
  },
];

export default function StaffSection() {
  return (
    <section id="staff" className="border-b-2 border-ink-800 bg-ink-900 py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-pixel text-xs text-gold">THE TEAM</p>
            <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
              Meet the staff
            </h2>
            <p className="mt-4 text-mist">The people keeping Scythe MC running. Say hi, they&apos;ll wave back. Drag one to see their cape.</p>
          </div>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 self-start rounded-lg border-2 border-ink-700 bg-ink-950 px-6 font-display uppercase tracking-wide text-frost shadow-[0_4px_0_var(--color-ink-950)] transition-colors hover:border-azure hover:text-cyan md:self-auto"
          >
            <MessagesSquare className="h-5 w-5 text-azure" />
            Apply on Discord
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAFF.map((m, i) => (
            <article
              key={m.role}
              className="flex flex-col overflow-hidden rounded-xl border-2 border-ink-700 bg-ink-950 shadow-[0_6px_0_var(--color-ink-950)]"
            >
              <div className="relative h-80 bg-[radial-gradient(ellipse_at_50%_85%,var(--color-ink-800)_0%,transparent_65%)]">
                <SkinCharacter
                  name={m.ign ?? m.role}
                  skinUrl={m.skinUrl}
                  look={m.look}
                  cape
                  capeLogo="/logo.webp"
                  capeColor={m.cape}
                  lines={m.lines}
                  firstWave={0.6 + i * 1.1}
                  compact
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 border-t-2 border-ink-800 p-5">
                <span
                  className={`self-start rounded-md border-2 border-ink-950 px-2.5 py-0.5 font-display text-sm uppercase tracking-wide ${m.badge}`}
                >
                  {m.role}
                </span>
                {m.ign && <p className="font-display text-2xl tracking-wide">{m.ign}</p>}
                <p className="text-sm leading-relaxed text-mist">{m.duty}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
