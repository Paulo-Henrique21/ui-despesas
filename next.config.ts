import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // (opcionais) evita que o build quebre por lint/TS
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // (opcional) comprimir as respostas
  compress: true,
};

export default nextConfig;
