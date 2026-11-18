import { Star } from "lucide-react";
import { HIGHLIGHTS, REVIEWS } from "@/lib/reviews";

/** Five stars with partial fill for decimal ratings (4.9 → last star 90% gold). */
function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className={`relative inline-block ${size}`}>
            <Star className={`absolute inset-0 ${size} fill-ink-800 text-ink-700`} strokeWidth={2} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${size} fill-gold text-gold`} strokeWidth={2} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function Avatar({ name, ign }: { name: string; ign?: string }) {
  if (ign) {
    return (
      // Player head from their Minecraft skin
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://mc-heads.net/avatar/${encodeURIComponent(ign)}/40`}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        className="h-10 w-10 shrink-0 rounded-md border-2 border-ink-950 [image-rendering:pixelated]"
      />
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-ink-950 bg-azure font-display text-lg text-frost shadow-[0_3px_0_var(--color-royal)]">
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export default function ReviewsSection() {
  const rated = REVIEWS.filter((r) => r.rating !== undefined);
  const avg = rated.length ? rated.reduce((n, r) => n + (r.rating ?? 0), 0) / rated.length : 0;
  // two decimals so a 4.97 average is not shown rounded up to 5.0
  const avgLabel = (Math.round(avg * 100) / 100).toFixed(2);

  return (
    <section id="reviews" className="border-b-2 border-ink-800 py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="font-pixel text-xs text-gold">FROM OUR PLAYERS</p>
            <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">Player reviews</h2>
            <p className="mt-4 text-mist">Real words from real Scythe MC players, exactly as they wrote them.</p>
          </div>
          {rated.length > 0 && (
            <div className="flex items-center gap-4 self-start rounded-xl border-2 border-ink-700 bg-ink-900 px-5 py-3 shadow-[0_6px_0_var(--color-ink-950)] md:self-auto">
              <span className="logo-type-gold font-display text-5xl leading-none">{avgLabel}</span>
              <div>
                <Stars rating={avg} size="h-5 w-5" />
                <p className="mt-1.5 font-pixel text-[10px] text-mist">AVERAGE OF {rated.length} RATINGS</p>
              </div>
            </div>
          )}
        </div>

        {/* What players highlight */}
        <ul className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {HIGHLIGHTS.map((h) => (
            <li key={h.label} className="rounded-xl border-2 border-ink-700 bg-ink-900 p-4">
              <p className="flex items-center gap-2 font-display text-lg tracking-wide">
                <span aria-hidden>{h.emoji}</span>
                {h.label}
              </p>
              <p className="mt-1 text-xs leading-snug text-mist">{h.detail}</p>
            </li>
          ))}
        </ul>

        {/* Bento grid: fixed reading order, long reviews get wide/tall tiles, no holes */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <figure
              key={`${r.name}-${i}`}
              className={`flex flex-col gap-4 rounded-xl border-2 p-6 shadow-[0_6px_0_var(--color-ink-950)] ${
                r.size === "full"
                  ? "border-gold/60 bg-ink-800 md:col-span-2 lg:col-span-3"
                  : r.size === "wide"
                  ? "border-ink-700 bg-ink-800 md:col-span-2"
                  : r.size === "tall"
                    ? "border-ink-700 bg-ink-900 lg:row-span-2"
                    : "border-ink-700 bg-ink-900"
              }`}
            >
              {r.rating !== undefined && (
                <div className="flex items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="font-pixel text-[10px] text-gold">{r.rating.toFixed(1)}</span>
                </div>
              )}
              {r.title && (
                <p className={`font-display tracking-wide text-frost ${r.size === "wide" || r.size === "full" ? "text-2xl" : "text-xl"}`}>{r.title}</p>
              )}
              <blockquote className="flex flex-col gap-3 text-sm leading-relaxed text-mist">
                {r.text.split(/\n\s*\n/).map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t-2 border-ink-700/60 pt-4">
                <Avatar name={r.name} ign={r.ign} />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg tracking-wide">{r.name}</p>
                  <p className="font-pixel text-[10px] text-dim">PLAYER REVIEW</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
