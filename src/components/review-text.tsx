"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Review body capped at a compact height with a soft fade; a "Read more" button
 * appears only when the text actually overflows.
 */
export default function ReviewText({ text }: { text: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight > el.clientHeight + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clipped = !open && overflows;

  return (
    <div>
      <blockquote
        ref={ref}
        className={`flex flex-col gap-3 overflow-hidden text-sm leading-relaxed text-mist ${open ? "" : "max-h-[10.5rem]"}`}
        style={clipped ? { maskImage: "linear-gradient(to bottom, black 65%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent)" } : undefined}
      >
        {text.split(/\n\s*\n/).map((para, j) => (
          <p key={j}>{para}</p>
        ))}
      </blockquote>
      {(overflows || open) && (
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-2 font-pixel text-[10px] text-cyan transition-colors hover:text-frost"
        >
          {open ? "SHOW LESS ▲" : "READ MORE ▼"}
        </button>
      )}
    </div>
  );
}
