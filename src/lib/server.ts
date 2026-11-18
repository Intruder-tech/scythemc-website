"use client";

import { useCallback, useEffect, useState } from "react";

import { SERVER_HOST } from "./site";

export { SERVER_HOST, SERVER_PORT, SERVER_ADDRESS, DISCORD_URL } from "./site";

export type ServerStatus =
  | { state: "loading" }
  | { state: "online"; players: number; max: number }
  | { state: "offline" };

async function query(): Promise<ServerStatus> {
  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_HOST}`);
    if (res.ok) {
      const d = await res.json();
      return d.online
        ? { state: "online", players: d.players?.online ?? 0, max: d.players?.max ?? 0 }
        : { state: "offline" };
    }
  } catch {
    /* fall through to the backup API */
  }
  try {
    const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_HOST}`);
    if (res.ok) {
      const d = await res.json();
      return d.online
        ? { state: "online", players: d.players?.online ?? 0, max: d.players?.max ?? 0 }
        : { state: "offline" };
    }
  } catch {
    /* both APIs unreachable */
  }
  return { state: "offline" };
}

/** Live Java status, refreshed every 60s. */
export function useServerStatus(): ServerStatus {
  const [status, setStatus] = useState<ServerStatus>({ state: "loading" });

  useEffect(() => {
    let alive = true;
    const run = () => query().then((s) => alive && setStatus(s));
    run();
    const id = setInterval(run, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return status;
}

function legacyCopy(text: string): boolean {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(el);
  return ok;
}

/** Copy to clipboard with a fallback for insecure contexts (LAN IPs). Returns [copied, copy]. */
export function useCopy(text: string): [boolean, () => void] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    let ok = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        ok = legacyCopy(text);
      }
    } else {
      ok = legacyCopy(text);
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }, [text]);

  return [copied, copy];
}
