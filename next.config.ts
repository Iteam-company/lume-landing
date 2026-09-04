import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Сайт повернувся до однієї української версії без /uk та /en.
     Старі locale-URL (жили короткий час) назавжди йдуть на канонічні
     українські шляхи — 308, щоб пошукові боти й браузери це запамʼятали. */
  async redirects() {
    return [
      { source: "/uk", destination: "/", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/uk/:path*", destination: "/:path*", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
