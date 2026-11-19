export const SERVER_HOST = "play.scythemc.fun";
export const SERVER_PORT = 25565;
export const SERVER_ADDRESS = `${SERVER_HOST}:${SERVER_PORT}`;
export const DISCORD_URL = "https://discord.gg/C4p9fJ5aTS";
/** Where every "Buy" button sends players: the Discord invite for opening a purchase ticket. */
export const TICKET_URL = "https://discord.gg/FHHZeGq5";
/** Public site origin, used by the sitemap, robots.txt and metadata. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://scythemc.fun").replace(/\/$/, "");

export const FOUNDER = {
  name: "NAGESH449",
  instagram: { url: "https://www.instagram.com/nageshh449/", handle: "@nageshh449" },
  youtube: { url: "https://www.youtube.com/@Bellator_NT", handle: "@Bellator_NT" },
  discord: { url: "https://discord.gg/8JpW7GkhSW", handle: "Founder's Discord" },
};

/** Co-founder: shown on /founder beside the founder, no socials. */
export const CO_FOUNDER = {
  name: "starvosgamingyt",
};
