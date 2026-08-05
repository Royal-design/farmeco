import type { NextConfig } from "next"

const apiTarget = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiTarget}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
