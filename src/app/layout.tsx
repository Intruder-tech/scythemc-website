import type { Metadata } from "next";
import { Lilita_One, Nunito, Silkscreen } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const lilita = Lilita_One({
  variable: "--font-lilita",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const description =
  "Official Scythe Store (PLAY.SCYTHEMC.FUN:25565). Purchase VIP, MVP, THE SCYTHE ranks, Crate Keys, spawners, and participate in tournaments.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Scythe MC • Official Minecraft Network Store",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Scythe MC",
    title: "Scythe MC • Official Minecraft Network Store",
    description,
    images: ["/logo.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${lilita.variable} ${nunito.variable} ${silkscreen.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: hide the intro if it already played this browser session. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("scythe-intro-seen")==="1")document.documentElement.dataset.intro="seen"}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
