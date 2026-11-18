import { MessagesSquare } from "lucide-react";
import SkinCharacter from "@/components/skin-character";
import { DISCORD_URL } from "@/lib/site";

interface StaffMember {
  role: string;
  /** In-game name; shown under the role once known. */
  ign?: string;
  duty: string;
  /** 64x64 skin in /public/skins/staff/. */
  skinUrl: string;
  badge: string;
  /** Cape cloth colour; every cape carries the SCYTHE MC logo on the back. */
  cape: string;
  lines: string[];
}

const ROLE = {
  admin: { badge: "bg-ember text-frost shadow-[0_3px_0_#9c2c06]", cape: "#a8320b" },
  developer: { badge: "bg-cyan text-ink-950 shadow-[0_3px_0_var(--color-azure)]", cape: "#1c2350" },
  manager: { badge: "bg-gold text-ink-950 shadow-[0_3px_0_var(--color-ember)]", cape: "#13288a" },
  event: { badge: "bg-frost text-ink-950 shadow-[0_3px_0_var(--color-mist)]", cape: "#0b6f8f" },
  helper: { badge: "bg-azure text-frost shadow-[0_3px_0_var(--color-royal)]", cape: "#0238c7" },
};

/*
 * One card per skin in assetes/staff skin/<role>/ (copied to public/skins/staff/).
 * Two skins in a role folder = two people in that role.
 * To show a name, set `ign`.
 */
const STAFF: StaffMember[] = [
  {
    role: "Admin",
    duty: "Keeps Scythe fair: handles reports, appeals and rule enforcement.",
    skinUrl: "/skins/staff/admin-1.png",
    ...ROLE.admin,
    lines: ["PLAY FAIR, HAVE FUN!", "REPORT HACKERS ON DISCORD!"],
  },
  {
    role: "Admin",
    duty: "Keeps Scythe fair: handles reports, appeals and rule enforcement.",
    skinUrl: "/skins/staff/admin-2.png",
    ...ROLE.admin,
    lines: ["RULES KEEP IT FUN!", "APPEALS? OPEN A TICKET!"],
  },
  {
    role: "Manager",
    duty: "Runs the staff team and keeps the server on track.",
    skinUrl: "/skins/staff/manager.png",
    ...ROLE.manager,
    lines: ["RUNNING THE TEAM!", "WANT TO JOIN? APPLY!"],
  },
  {
    role: "Developer",
    duty: "Builds the plugins, custom game modes and fixes behind the server.",
    skinUrl: "/skins/staff/developer-1.png",
    ...ROLE.developer,
    lines: ["SHIPPING NEW FEATURES!", "FOUND A BUG? TELL ME!"],
  },
  {
    role: "Developer",
    duty: "Builds the plugins, custom game modes and fixes behind the server.",
    skinUrl: "/skins/staff/developer-2.png",
    ...ROLE.developer,
    lines: ["CODING SOMETHING COOL!", "UPDATES COMING SOON!"],
  },
  {
    role: "Event Manager",
    duty: "Plans the weekly events, tournaments and giveaways.",
    skinUrl: "/skins/staff/event-manager.png",
    ...ROLE.event,
    lines: ["NEW EVENT THIS WEEK!", "JOIN THE SCYTHE CUP!"],
  },
  {
    role: "Helper",
    duty: "Your first stop for questions, in-game and on Discord.",
    skinUrl: "/skins/staff/helper-1.png",
    ...ROLE.helper,
    lines: ["NEED HELP? ASK ME!", "WELCOME TO SCYTHE!"],
  },
  {
    role: "Helper",
    duty: "Your first stop for questions, in-game and on Discord.",
    skinUrl: "/skins/staff/helper-2.png",
    ...ROLE.helper,
    lines: ["NEW HERE? SAY HI!", "ASK ME ANYTHING!"],
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
            <p className="mt-4 text-mist">
              The people keeping Scythe MC running. Say hi, they&apos;ll wave back. Drag one to see their cape.
            </p>
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

        {/* Flex-wrap so an uneven last row (e.g. 7 cards = 4 + 3) sits centred instead of leaving a hole */}
        <div className="flex flex-wrap justify-center gap-6">
          {STAFF.map((m, i) => (
            <article
              key={m.skinUrl}
              className="flex w-full flex-col overflow-hidden rounded-xl border-2 border-ink-700 bg-ink-950 shadow-[0_6px_0_var(--color-ink-950)] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
            >
              <div className="relative h-80 bg-[radial-gradient(ellipse_at_50%_85%,var(--color-ink-800)_0%,transparent_65%)]">
                <SkinCharacter
                  name={m.ign ?? m.role}
                  skinUrl={m.skinUrl}
                  cape
                  capeLogo="/logo.webp"
                  capeColor={m.cape}
                  lines={m.lines}
                  firstWave={0.6 + i * 0.9}
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
