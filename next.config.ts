import type { NextConfig } from "next";

const config: NextConfig = {
  // Russian is the default: the bare domain always lands on /ru.
  async redirects() {
    return [{ source: "/", destination: "/ru", permanent: false }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default config;
