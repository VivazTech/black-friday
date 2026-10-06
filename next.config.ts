import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O site é publicado em ofertas.vivazcataratas.com.br/black-friday
  basePath: "/black-friday",
  // A pasta do usuário tem outro package-lock.json; fixa a raiz neste projeto.
  turbopack: { root: __dirname },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/", destination: "/black-friday", basePath: false, permanent: false },
    ];
  },
};

export default nextConfig;
