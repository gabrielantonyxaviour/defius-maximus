/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // ...
    config.externals["@solana/web3.js"] = "commonjs @solana/web3.js";
    config.externals.push("pino-pretty", "lokijs", "encoding");
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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "t.me",
        port: "",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
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
