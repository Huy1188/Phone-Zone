import type { NextConfig } from "next";

const nextConfig = {
  images: {
  remotePatterns: [
    { protocol: "http", hostname: "localhost", port: "8000", pathname: "/img/**" },
    { protocol: "http", hostname: "localhost", port: "8000", pathname: "/static/**" },
  ],
}

};

export default nextConfig;


