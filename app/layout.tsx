import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { CookieConsent } from "@/components/CookieConsent.jsx";
import { YandexMetrika } from "@/components/analytics/YandexMetrika.jsx";

export const metadata: Metadata = {
  metadataBase: new URL("https://razumeyka-school.ru"),
  title: {
    default: "Разумейка — онлайн-школа развития детей 3–10+ лет",
    template: "%s — Разумейка",
  },
  description:
    "Онлайн-школа развития детей 3–10+ лет: правополушарное рисование, ментальная арифметика, скорочтение и другие направления. Самостоятельные уроки-игры, первые уроки бесплатно.",
  keywords: [
    "онлайн школа для детей",
    "ментальная арифметика онлайн",
    "скорочтение для детей",
    "развитие детей 3-10 лет",
    "правополушарное рисование",
    "Разумейка",
  ],
  applicationName: "Разумейка",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Разумейка",
    url: "https://razumeyka-school.ru",
    title: "Разумейка — онлайн-школа развития детей 3–10+ лет",
    description:
      "Правополушарное рисование, ментальная арифметика, скорочтение и другие направления онлайн. Самостоятельные уроки-игры, первые уроки бесплатно.",
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: "Разумейка — онлайн-школа развития детей 3–10+ лет" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
        <CookieConsent />
        {process.env.NODE_ENV === "production" && <YandexMetrika />}
      </body>
    </html>
  );
}
