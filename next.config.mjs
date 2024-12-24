/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/products",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "whitmorerarebooks.cdn.bibliopolis.com",
      },
      {
        protocol: "https",
        hostname: "www.example.com",
      },
    ],
    domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "www.google.com",
      "whitmorerarebooks.cdn.bibliopolis.com",
      "example.com",
    ],
  },
};

export default nextConfig;
