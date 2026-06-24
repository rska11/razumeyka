import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Разумейка — онлайн-школа развития детей",
  description:
    "Онлайн-школа развития детей: ментальная арифметика, скорочтение и другие направления. Занятия в мини-группах до 6 детей. Пробный урок 400 ₽.",
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
      </body>
    </html>
  );
}
