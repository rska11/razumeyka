import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { CookieConsent } from "@/components/CookieConsent.jsx";

export const metadata: Metadata = {
  metadataBase: new URL("https://razumeyka-school.ru"),
  title: {
    default: "Разумейка — онлайн-школа развития детей 4–12 лет",
    template: "%s — Разумейка",
  },
  description:
    "Онлайн-школа развития детей 4–12 лет: ментальная арифметика, скорочтение, правополушарное рисование и другие направления. Занятия в мини-группах до 6 детей. Пробный урок 400 ₽.",
  keywords: [
    "онлайн школа для детей",
    "ментальная арифметика онлайн",
    "скорочтение для детей",
    "развитие детей 4-12 лет",
    "правополушарное рисование",
    "Разумейка",
  ],
  applicationName: "Разумейка",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Разумейка",
    url: "https://razumeyka-school.ru",
    title: "Разумейка — онлайн-школа развития детей 4–12 лет",
    description:
      "Ментальная арифметика, скорочтение, рисование и другие направления онлайн. Мини-группы до 6 детей. Пробный урок 400 ₽.",
    images: [{ url: "/images/course-arithmetic.webp", width: 1200, height: 630, alt: "Разумейка — онлайн-школа развития детей" }],
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
      </body>
    </html>
  );
}
