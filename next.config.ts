import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const baseConfig: NextConfig = {
  reactCompiler: true,
  // Allow local device origin(s) to access dev HMR/resources when on LAN.
  // Include both origin and plain host to satisfy different dev-client formats.
  allowedDevOrigins: [
    "http://192.168.70.159:3000",
    "http://192.168.70.159",
    "192.168.70.159",
    "ajaz-dev.loca.lt",
    "tangy-cars-sleep.loca.lt",
  ],
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withAnalyzer(baseConfig);

export default nextConfig;
