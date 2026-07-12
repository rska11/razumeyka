import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Папку сборки можно переопределить через NEXT_DIST_DIR — это нужно для
  // бесшовного деплоя: собираем в .next-pending, потом атомарно подменяем .next.
  // В рантайме (next start) переменная не задана → используется обычный .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Старый лендинг рисования (модель «педагог + мини-группы») заменён продуктом
  // /risovanie (self-study, подписка). Отдаём вес старого URL новому.
  async redirects() {
    return [
      {
        source: "/right-brain-drawing",
        destination: "/risovanie",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
