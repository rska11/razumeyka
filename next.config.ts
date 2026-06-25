import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Папку сборки можно переопределить через NEXT_DIST_DIR — это нужно для
  // бесшовного деплоя: собираем в .next-pending, потом атомарно подменяем .next.
  // В рантайме (next start) переменная не задана → используется обычный .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
