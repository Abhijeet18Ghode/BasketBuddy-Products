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
    domains: [
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'www.google.com',
      'whitmorerarebooks.cdn.bibliopolis.com',
      'example.com',  // Add example.com here
    ],
  },
};

export default nextConfig;
