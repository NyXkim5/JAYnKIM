import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { KeyboardNav } from "@/components/ui/KeyboardNav";
import { TransitionProvider } from "@/components/transitions/TransitionProvider";
import { ReducedMotionWrapper } from "@/components/ui/ReducedMotionWrapper";
import { BASE_URL } from "@/data/config";

const Cursor = dynamic(() => import("@/components/ui/Cursor").then((m) => m.Cursor));
const ClickSoundProvider = dynamic(() => import("@/components/ui/ClickSound").then((m) => m.ClickSoundProvider));
const BootSequence = dynamic(() => import("@/components/ui/BootSequence").then((m) => m.BootSequence));
const Terminal = dynamic(() => import("@/components/ui/Terminal").then((m) => m.Terminal));
const KonamiCode = dynamic(() => import("@/components/ui/KonamiCode").then((m) => m.KonamiCode));

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "<> Jay Kim — Software Engineer </>",
    template: "%s | Jay Kim",
  },
  description: "Software engineer specializing in AI/ML, full-stack development, and design. Based in Orange County, CA.",
  openGraph: {
    title: "<> Jay Kim </>",
    description: "Software engineer specializing in AI/ML, full-stack development, and design.",
    url: BASE_URL,
    siteName: "Jay Kim",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "<> Jay Kim </>",
    description: "Software engineer specializing in AI/ML, full-stack development, and design.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jay Kim",
    url: BASE_URL,
    jobTitle: "Software Engineer",
    knowsAbout: ["AI/ML", "Full-Stack Development", "Design Systems"],
    sameAs: [
      "https://github.com/NyXkim5",
      "https://www.linkedin.com/in/joonhyuknkim/",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-accent-green focus:text-black focus:rounded focus:font-mono focus:text-sm"
        >
          Skip to content
        </a>
        <ReducedMotionWrapper>
          <BootSequence />
          <Cursor />
          <ClickSoundProvider />
          <TransitionProvider>
            <CommandPalette />
            <Terminal />
            <KeyboardNav />
            <KonamiCode />
            <div id="main-content">{children}</div>
          </TransitionProvider>
        </ReducedMotionWrapper>
      </body>
    </html>
  );
}
