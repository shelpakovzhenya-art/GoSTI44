import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import "./village.css";
import "./editorial.css";
import "./glass-motion.css";
import "./section-rhythm.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], weight: ["500", "600"], variable: "--font-brand", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteContent();
  return { title: site.name, robots: { index: false, follow: false } };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`}><body><a href="#main" className="skip-link">Перейти к содержимому</a>{children}</body></html>;
}
