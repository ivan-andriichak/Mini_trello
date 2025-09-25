import type { NextConfig } from "next";
import tailwindcss from "tailwindcss";

const nextConfig: NextConfig = {
  postcss(config: { plugins: (() => void)[]; }) {
    config.plugins.unshift(tailwindcss);
    return config;
  },
};

export default nextConfig;