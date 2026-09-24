import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Українська версія живе в корені, англійська — під /en (мову обирає
     proxy.ts за країною або за вибором відвідувача).

     Колишні /uk-адреси жили недовго й більше не використовуються —
     ведемо їх на канонічні українські шляхи назавжди. Для /en такого
     правила більше НЕМАЄ: це знову робочий маршрут. */
  async redirects() {
    return [
      { source: "/uk", destination: "/", permanent: true },
      { source: "/uk/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
