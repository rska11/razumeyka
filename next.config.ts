import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Папку сборки можно переопределить через NEXT_DIST_DIR — это нужно для
  // бесшовного деплоя: собираем в .next-pending, потом атомарно подменяем .next.
  // В рантайме (next start) переменная не задана → используется обычный .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Старые лендинги направлений (модель «педагог + мини-группы») заменены
  // продуктовыми страницами self-study. Отдаём вес старых URL новым.
  async redirects() {
    return [
      {
        source: "/right-brain-drawing",
        destination: "/risovanie",
        permanent: true,
      },
      {
        source: "/mental-arithmetic",
        destination: "/mentalnaya-arifmetika",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
