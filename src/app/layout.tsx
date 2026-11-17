import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Silkscreen } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Scythe MC • Official Minecraft Network Store",
  description:
    "Official Scythe Store (PLAY.SCYTHEMC.FUN:25565). Purchase VIP, MVP, THE SCYTHE ranks, Crate Keys, spawners, and participate in tournaments.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${silkscreen.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#06070d] text-[#f1f5f9] overflow-x-hidden">{children}</body>
    </html>
  );
}
