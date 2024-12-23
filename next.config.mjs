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
<<<<<<< HEAD
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
=======
    domains: [
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'www.google.com',
      'whitmorerarebooks.cdn.bibliopolis.com',
      'example.com',  // Add example.com here
>>>>>>> 78be3113d31d6f0773323a0405d1d2dd71af0ab7
    ],
  },
};

export default nextConfig;
