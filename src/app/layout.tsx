import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/data/site";
import "./village.css";
import "./editorial.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], weight: ["500", "600"], variable: "--font-brand", display: "swap" });

export const metadata: Metadata = {
  title: `${site.name} — таунхаусы для отдыха в Костроме`,
  description: "Танжерин — место, где Вы дома. Три дома в Костроме: Лайм, Лимон и Цитрус. Своя кухня, веранда, мангальная зона и SPA в Лайме. Для семей и больших компаний.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`}><body><a href="#main" className="skip-link">Перейти к содержимому</a>{children}</body></html>;
}
