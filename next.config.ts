import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow local device origin(s) to access dev HMR/resources when on LAN.
  // Include both origin and plain host to satisfy different dev-client formats.
  allowedDevOrigins: [
    "http://192.168.70.159:3000",
    "http://192.168.70.159",
    "192.168.70.159",
    "ajaz-dev.loca.lt",
  ],
};

export default nextConfig;
