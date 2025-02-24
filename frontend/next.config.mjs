/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // ...
    config.externals['@solana/web3.js'] = 'commonjs @solana/web3.js';
    return config;
  },
  async headers() {
    return [
      {
        source: "/quiz/:id*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
        ],
      },
      {
        source: "/embed/:id*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
        ],
      },
    ];
  },
  images: {
    domains: ['t.me', 'picsum.photos'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "noun-api.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "amethyst-impossible-ptarmigan-368.mypinata.cloud",
        port: "",
      },
      {
        protocol: "https",
        hostname: "robinx-ai.vercel.app",
        port: "",
      },
    ],
  },
};

export default nextConfig;
