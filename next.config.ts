import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Pino out of the Turbopack bundle — its worker transport symlinks fail on Windows (os error 1314).
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
};

export default nextConfig;
