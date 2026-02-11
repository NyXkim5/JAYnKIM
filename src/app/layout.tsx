import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/ui/Cursor";
import { ClickSoundProvider } from "@/components/ui/ClickSound";
import { BootSequence } from "@/components/ui/BootSequence";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Terminal } from "@/components/ui/Terminal";
import { KeyboardNav } from "@/components/ui/KeyboardNav";
import { KonamiCode } from "@/components/ui/KonamiCode";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jay Kim",
  description: "Software Engineer, AI/ML — Building systems that matter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <BootSequence />
        <Cursor />
        <ClickSoundProvider />
        <CommandPalette />
        <Terminal />
        <KeyboardNav />
        <KonamiCode />
        {children}
      </body>
    </html>
  );
}
