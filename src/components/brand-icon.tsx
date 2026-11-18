import { siDiscord, siInstagram, siYoutube } from "simple-icons";

const ICONS = { instagram: siInstagram, youtube: siYoutube, discord: siDiscord };

export type Brand = keyof typeof ICONS;

/** Official brand glyphs from simple-icons (CC0), drawn in currentColor. */
export default function BrandIcon({ brand, className }: { brand: Brand; className?: string }) {
  const icon = ICONS[brand];
  return (
    <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={icon.path} />
    </svg>
  );
}
