import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // Script principalAdd commentMore actions
      {
        source: '/proxy.js',
        destination:
          'https://simpleanalyticsexternal.com/proxy.js?hostname=p12o.chat&path=/sa',
      },
      // (Opcional) script de eventos automáticos
      {
        source: '/auto-events.js',
        destination: 'https://scripts.simpleanalyticscdn.com/auto-events.js',
      },
      // Pixel + eventos
      {
        source: '/sa/:match*',
        destination: 'https://queue.simpleanalyticscdn.com/:match*',
      },
    ]
  }
};

export default nextConfig;
