import { MessagesSquare } from "lucide-react";
import BrandIcon from "@/components/brand-icon";
import { TICKET_URL } from "@/lib/site";

const steps = [
  {
    title: "Join our Discord",
    desc: "Every Buy button takes you straight to the Scythe MC Discord.",
    face: "bg-azure text-frost shadow-[0_4px_0_var(--color-royal)]",
  },
  {
    title: "Open a ticket",
    desc: "Open a purchase ticket and tell us what you want to buy.",
    face: "bg-cyan text-ink-950 shadow-[0_4px_0_var(--color-azure)]",
  },
  {
    title: "Scan & pay",
    desc: "Pay with the UPI QR from your ticket using GPay, PhonePe, Paytm or BHIM.",
    face: "bg-gold text-ink-950 shadow-[0_4px_0_var(--color-ember)]",
  },
  {
    title: "Send IGN & proof",
    desc: "Post your Minecraft username and payment screenshot. Items are sent right away.",
    face: "bg-ember text-frost shadow-[0_4px_0_#9c2c06]",
  },
];

export default function HowToBuy() {
  return (
    <section id="how-to-buy" className="border-b-2 border-ink-800 bg-ink-900 py-20">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-pixel text-xs text-gold">PAYMENT & CLAIM</p>
            <h2 className="logo-type mt-3 font-display text-4xl uppercase tracking-wide md:text-5xl">
              How to buy
            </h2>
          </div>
          <a
            href={TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 self-start rounded-lg border-2 border-ink-950 bg-azure px-6 font-display uppercase tracking-wide text-frost shadow-[0_4px_0_var(--color-royal)] transition-transform active:translate-y-1 active:shadow-none md:self-auto"
          >
            <BrandIcon brand="discord" className="h-5 w-5" />
            Open a ticket
          </a>
        </div>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-4 rounded-xl border-2 border-ink-700 bg-ink-950 p-6">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 border-ink-950 font-display text-3xl ${s.face}`}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl tracking-wide">{s.title}</h3>
                <p className="mt-1 leading-relaxed text-mist">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 flex items-center gap-2 text-sm text-dim">
          <MessagesSquare className="h-4 w-4" />
          Buy buttons open Discord in a new tab, so you won&apos;t lose your place in the store.
        </p>
      </div>
    </section>
  );
}
